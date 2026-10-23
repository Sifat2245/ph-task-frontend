# Submitly

A focused assignment workspace for students, mentors, and admins. Built with Next.js 16 App Router, React 19, TypeScript, TanStack Query, TanStack Form, Axios, Tailwind CSS 4, and Phosphor icons.

## Run locally

Use Node.js 20.9+ and start the existing Express backend on port 5000. Then, in this frontend directory:

```sh
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000. Set `NEXT_PUBLIC_API_BASE_URL` in `.env` to your Express backend origin. Do not append `/api/v1`. Both Axios and server-side prefetching use this value; a missing value produces a clear configuration error.

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

The backend remains responsible for database migrations, seeding, Better Auth, JWT signing, role authorization, and assignment unlocking. Its API must be running for authenticated pages to load.

## Workspaces

| Role    | Available features                                                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Student | Assignment roadmap and progress, locked assignments, submission and skip forms, persistent submission results, marks and feedback, own profile |
| Mentor  | Submission inbox and filters, paginated students, student profiles, create/edit own reviews, assignment management, own profile                |
| Admin   | Mentor features plus create, update, and delete mentor accounts                                                                                |

The same sign-in page serves every role. Signup creates student accounts only. Mentors are created by admins.

Routes live under `/dashboard`: `/assignments`, `/assignments/:id`, `/my-submissions`, `/submissions`, `/submissions/:id`, `/reviews`, `/students`, `/students/:id`, `/mentors`, and `/profile`.

## Code structure

```text
app/                    App Router pages and loading/error boundaries
components/
  auth/                 Authentication form, user context, client role guards
  assignments/          Roadmap, submission/skip flow, assignment management
  dashboard/            Shared responsive shell and staff overview
  people/               Student directory/profiles and mentor management
  reviews/              Review form, submission details, personal review history
  submissions/          Submission list and revision/feedback presentation
  ui/                   Reusable controls, dialogs, skeletons, pagination, toast
config/routes.ts        Role-aware navigation
hooks/                  Query and mutation hooks; cache invalidation
lib/
  axios/httpClient.ts   Typed Axios helpers and API errors
  server/               Request-scoped authentication and server prefetching
  query-keys.ts         Shared keys for server hydration and client queries
provider/               App-level query and toast providers
services/               Typed API functions matching the Express routes
types/                  Backend response, payload, and domain types
proxy.ts                Next.js 16 optimistic authentication redirect
```

The service → query hook → component separation follows the reference project's approach. Server pages prefetch initial data into request-local query clients and hydrate matching query keys. Directory and inbox pages prefetch the next API page; detail links prefetch on hover. Successful mutations invalidate related caches. Query data stays fresh for 30 seconds and remains cached for five minutes; revisiting a cached page can show that data while stale queries refresh in the background. Next.js reuses visited page segments for five minutes through `experimental.staleTimes`, so warm navigation does not show the route skeleton again. First visits and expired route entries still show skeletons. Login/logout clear user-specific browser caches.

## API and authentication contract

Browser services call Express directly using `httpClient.get`, `post`, `put`, `patch`, and `delete`. Each helper returns `response.data`, preserving the backend envelope and pagination metadata. Request options support query parameters, headers, and an abort signal. The frontend has no API routes.

Axios uses `withCredentials: true` and a 30-second timeout. Express enables credentialed CORS for its configured `FRONTEND_URL`, which Better Auth also trusts. Configure the backend with `FRONTEND_URL=http://localhost:3000` for local development. Authentication cookies remain HttpOnly, use SameSite=Lax on local HTTP, and use Secure with SameSite=None in production.

Use the same hostname for the frontend and backend locally, such as `localhost:3000` and `localhost:5000`; avoid mixing `localhost` and `127.0.0.1`. Server guards and prefetching need cookies to reach the Next.js host too. For production, use the same host or shared subdomains and set the backend's optional `COOKIE_DOMAIN` to their common parent domain. Unrelated frontend/API domains do not share cookies with the current server guards.

`NEXT_PUBLIC_*` variables are included in the browser build. Restart development after editing `.env`, and rebuild production when changing the backend URL. Never put secrets in public environment variables.

Sign-in/signup use the **custom** `/api/v1/auth/signin` and `/api/v1/auth/signup` routes. Logout uses `/api/v1/auth/logout`. The native `/api/auth/get-session` response is handled separately because it returns `{ session, user }` or `null`, without the custom API envelope.

The optimistic proxy checks cookie presence. Server layouts/pages verify the native session without its cookie cache and call a protected backend endpoint to validate the access JWT as well. Backend middleware enforces the current user's role for every protected API request. Client guards provide navigation feedback; they are not the authorization boundary.

Tokens returned by login are never stored in localStorage or TanStack Query caches. Only the user object is retained. The backend currently has no refresh-token exchange route: an expired access token requires sign-in again even if a refresh cookie remains.

Custom responses keep the backend format:

```ts
{ statusCode, success, message, data, meta? }
// Paginated student/submission lists:
meta: { page, limit, total, totalPages }
```

## Deliberate backend constraints

- Assignment locking comes from `isLocked` and `progressState`. The UI never unlocks assignments based on local state alone. Submission or skip invalidates assignment data immediately.
- Submissions send exactly `{ assignmentId, submissionItems, note }`. `submissionItems` is plain text; separate project/repository/live URL fields do not exist in this backend. Both items and note are required.
- Reviews send `{ revisionId, marks, examineFeedback }`. Feedback is required. Marks are whole numbers between zero and the assignment maximum. Submission details include every reviewer’s marks and feedback. Review forms select the signed-in reviewer’s own review for editing; another reviewer’s feedback is displayed with its author’s name. Students see their latest submission and its received marks and feedback; previous revisions remain available to staff. Resubmission opens the form explicitly and returns to a pending result until the new work is reviewed.
- Staff student profiles expose account details and submitted assignments. There is no staff endpoint for another student's skips or exact progress/locking. The UI distinguishes "No submission" from "Skipped" and does not invent skip data.
- Student and submission lists use real backend pagination. Since there are no search/filter/statistics endpoints, submission filters and summary counts read actual API pages with `limit=100` and derive results in memory. Filtered results are paginated locally. For a large deployment, add backend filters/aggregates and replace `getSubmissionIndex`.
- Some Postman request URLs are stale or incomplete. Current Express routes take precedence, including `/auth/signup` and the named assignment CRUD routes.
- Mentor and assignment deletion conflicts are displayed from the backend. Deleting a mentor with reviews or an assignment with student activity is not silently bypassed.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

Production artifacts use `.next-production` so a concurrent development server cannot replace a running production preview’s build files.

The interface includes keyboard-accessible native dialogs with focus trapping and Escape dismissal, required field validation, busy states, inline errors, toast feedback, loading skeletons, empty states, responsive navigation, mobile record cards, and reduced-motion support.

Local verification covered the production build, ESLint, TypeScript, and Chrome flows against the real Express services backed by disposable PostgreSQL data: student signup/sign-in, cookie authentication/logout, submit/resubmit/skip and unlocking, review creation/editing, role restrictions, student pagination, mentor CRUD, and assignment CRUD. Keyboard handlers were exercised with DOM keyboard events because native key injection was unavailable in the local headless browser.

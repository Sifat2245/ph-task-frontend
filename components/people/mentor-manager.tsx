"use client";
import { ListPageSkeleton } from "@/components/ui/page-skeletons";
import { useState } from "react";
import { useMentors, useMentorMutations } from "@/hooks/use-staff";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/page-heading";
import { EmptyState, ErrorState, InlineError } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";

export function MentorManager() {
  const query = useMentors();
  const mutations = useMentorMutations();
  const [editor, setEditor] = useState<User | "new" | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const editing = editor && editor !== "new" ? editor : null;
  const saving = mutations.create.isPending || mutations.update.isPending;
  if (query.isPending) return <ListPageSkeleton />;
  if (query.error)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  const rows = (query.data?.data ?? []).filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  const open = (mentor: User | "new") => {
    mutations.create.reset();
    mutations.update.reset();
    setEditor(mentor);
  };
  const actions = (mentor: User) => (
    <div className="table-actions">
      <button
        className="icon-btn"
        aria-label={`Edit ${mentor.name}`}
        onClick={() => open(mentor)}
      >
        <Icon name="edit" size={17} />
      </button>
      <button
        className="icon-btn danger"
        aria-label={`Delete ${mentor.name}`}
        onClick={() => {
          mutations.remove.reset();
          setDeleting(mentor);
        }}
      >
        <Icon name="trash" size={17} />
      </button>
    </div>
  );
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="GREAT GUIDANCE STARTS WITH GREAT PEOPLE"
        title="Your mentors"
        description="Bring the right people together to help your students grow."
        action={
          <Button onClick={() => open("new")}>
            <Icon name="plus" size={17} />
            Create mentor
          </Button>
        }
      />
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>The team behind the feedback</h2>
            <p>{query.data?.data.length} mentors in your workspace</p>
          </div>
          <Icon name="mentors" size={21} />
        </div>
        <div className="filters">
          <div className="input-icon">
            <Icon name="search" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mentors…"
              aria-label="Search mentors by name or email"
            />
          </div>
        </div>
        {rows.length ? (
          <>
            <div className="table-wrap desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Mentor</th>
                    <th>Email address</th>
                    <th>Joined</th>
                    <th>Role</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((mentor) => (
                    <tr key={mentor.id}>
                      <td>
                        <div className="person-cell">
                          <Avatar name={mentor.name} />
                          <span className="table-primary">{mentor.name}</span>
                        </div>
                      </td>
                      <td>{mentor.email}</td>
                      <td>{formatDate(mentor.createdAt)}</td>
                      <td>
                        <span className="badge status-available">Mentor</span>
                      </td>
                      <td>{actions(mentor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-cards">
              {rows.map((mentor) => (
                <article key={mentor.id} className="mobile-record">
                  <div className="mobile-record-top">
                    <div className="person-cell">
                      <Avatar name={mentor.name} />
                      <div>
                        <span className="table-primary">{mentor.name}</span>
                        <span className="table-secondary">{mentor.email}</span>
                      </div>
                    </div>
                    {actions(mentor)}
                  </div>
                  <div className="mobile-record-bottom">
                    <span>Joined {formatDate(mentor.createdAt)}</span>
                    <span className="badge status-available">Mentor</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title={
              search
                ? "No mentors match your search"
                : "Make room for great mentors"
            }
            description={
              search
                ? "Try another name or email address."
                : "Create a mentor account to bring more guidance into your workspace."
            }
            icon="mentors"
          />
        )}
      </section>
      {editor && (
        <Modal
          title={editing ? "Edit mentor" : "Welcome a new mentor"}
          description={
            editing
              ? "Keep their details up to date."
              : "Create an account for someone who can help your students grow."
          }
          onClose={() => setEditor(null)}
          busy={saving}
        >
          <form
            className="form-stack"
            key={editing?.id ?? "new"}
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const name = String(form.get("name")).trim();
              const email = String(form.get("email")).trim();
              const password = String(form.get("password") ?? "");
              const image = String(form.get("image") ?? "").trim();
              if (!name || !email) return;
              try {
                if (editing)
                  await mutations.update.mutateAsync({
                    id: editing.id,
                    name,
                    email,
                    ...(password ? { password } : {}),
                    ...(image
                      ? { image }
                      : editing.image
                        ? { image: null }
                        : {}),
                  });
                else
                  await mutations.create.mutateAsync({
                    name,
                    email,
                    password,
                    ...(image ? { image } : {}),
                  });
                setEditor(null);
                toast(
                  editing
                    ? "Mentor details updated."
                    : "Your new mentor is ready to sign in.",
                );
              } catch {
                /* Inline error below. */
              }
            }}
          >
            <label className="field">
              Full name
              <input
                name="name"
                autoFocus
                required
                autoComplete="name"
                defaultValue={editing?.name ?? ""}
                placeholder="Mentor’s full name"
                disabled={saving}
              />
            </label>
            <label className="field">
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={editing?.email ?? ""}
                placeholder="mentor@example.com"
                disabled={saving}
              />
            </label>
            <label className="field">
              {editing ? "New password" : "Password"}
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required={!editing}
                placeholder={
                  editing
                    ? "Leave empty to keep their password"
                    : "At least 8 characters"
                }
                disabled={saving}
              />
              {editing && (
                <small>
                  Changing their email or password signs them out of existing
                  sessions.
                </small>
              )}
            </label>
            <label className="field">
              Profile image URL{" "}
              <span className="text-muted font-normal">(optional)</span>
              <input
                name="image"
                type="url"
                defaultValue={editing?.image ?? ""}
                placeholder="https://…"
                disabled={saving}
              />
            </label>
            <InlineError
              message={
                (editing ? mutations.update.error : mutations.create.error)
                  ?.message
              }
            />
            <div className="form-actions">
              <Button
                variant="secondary"
                onClick={() => setEditor(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={saving}
                loadingText={editing ? "Updating…" : "Creating…"}
              >
                {editing ? "Save changes" : "Create mentor"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal
          title="Remove this mentor?"
          description={deleting.name}
          onClose={() => setDeleting(null)}
          busy={mutations.remove.isPending}
        >
          <div className="confirm-symbol">
            <Icon name="trash" size={22} />
          </div>
          <p className="confirm-description">
            This permanently removes {deleting.name}’s account and access to
            Submitly. Mentors who have already written reviews can’t be removed.
          </p>
          <InlineError message={mutations.remove.error?.message} />
          <div className="form-actions mt-5">
            <Button
              variant="secondary"
              onClick={() => setDeleting(null)}
              disabled={mutations.remove.isPending}
            >
              Keep mentor
            </Button>
            <Button
              variant="danger"
              loading={mutations.remove.isPending}
              loadingText="Deleting…"
              onClick={async () => {
                try {
                  await mutations.remove.mutateAsync(deleting.id);
                  setDeleting(null);
                  toast("Mentor removed.");
                } catch {
                  /* Inline error above. */
                }
              }}
            >
              Delete mentor
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

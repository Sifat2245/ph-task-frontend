import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-layout">
      <section className="auth-story">
        <Link href="/" className="brand brand-light">
          <span className="brand-mark">
            <Icon name="send" weight="fill" size={23} />
          </span>
          submitly<span className="brand-period">.</span>
        </Link>
        <div className="auth-story-content">
          <span className="story-tag">
            <Icon name="sparkle" size={15} /> BUILD. SUBMIT. GROW.
          </span>
          <h1>
            Great work starts
            <br />
            with a little
            <br />
            <span>progress.</span>
          </h1>
          <p>
            A focused space to share your work, learn from feedback, and move
            forward. One assignment at a time.
          </p>
          <div className="story-workflow">
            <div>
              <span>
                <Icon name="send" />
              </span>
              <strong>Submit your work</strong>
              <p>Turn ideas into something real.</p>
            </div>
            <div>
              <span>
                <Icon name="reviews" />
              </span>
              <strong>Get thoughtful feedback</strong>
              <p>Learn, improve, and try again.</p>
            </div>
            <div>
              <span>
                <Icon name="trophy" />
              </span>
              <strong>Keep moving forward</strong>
              <p>Your next challenge is waiting.</p>
            </div>
          </div>
        </div>
        <div className="story-footer">
          <span>Made for your learning journey.</span>
          <Icon name="graduation" size={24} />
        </div>
      </section>
      <section className="auth-main">
        <Link href="/" className="brand mobile-brand">
          <span className="brand-mark">
            <Icon name="send" weight="fill" />
          </span>
          submitly.
        </Link>
        {children}
        <p className="auth-footer">A little progress, every assignment.</p>
      </section>
    </main>
  );
}

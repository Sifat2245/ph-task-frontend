"use client";
import { useAuth } from "@/components/auth/auth-guard";
import { PageHeading } from "@/components/ui/page-heading";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/format";

export function MyProfile() {
  const user = useAuth();
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="YOUR LITTLE CORNER OF SUBMITLY"
        title="Your profile"
        description="The person behind the progress."
      />
      <section className="panel max-w-3xl">
        <div className="profile-header">
          <Avatar name={user.name} size="lg" />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="profile-tag">
              {user.role === "ADMIN"
                ? "Admin"
                : user.role === "MENTOR"
                  ? "Mentor"
                  : "Student"}
            </span>
          </div>
        </div>
        <div className="panel-body border-t border-border">
          <div className="detail-meta max-w-lg">
            <div className="detail-meta-row">
              <span>Full name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="detail-meta-row">
              <span>Email address</span>
              <strong className="break-all text-right">{user.email}</strong>
            </div>
            {user.studentId && (
              <div className="detail-meta-row">
                <span>Student ID</span>
                <strong>{user.studentId}</strong>
              </div>
            )}
            <div className="detail-meta-row">
              <span>Member since</span>
              <strong>{formatDate(user.createdAt)}</strong>
            </div>
            <div className="detail-meta-row">
              <span>Workspace role</span>
              <strong>{user.role.toLowerCase()}</strong>
            </div>
          </div>
        </div>
      </section>
      <div className="guidance max-w-3xl">
        <Icon name="mentors" size={17} />
        <p>
          Your workspace role determines what you can access. Contact your admin
          if your account details need to change.
        </p>
      </div>
    </div>
  );
}

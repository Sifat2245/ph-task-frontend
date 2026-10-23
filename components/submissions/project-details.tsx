import { Icon } from "@/components/ui/icon";
import { projectUrl } from "@/lib/project";
import type { Revision } from "@/types";

type Project = Pick<
  Revision,
  "projectName" | "repoUrl" | "liveLink" | "description" | "note"
>;

export function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="form-stack">
      <div>
        <p className="content-label">Project name</p>
        <p className="submission-text font-semibold">{project.projectName}</p>
      </div>
      {(
        [
          ["Repository URL", project.repoUrl],
          ["Live link", project.liveLink],
        ] as const
      ).map(([label, value]) => {
        const href = projectUrl(value);
        return (
          <div key={label}>
            <p className="content-label">{label}</p>
            {href ? (
              <a
                className="text-link break-all"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value}
                <Icon name="external" size={14} />
              </a>
            ) : (
              <p className="text-muted text-sm">Not provided</p>
            )}
          </div>
        );
      })}
      <div>
        <p className="content-label">Project description</p>
        <p className="submission-text">{project.description}</p>
      </div>
      {project.note && (
        <div>
          <p className="content-label">Note to reviewer</p>
          <p className="submission-text">{project.note}</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useSubmitAssignment } from "@/hooks/use-assignments";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { InlineError } from "@/components/ui/feedback";
import { projectUrl } from "@/lib/project";
import type { Revision } from "@/types";

export function SubmissionForm({
  assignmentId,
  initialRevision,
  onSubmitted,
  onCancel,
  onSkip,
}: {
  assignmentId: string;
  initialRevision?: Revision;
  onSubmitted: () => void;
  onCancel?: () => void;
  onSkip?: () => void;
}) {
  const [values, setValues] = useState({
    projectName: initialRevision?.projectName ?? "",
    repoUrl: initialRevision?.repoUrl ?? "",
    liveLink: initialRevision?.liveLink ?? "",
    description: initialRevision?.description ?? "",
    note: initialRevision?.note ?? "",
  });
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const submit = useSubmitAssignment();
  const unchanged =
    !!initialRevision &&
    Object.entries(values).every(
      ([field, value]) =>
        value.trim() === initialRevision[field as keyof typeof values],
    );
  const empty =
    !values.projectName.trim() ||
    !values.repoUrl.trim() ||
    !values.liveLink.trim() ||
    !values.description.trim();
  return (
    <form
      className="panel-body form-stack"
      onSubmit={async (event) => {
        event.preventDefault();
        if (inFlight.current) return;
        const repoUrl = projectUrl(values.repoUrl);
        const liveLink = projectUrl(values.liveLink);
        if (!repoUrl || !liveLink) {
          setError(
            "Repository URL and live link must be HTTP or HTTPS URLs without embedded credentials.",
          );
          return;
        }
        if (
          values.projectName.trim().length < 3 ||
          values.description.trim().length < 10
        ) {
          setError(
            "Use at least 3 characters for the project name and 10 for the description.",
          );
          return;
        }
        inFlight.current = true;
        setError("");
        try {
          await submit.mutateAsync({
            assignmentId,
            projectName: values.projectName.trim(),
            repoUrl,
            liveLink,
            description: values.description.trim(),
            note: values.note.trim(),
          });
          onSubmitted();
        } catch {
          // The mutation error is displayed beside the form.
        } finally {
          inFlight.current = false;
        }
      }}
    >
      <label className="field">
        Project name
        <input
          name="projectName"
          required
          minLength={3}
          maxLength={150}
          placeholder="Give your project a name"
          value={values.projectName}
          onChange={(e) =>
            setValues({ ...values, projectName: e.target.value })
          }
          disabled={submit.isPending}
        />
      </label>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {(
          [
            ["repoUrl", "Repository URL", "https://github.com/you/project"],
            ["liveLink", "Live link", "https://your-project.vercel.app"],
          ] as const
        ).map(([name, label, placeholder]) => (
          <label className="field" key={name}>
            {label}
            <input
              type="url"
              name={name}
              required
              maxLength={2048}
              pattern="https?://.*"
              placeholder={placeholder}
              value={values[name]}
              onChange={(e) => setValues({ ...values, [name]: e.target.value })}
              disabled={submit.isPending}
            />
          </label>
        ))}
      </div>
      <label className="field">
        Project description
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={10000}
          placeholder="Describe what you built, its features, and how it works."
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          disabled={submit.isPending}
          rows={4}
        />
      </label>
      <label className="field">
        Note to your reviewer (optional)
        <textarea
          name="note"
          maxLength={5000}
          placeholder="Anything else your reviewer should know?"
          value={values.note}
          onChange={(e) => setValues({ ...values, note: e.target.value })}
          disabled={submit.isPending}
          rows={3}
        />
      </label>
      {unchanged && (
        <p className="text-sm text-muted">
          Update your project details before resubmitting.
        </p>
      )}
      <InlineError message={error || submit.error?.message} />
      <div className="form-actions">
        {onCancel && (
          <Button
            variant="secondary"
            disabled={submit.isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        {onSkip && (
          <Button
            variant="secondary"
            onClick={onSkip}
            disabled={submit.isPending}
          >
            <Icon name="skip" size={16} />
            Skip assignment
          </Button>
        )}
        <Button
          type="submit"
          disabled={empty || unchanged}
          loading={submit.isPending}
          loadingText="Submitting…"
        >
          <Icon name="send" size={16} />
          {initialRevision ? "Resubmit assignment" : "Submit assignment"}
        </Button>
      </div>
    </form>
  );
}

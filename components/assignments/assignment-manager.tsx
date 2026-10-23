"use client";
import { CardsPageSkeleton } from "@/components/ui/page-skeletons";
import Link from "next/link";
import { useState } from "react";
import {
  useAssignments,
  useAssignmentMutations,
} from "@/hooks/use-assignments";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/page-heading";
import { EmptyState, ErrorState, InlineError } from "@/components/ui/feedback";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { Assignment } from "@/types";

export function AssignmentManager() {
  const query = useAssignments();
  const mutations = useAssignmentMutations();
  const [editor, setEditor] = useState<Assignment | "new" | null>(null);
  const [deleting, setDeleting] = useState<Assignment | null>(null);
  const toast = useToast();
  const editing = editor && editor !== "new" ? editor : null;
  const saving = mutations.create.isPending || mutations.update.isPending;
  const error = editing ? mutations.update.error : mutations.create.error;
  if (query.isPending) return <CardsPageSkeleton />;
  if (query.error)
    return <ErrorState error={query.error} retry={() => query.refetch()} />;
  const open = (assignment: Assignment | "new") => {
    mutations.create.reset();
    mutations.update.reset();
    setEditor(assignment);
  };
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="BUILD THE LEARNING PATH"
        title="Assignments"
        description="Thoughtful challenges for the next generation of builders."
        action={
          <Button onClick={() => open("new")}>
            <Icon name="plus" size={17} />
            Create assignment
          </Button>
        }
      />
      <div className="guidance">
        <Icon name="info" size={17} />
        <p>
          Assignment numbers set the learning order. Students submit or skip
          earlier assignments to unlock later ones.
        </p>
      </div>
      {!query.data?.data.length ? (
        <div className="panel">
          <EmptyState
            title="Make room for great work"
            description="Create the first assignment to start your students’ learning journey."
            icon="assignments"
          />
        </div>
      ) : (
        <div className="assignment-grid">
          {query.data.data.map((assignment, index) => (
            <article key={assignment.id} className="assignment-card">
              <div className="assignment-card-body">
                <div className="assignment-card-top">
                  <span className={`assignment-symbol symbol-${index % 3}`}>
                    <Icon name="assignments" weight="duotone" size={23} />
                  </span>
                  <span className="badge status-submitted">
                    {assignment.maxMarks} marks
                  </span>
                </div>
                <p className="assignment-number">
                  ASSIGNMENT{" "}
                  {String(assignment.assignmentNumber).padStart(2, "0")}
                </p>
                <h3>{assignment.title}</h3>
                <p className="assignment-description">
                  {assignment.description}
                </p>
                <div className="assignment-card-meta">
                  <span>
                    <Icon name="calendar" size={14} />
                    {formatDate(assignment.createdAt)}
                  </span>
                  <Link
                    className="text-link"
                    href={`/dashboard/assignments/${assignment.id}`}
                  >
                    View brief
                    <Icon name="external" size={12} />
                  </Link>
                </div>
              </div>
              <div className="assignment-card-footer flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => open(assignment)}
                >
                  <Icon name="edit" size={14} />
                  Edit assignment
                </Button>
                <button
                  className="icon-btn danger"
                  aria-label={`Delete ${assignment.title}`}
                  onClick={() => {
                    mutations.remove.reset();
                    setDeleting(assignment);
                  }}
                >
                  <Icon name="trash" size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editor && (
        <Modal
          title={editing ? "Edit assignment" : "Create a new challenge"}
          description="Keep the brief clear, focused, and inspiring."
          onClose={() => setEditor(null)}
          busy={saving}
          wide
        >
          <form
            className="form-stack"
            key={editing?.id ?? "new"}
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const payload = {
                assignmentNumber: Number(form.get("assignmentNumber")),
                title: String(form.get("title")).trim(),
                description: String(form.get("description")).trim(),
                maxMarks: Number(form.get("maxMarks")),
              };
              if (!payload.title || !payload.description) return;
              try {
                if (editing)
                  await mutations.update.mutateAsync({
                    id: editing.id,
                    ...payload,
                  });
                else await mutations.create.mutateAsync(payload);
                setEditor(null);
                toast(
                  editing ? "Assignment updated." : "A new challenge is ready.",
                );
              } catch {
                /* Inline error below. */
              }
            }}
          >
            <div className="field-row">
              <label className="field">
                Assignment number
                <input
                  type="number"
                  min={1}
                  max={2147483647}
                  step={1}
                  required
                  name="assignmentNumber"
                  defaultValue={
                    editing?.assignmentNumber ??
                    (query.data?.data.at(-1)?.assignmentNumber ?? 0) + 1
                  }
                  disabled={saving}
                />
              </label>
              <label className="field">
                Maximum marks
                <input
                  type="number"
                  min={1}
                  max={2147483647}
                  step={1}
                  required
                  name="maxMarks"
                  defaultValue={editing?.maxMarks ?? 50}
                  disabled={saving}
                />
              </label>
            </div>
            <label className="field">
              Assignment title
              <input
                name="title"
                required
                autoFocus
                defaultValue={editing?.title ?? ""}
                placeholder="Give your challenge a clear name"
                disabled={saving}
              />
            </label>
            <label className="field">
              Description
              <textarea
                name="description"
                required
                rows={6}
                defaultValue={editing?.description ?? ""}
                placeholder="What should students build? What does a great submission include?"
                disabled={saving}
              />
            </label>
            <InlineError message={error?.message} />
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
                {editing ? "Save changes" : "Create assignment"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal
          title="Delete this assignment?"
          description={deleting.title}
          onClose={() => setDeleting(null)}
          busy={mutations.remove.isPending}
        >
          <div className="confirm-symbol">
            <Icon name="trash" size={23} />
          </div>
          <p className="confirm-description">
            This permanently removes assignment {deleting.assignmentNumber}.
            Assignments with student activity can’t be deleted.
          </p>
          <InlineError message={mutations.remove.error?.message} />
          <div className="form-actions mt-5">
            <Button
              variant="secondary"
              onClick={() => setDeleting(null)}
              disabled={mutations.remove.isPending}
            >
              Keep assignment
            </Button>
            <Button
              variant="danger"
              loading={mutations.remove.isPending}
              loadingText="Deleting…"
              onClick={async () => {
                try {
                  await mutations.remove.mutateAsync(deleting.id);
                  setDeleting(null);
                  toast("Assignment deleted.");
                } catch {
                  /* Inline error above. */
                }
              }}
            >
              Delete assignment
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useReviewMutations } from "@/hooks/use-staff";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { InlineError } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import type { Review } from "@/types";

export function ReviewForm({
  revisionId,
  maxMarks,
  existing,
  onSuccess,
  onCancel,
  onPendingChange,
}: {
  revisionId: string;
  maxMarks: number;
  existing?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [marks, setMarks] = useState(existing ? String(existing.marks) : "");
  const [feedback, setFeedback] = useState(existing?.examineFeedback ?? "");
  const mutations = useReviewMutations();
  const mutation = existing ? mutations.update : mutations.create;
  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);
  const toast = useToast();
  return (
    <form
      className="form-stack"
      onSubmit={async (event) => {
        event.preventDefault();
        const value = Number(marks);
        if (
          !Number.isInteger(value) ||
          value < 0 ||
          value > maxMarks ||
          !feedback.trim()
        )
          return;
        try {
          if (existing)
            await mutations.update.mutateAsync({
              id: existing.id,
              marks: value,
              examineFeedback: feedback.trim(),
            });
          else
            await mutations.create.mutateAsync({
              revisionId,
              marks: value,
              examineFeedback: feedback.trim(),
            });
          toast(
            existing
              ? "Your review has been updated."
              : "Review submitted. A little guidance goes a long way.",
          );
          onSuccess?.();
        } catch {
          /* Inline error below. */
        }
      }}
    >
      <label className="field">
        Marks
        <div className="flex items-center gap-3">
          <input
            type="number"
            name="marks"
            className="max-w-36"
            min={0}
            max={maxMarks}
            step={1}
            required
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            disabled={mutation.isPending}
            placeholder="0"
          />
          <span className="text-xs text-muted">out of {maxMarks}</span>
        </div>
        <small>Use a whole number between 0 and {maxMarks}.</small>
      </label>
      <label className="field">
        Feedback
        <textarea
          name="examineFeedback"
          required
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={mutation.isPending}
          placeholder="What worked well? Where could they take it further?"
          rows={5}
        />
        <small>Give your student something useful to build on.</small>
      </label>
      <InlineError message={mutation.error?.message} />
      <div className="form-actions">
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          loading={mutation.isPending}
          loadingText={existing ? "Updating…" : "Reviewing…"}
          disabled={!marks.trim() || !feedback.trim()}
        >
          <Icon name="reviews" size={17} />
          {existing ? "Update review" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}

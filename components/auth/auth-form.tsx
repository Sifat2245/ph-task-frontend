"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthenticate } from "@/hooks/use-auth";
import { safeNext } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { InlineError } from "@/components/ui/feedback";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const signup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuthenticate(mode);
  const router = useRouter();
  const params = useSearchParams();
  const form = useForm({
    defaultValues: { name: "", email: "", password: "", rememberMe: true },
    onSubmit: async ({ value }) => {
      try {
        await auth.mutateAsync(
          signup
            ? {
                name: value.name.trim(),
                email: value.email.trim(),
                password: value.password,
              }
            : {
                email: value.email.trim(),
                password: value.password,
                rememberMe: value.rememberMe,
              },
        );
        router.replace(safeNext(params.get("next")));
        router.refresh();
      } catch {
        /* The mutation error is shown next to the form. */
      }
    },
  });
  return (
    <div className="auth-form">
      <span className="auth-welcome">
        <Icon
          name={signup ? "graduation" : "send"}
          size={27}
          weight="duotone"
        />
      </span>
      <p className="eyebrow">YOUR NEXT CHAPTER</p>
      <h2>{signup ? "Let’s make progress." : "Welcome back."}</h2>
      <p className="auth-intro">
        {signup
          ? "Create your student account and start building."
          : "Your next great assignment is waiting for you."}
      </p>
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        {signup && (
          <form.Field name="name">
            {(field) => (
              <label className="field">
                Full name
                <input
                  autoFocus
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                  maxLength={150}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={auth.isPending}
                />
              </label>
            )}
          </form.Field>
        )}
        <form.Field name="email">
          {(field) => (
            <label className="field">
              Email address
              <div className="input-icon">
                <Icon name="email" size={18} />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  autoFocus={!signup}
                  placeholder="you@example.com"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={auth.isPending}
                />
              </div>
            </label>
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <label className="field">
              Password
              <div className="input-icon input-password">
                <Icon name="lock" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={signup ? "new-password" : "current-password"}
                  placeholder={
                    signup ? "Create a strong password" : "Enter your password"
                  }
                  required
                  minLength={signup ? 8 : 1}
                  maxLength={128}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={auth.isPending}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
              {signup && <small>Use 8–128 characters.</small>}
            </label>
          )}
        </form.Field>
        {!signup && (
          <form.Field name="rememberMe">
            {(field) => (
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                Keep me signed in
              </label>
            )}
          </form.Field>
        )}
        <InlineError message={auth.error?.message} />
        <Button
          className="w-full"
          type="submit"
          loading={auth.isPending}
          loadingText={signup ? "Creating your account…" : "Signing in…"}
        >
          {signup ? "Create student account" : "Sign in"}
          <Icon name="arrow" size={17} />
        </Button>
      </form>
      <div className="auth-switch">
        {signup ? "Already part of Submitly?" : "New to Submitly?"}{" "}
        <Link href={signup ? "/signin" : "/signup"}>
          {signup ? "Sign in" : "Create an account"}
          <Icon name="arrow" size={14} />
        </Link>
      </div>
      <div className="auth-note">
        <Icon name="mentors" size={16} />
        <span>
          {signup
            ? "Student accounts only. Mentors are invited by an admin."
            : "One sign-in for students, mentors, and admins."}
        </span>
      </div>
    </div>
  );
}

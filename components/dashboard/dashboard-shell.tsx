"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-guard";
import { useLogout } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { Icon, type IconName } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { navigation } from "@/config/routes";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const logout = useLogout();
  const toast = useToast();
  const label =
    [...navigation].reverse().find((item) => pathname.startsWith(item.href))
      ?.label ?? "Overview";
  useEffect(() => {
    if (open) drawer.current?.showModal();
    else drawer.current?.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const sidebar = (
    <>
      <Link className="brand" href="/dashboard" onClick={() => setOpen(false)}>
        <span className="brand-mark">
          <Icon name="send" weight="fill" size={23} />
        </span>
        submitly<span className="brand-period">.</span>
      </Link>
      <p className="nav-label">WORKSPACE</p>
      <nav aria-label="Main navigation">
        {navigation
          .filter((item) =>
            (item.roles as readonly string[]).includes(user.role),
          )
          .map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`nav-item ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  name={item.icon as IconName}
                  weight={active ? "duotone" : "regular"}
                  size={20}
                />
                <span>{item.label}</span>
                {active && <span className="nav-active-dot" />}
              </Link>
            );
          })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <Icon name="sparkle" size={22} />
          <strong>
            {user.role === "STUDENT"
              ? "Small steps. Big things."
              : "Your feedback matters."}
          </strong>
          <p>
            {user.role === "STUDENT"
              ? "Every assignment is another chance to get a little better."
              : "Help someone turn their next submission into their best work."}
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className={`nav-item ${pathname === "/dashboard/profile" ? "active" : ""}`}
          onClick={() => setOpen(false)}
        >
          <Icon name="profile" />
          <span>My profile</span>
        </Link>
        <button
          className="nav-item logout-btn"
          disabled={logout.isPending}
          onClick={() =>
            logout.mutate(undefined, {
              onError: (error) => toast(error.message, "error"),
            })
          }
        >
          <Icon
            name={logout.isPending ? "spinner" : "logout"}
            className={logout.isPending ? "spin" : ""}
          />
          <span>{logout.isPending ? "Signing out…" : "Sign out"}</span>
        </button>
        <div className="sidebar-account">
          <Avatar name={user.name} />
          <div>
            <strong>{user.name}</strong>
            <span>{user.studentId ?? user.email}</span>
          </div>
        </div>
      </div>
    </>
  );
  return (
    <div className="dashboard">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">{sidebar}</aside>
      <dialog
        ref={drawer}
        className="mobile-drawer"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          }
        }}
        onCancel={() => setOpen(false)}
        aria-label="Navigation menu"
      >
        <button
          className="icon-btn drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <Icon name="close" />
        </button>
        {sidebar}
      </dialog>
      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn mobile-menu"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Icon name="menu" />
            </button>
            <span className="breadcrumb-workspace">Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>
              {pathname === "/dashboard/profile" ? "My profile" : label}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="workspace-live">Let’s make progress</span>
            <Link href="/dashboard/profile" aria-label="Your profile">
              <Avatar name={user.name} size="sm" />
            </Link>
          </div>
        </header>
        <main id="main-content" className="dashboard-content">
          {children}
        </main>
        <footer className="dashboard-footer">
          <span>© Submitly</span>
          <span>A little progress, every assignment.</span>
        </footer>
      </div>
    </div>
  );
}

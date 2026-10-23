import type { ReactNode } from "react";
import { Skeleton } from "./feedback";
import "./page-skeletons.css";

function LoadingPage({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div
      className="page-stack page-loading"
      role="status"
      aria-label={label}
      aria-busy="true"
    >
      {children}
      <span className="sr-only">{label}…</span>
    </div>
  );
}

function HeadingSkeleton() {
  return (
    <div className="page-loading-heading">
      <Skeleton className="page-loading-eyebrow" />
      <Skeleton className="page-loading-title" />
      <Skeleton className="page-loading-subtitle" />
    </div>
  );
}

function PanelSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <Skeleton className="page-loading-label" />
      </div>
      <div className="panel-body page-loading-lines">
        <Skeleton className="page-loading-line" />
        <Skeleton className="page-loading-line" />
        <Skeleton className="page-loading-line page-loading-short" />
        {tall && <Skeleton className="page-loading-block" />}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <LoadingPage label="Loading details">
      <Skeleton className="page-loading-back" />
      <HeadingSkeleton />
      <div className="detail-grid">
        <div className="detail-grid-main">
          <PanelSkeleton />
          <PanelSkeleton tall />
        </div>
        <aside className="detail-aside">
          <PanelSkeleton />
          <Skeleton className="page-loading-aside" />
        </aside>
      </div>
    </LoadingPage>
  );
}

export function ListPageSkeleton() {
  return (
    <LoadingPage label="Loading list">
      <HeadingSkeleton />
      <div className="panel">
        <div className="panel-heading">
          <Skeleton className="page-loading-label" />
        </div>
        <div className="page-loading-table">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="page-loading-row" key={index}>
              <Skeleton className="page-loading-avatar" />
              <div className="page-loading-person">
                <Skeleton className="page-loading-line" />
                <Skeleton className="page-loading-line page-loading-short" />
              </div>
              <Skeleton className="page-loading-cell" />
              <Skeleton className="page-loading-cell" />
            </div>
          ))}
        </div>
      </div>
    </LoadingPage>
  );
}

export function CardsPageSkeleton() {
  return (
    <LoadingPage label="Loading assignments">
      <HeadingSkeleton />
      <div className="assignment-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <PanelSkeleton tall key={index} />
        ))}
      </div>
    </LoadingPage>
  );
}

export function WorkPageSkeleton() {
  return (
    <LoadingPage label="Loading submissions and feedback">
      <HeadingSkeleton />
      <PanelSkeleton tall />
      <PanelSkeleton tall />
    </LoadingPage>
  );
}

export function ProfilePageSkeleton() {
  return (
    <LoadingPage label="Loading profile">
      <HeadingSkeleton />
      <div className="panel page-loading-profile">
        <div className="profile-header">
          <Skeleton className="page-loading-profile-avatar" />
          <div className="page-loading-person">
            <Skeleton className="page-loading-label" />
            <Skeleton className="page-loading-line" />
          </div>
        </div>
        <div className="panel-body page-loading-lines">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton className="page-loading-line" key={index} />
          ))}
        </div>
      </div>
    </LoadingPage>
  );
}

export function AuthPageSkeleton() {
  return (
    <div
      className="auth-form page-loading page-loading-auth"
      role="status"
      aria-label="Loading authentication form"
      aria-busy="true"
    >
      <Skeleton className="page-loading-profile-avatar" />
      <HeadingSkeleton />
      {Array.from({ length: 3 }, (_, index) => (
        <div className="page-loading-lines" key={index}>
          <Skeleton className="page-loading-label" />
          <Skeleton className="page-loading-input" />
        </div>
      ))}
      <Skeleton className="page-loading-input" />
      <span className="sr-only">Loading authentication form…</span>
    </div>
  );
}

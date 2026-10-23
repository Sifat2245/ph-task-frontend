"use client";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  CheckIcon,
  CheckCircleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChartPieSliceIcon,
  ClipboardTextIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  FileTextIcon,
  GraduationCapIcon,
  InfoIcon,
  ListIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  PlusIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SkipForwardIcon,
  SparkleIcon,
  SpinnerGapIcon,
  TrashIcon,
  TrophyIcon,
  UserCircleIcon,
  UsersIcon,
  WarningCircleIcon,
  XIcon,
  GitBranchIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react";

const icons = {
  arrow: ArrowRightIcon,
  back: ArrowLeftIcon,
  external: ArrowUpRightIcon,
  book: BookOpenIcon,
  check: CheckIcon,
  success: CheckCircleIcon,
  left: CaretLeftIcon,
  right: CaretRightIcon,
  overview: ChartPieSliceIcon,
  assignments: ClipboardTextIcon,
  clock: ClockIcon,
  email: EnvelopeSimpleIcon,
  eye: EyeIcon,
  eyeOff: EyeSlashIcon,
  submissions: FileTextIcon,
  graduation: GraduationCapIcon,
  info: InfoIcon,
  menu: ListIcon,
  lock: LockSimpleIcon,
  search: MagnifyingGlassIcon,
  send: PaperPlaneTiltIcon,
  edit: PencilSimpleIcon,
  plus: PlusIcon,
  mentors: ShieldCheckIcon,
  logout: SignOutIcon,
  skip: SkipForwardIcon,
  sparkle: SparkleIcon,
  spinner: SpinnerGapIcon,
  trash: TrashIcon,
  trophy: TrophyIcon,
  profile: UserCircleIcon,
  students: UsersIcon,
  reviews: CheckCircleIcon,
  warning: WarningCircleIcon,
  close: XIcon,
  revision: GitBranchIcon,
  calendar: CalendarBlankIcon,
};
export type IconName = keyof typeof icons;
export function Icon({
  name,
  size = 20,
  className = "",
  weight = "regular",
}: {
  name: IconName;
  size?: number;
  className?: string;
  weight?: "regular" | "bold" | "fill" | "duotone";
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      weight={weight}
      className={className}
      aria-hidden="true"
    />
  );
}

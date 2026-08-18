import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AVATAR_PALETTE = [
  "var(--color-action)",
  "#0369a1",
  "var(--color-status-pending)",
  "var(--color-status-hold)",
  "var(--color-status-paid)",
] as const;

function employeeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(id: number): string {
  return AVATAR_PALETTE[id % AVATAR_PALETTE.length];
}

interface EmployeeAvatarProps {
  id: number;
  name: string;
  photoUrl?: string;
  inactive?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function EmployeeAvatar({ id, name, photoUrl, inactive, size = "sm", className }: EmployeeAvatarProps) {
  const dim = size === "md" ? "h-10 w-10 text-xs" : "h-8 w-8 text-[11px]";
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        width={size === "md" ? 40 : 32}
        height={size === "md" ? 40 : 32}
        loading="lazy"
        className={cn(
          "inline-block shrink-0 rounded-full object-cover bg-[var(--color-surface-muted)]",
          dim,
          inactive && "opacity-50",
          className,
        )}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        dim,
        inactive && "opacity-50",
        className,
      )}
      style={{ backgroundColor: avatarColor(id) }}
      aria-hidden
    >
      {employeeInitials(name)}
    </span>
  );
}

interface EmployeeIdentityProps {
  id?: number;
  name: string;
  code: string;
  photoUrl?: string;
  location?: string;
  paidLocked?: boolean;
  showAvatar?: boolean;
  inactive?: boolean;
  className?: string;
}

export function EmployeeIdentity({
  id = 0,
  name,
  code,
  photoUrl,
  location,
  paidLocked,
  showAvatar = false,
  inactive,
  className,
}: EmployeeIdentityProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {showAvatar ? <EmployeeAvatar id={id} name={name} photoUrl={photoUrl} inactive={inactive} /> : null}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{name}</span>
          {paidLocked ? (
            <Badge variant="paid" className="text-[10px]">
              Paid
            </Badge>
          ) : null}
        </div>
        <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
          {code}
          {location ? ` · ${location}` : ""}
        </span>
      </div>
    </div>
  );
}

export function SaveIndicator({ saved, dirty }: { saved: boolean; dirty: boolean }) {
  if (!saved || dirty) {
    return <span className="text-xs font-semibold text-[var(--color-status-pending)]">Unsaved</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-tertiary)]" aria-hidden />
      Saved
    </span>
  );
}

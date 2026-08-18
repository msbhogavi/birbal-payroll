import { ClipboardCheck, Settings, Users, Wallet } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Month close", icon: ClipboardCheck, end: true, mobileLabel: "Month close" },
  { to: "/people", label: "People", icon: Users, mobileLabel: "People" },
  { to: "/payroll", label: "Monthly Payroll", icon: Wallet, mobileLabel: "Payroll" },
  { to: "/settings", label: "Settings", icon: Settings, mobileLabel: "Settings" },
] as const;

export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r bg-[var(--color-surface-sidebar)] md:flex md:flex-col">
        <div className="border-b px-4 py-4">
          <p className="text-sm font-semibold">Birbal Group</p>
          <p className="text-[10px] text-[var(--color-text-tertiary)]">Payroll & HR</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <NavLink
              key={to}
              to={to}
              {...rest}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-action-soft)] text-[var(--color-action)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span
                      className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-[var(--color-action)]"
                      aria-hidden
                    />
                  ) : null}
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 pb-16 md:pb-0">
          <Outlet />
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-[var(--color-surface)] md:hidden"
          aria-label="Mobile"
        >
          {NAV.map(({ to, label, mobileLabel, icon: Icon, ...rest }) => (
            <NavLink
              key={to}
              to={to}
              {...rest}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                  isActive ? "text-[var(--color-action)]" : "text-[var(--color-text-tertiary)]",
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              {mobileLabel}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { PayrollPage } from "@/pages/payroll-page";
import { PeoplePage } from "@/pages/people-page";
import { PeriodPage } from "@/pages/period-page";
import { SettingsPage } from "@/pages/settings-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<PeriodPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="payroll" element={<PayrollPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

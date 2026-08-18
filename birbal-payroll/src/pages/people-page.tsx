import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_EMPLOYEES } from "@/data/mock";
import { EmployeeIdentity } from "@/components/birbal/employee-identity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PeoplePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">People</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Staff directory and pay register for all outlets
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <Input className="pl-9" placeholder="Search name or code…" />
        </div>
        <Button className="ml-auto shrink-0">
          <Plus className="h-4 w-4" />
          Add employee
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-[var(--color-surface)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_EMPLOYEES.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <EmployeeIdentity id={e.id} name={e.name} code={e.code} photoUrl={e.photoUrl} showAvatar />
                </TableCell>
                <TableCell>{e.brand}</TableCell>
                <TableCell>{e.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { useState } from "react";
import type { Employee } from "@/lib/payroll-types";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PaidConfirmDialogProps {
  open: boolean;
  employee: Employee | null;
  netAmount: number;
  onConfirm: (payload: { method: string; date: string }) => void;
  onOpenChange: (open: boolean) => void;
}

export function PaidConfirmDialog({ open, employee, netAmount, onConfirm, onOpenChange }: PaidConfirmDialogProps) {
  const [method, setMethod] = useState("Bank transfer");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm payment recorded</DialogTitle>
          <DialogDescription>
            This does not transfer money. It only records that you paid salary outside this app.
          </DialogDescription>
        </DialogHeader>
        {employee ? (
          <p className="text-sm">
            <strong>{employee.name}</strong> · Net {formatINR(netAmount)}
          </p>
        ) : null}
        <div className="space-y-3 pt-2">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-text-secondary)]">Payment method</span>
            <select
              className="h-[var(--spacing-input-h)] w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-sm"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option>Bank transfer</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Cheque</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-text-secondary)]">Payment date</span>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm({ method, date })}>Mark as paid</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { AlertTriangle } from "lucide-react";

interface DateWarningProps {
  date: string | Date | null | undefined;
  referenceDate?: Date;
  className?: string;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Support "YYYY-MM-DD" and "YYYY-MM-DDTHH:MM" — both produce a valid Date.
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

export function DateWarning({ date, referenceDate, className }: DateWarningProps) {
  const parsed = parseDate(date);
  if (!parsed) return null;

  const ref = startOfDay(referenceDate ?? new Date());
  const target = startOfDay(parsed);

  const diffMs = target.getTime() - ref.getTime();
  const diffJours = Math.round(diffMs / 86_400_000);

  if (diffJours === 0) return null;

  const isPasse = diffJours < 0;
  const n = Math.abs(diffJours);
  const pluriel = n > 1 ? "s" : "";
  const message = isPasse
    ? `Vous saisissez une date passée (il y a ${n} jour${pluriel}). Êtes-vous sûr ?`
    : `Vous saisissez une date future (dans ${n} jour${pluriel}). Êtes-vous sûr ?`;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200 ${className ?? ""}`}
    >
      <AlertTriangle size={16} className="text-orange-600 shrink-0 mt-0.5" />
      <p className="text-sm text-orange-700">{message}</p>
    </div>
  );
}

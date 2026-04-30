"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface StakeholderRow {
  name: string;
  email: string;
  role: string;
}

interface AddedStakeholder {
  id: string;
  name: string;
  email: string;
  role: string;
  inviteToken: string;
}

interface AientStakeholderManagerProps {
  projectId: string;
  onDone: () => void;
}

export function AientStakeholderManager({
  projectId,
  onDone,
}: AientStakeholderManagerProps) {
  const [rows, setRows] = useState<StakeholderRow[]>([
    { name: "", email: "", role: "" },
  ]);
  const [added, setAdded] = useState<AddedStakeholder[]>([]);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const addRow = () =>
    setRows([...rows, { name: "", email: "", role: "" }]);
  const updateRow = (
    idx: number,
    field: keyof StakeholderRow,
    value: string
  ) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [field]: value };
    setRows(updated);
  };
  const removeRow = (idx: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  };

  const validRows = rows.filter((r) => r.name.trim());

  const handleSubmit = async () => {
    if (validRows.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/aient/projects/${projectId}/stakeholders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stakeholders: validRows }),
      });
      if (!res.ok) throw new Error("Failed to add stakeholders");
      const data = await res.json();
      setAdded((prev) => [...prev, ...data.stakeholders]);
      setRows([{ name: "", email: "", role: "" }]);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = (token: string) => {
    const url = `${baseUrl}/aient/survey/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Add Stakeholders</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Add the client stakeholders who will complete the CSC pre-work
          survey. Each person gets a unique link to their own assessment.
        </p>
      </div>

      {added.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Added ({added.length})
          </p>
          {added.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">
                  {s.email && `${s.email} · `}
                  {s.role || "No role specified"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyLink(s.inviteToken)}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied === s.inviteToken ? "Copied!" : "Copy Survey Link"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {added.length > 0 ? "Add More" : "Stakeholders"}
        </p>
        {rows.map((row, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                id={`name-${idx}`}
                placeholder="Name *"
                value={row.name}
                onChange={(e) => updateRow(idx, "name", e.target.value)}
              />
              <Input
                id={`email-${idx}`}
                placeholder="Email (optional)"
                type="email"
                value={row.email}
                onChange={(e) => updateRow(idx, "email", e.target.value)}
              />
              <Input
                id={`role-${idx}`}
                placeholder="Role (optional)"
                value={row.role}
                onChange={(e) => updateRow(idx, "role", e.target.value)}
              />
            </div>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="mt-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add another stakeholder
        </button>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          loading={saving}
          disabled={validRows.length === 0}
        >
          Add {validRows.length} Stakeholder{validRows.length !== 1 ? "s" : ""} →
        </Button>
        {added.length > 0 && (
          <Button variant="secondary" onClick={onDone}>
            Done — Go to Dashboard →
          </Button>
        )}
      </div>
    </div>
  );
}

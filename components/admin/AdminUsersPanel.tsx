"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SCOPE_VALUES = ["crm", "csc"] as const;
type Scope = (typeof SCOPE_VALUES)[number];

const SCOPE_LABELS: Record<Scope, string> = {
  crm: "CRM",
  csc: "CSC",
};

type Role = "user" | "super_admin";

interface AppUser {
  email: string;
  role: Role;
  admin_scopes: Scope[];
  created_at: string;
  updated_at: string;
}

type AuthState = "loading" | "authorized" | "forbidden" | "error";

export function AdminUsersPanel() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  // Add-admin form state
  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<Role>("user");
  const [addScopes, setAddScopes] = useState<Set<Scope>>(
    () => new Set<Scope>(["csc"])
  );
  const [addBusy, setAddBusy] = useState(false);

  // Per-row busy tracker so we can disable controls while patching
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AppUser | null>(null);

  const flash = useCallback((tone: "success" | "error", text: string) => {
    setBanner({ tone, text });
    window.setTimeout(() => setBanner(null), 4000);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 403) {
        setAuthState("forbidden");
        return;
      }
      if (!res.ok) {
        setAuthState("error");
        return;
      }
      const data = (await res.json()) as AppUser[];
      setUsers(data);
      setAuthState("authorized");
    } catch {
      setAuthState("error");
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedInEmail(data.user?.email?.toLowerCase() ?? null);
      load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, search]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const toggleAddScope = (scope: Scope) => {
    setAddScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  };

  const submitAdd = async () => {
    const email = addEmail.trim().toLowerCase();
    if (!email.includes("@")) {
      flash("error", "Valid email required.");
      return;
    }
    setAddBusy(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role: addRole,
          admin_scopes: Array.from(addScopes),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        flash("error", err.error ?? "Failed to save user.");
        return;
      }
      flash("success", `Saved ${email}.`);
      setAddEmail("");
      setAddRole("user");
      setAddScopes(new Set<Scope>(["csc"]));
      setAddOpen(false);
      await load();
    } finally {
      setAddBusy(false);
    }
  };

  const patchUser = async (
    email: string,
    changes: { role?: Role; admin_scopes?: Scope[] }
  ) => {
    setRowBusy(email);
    try {
      const res = await fetch(
        `/api/admin/users/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        flash("error", err.error ?? "Update failed.");
        await load();
        return;
      }
      const updated = (await res.json()) as AppUser;
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? updated : u))
      );
      flash("success", `Updated ${email}.`);
    } finally {
      setRowBusy(null);
    }
  };

  const toggleScope = (u: AppUser, scope: Scope) => {
    const has = u.admin_scopes?.includes(scope);
    const next = has
      ? u.admin_scopes.filter((s) => s !== scope)
      : [...(u.admin_scopes ?? []), scope];
    patchUser(u.email, { admin_scopes: next });
  };

  const togglePromote = (u: AppUser) => {
    const nextRole: Role = u.role === "super_admin" ? "user" : "super_admin";
    patchUser(u.email, { role: nextRole });
  };

  const deleteUser = async () => {
    if (!confirmDelete) return;
    setRowBusy(confirmDelete.email);
    try {
      const res = await fetch(
        `/api/admin/users/${encodeURIComponent(confirmDelete.email)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        flash("error", err.error ?? "Delete failed.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.email !== confirmDelete.email));
      flash("success", `Removed ${confirmDelete.email}.`);
      setConfirmDelete(null);
    } finally {
      setRowBusy(null);
    }
  };

  // ─── Gate screens ───────────────────────────────────────────────────────────

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          Checking access…
        </div>
      </div>
    );
  }

  if (authState === "forbidden") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-base font-bold text-slate-900 mb-1">Super admins only</h1>
          <p className="text-sm text-slate-500 mb-1">
            Only global super admins can manage admin access.
          </p>
          {signedInEmail && (
            <p className="text-xs text-slate-400 mb-5">Signed in as {signedInEmail}</p>
          )}
          <div className="flex flex-col gap-2">
            <a
              href="/admin"
              className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: "#00205B" }}
            >
              Back to admin
            </a>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm text-center">
          <h1 className="text-base font-bold text-slate-900 mb-1">Couldn&apos;t load users</h1>
          <p className="text-sm text-slate-500 mb-5">Something went wrong.</p>
          <button
            onClick={() => { setAuthState("loading"); load(); }}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "#00205B" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Main panel ─────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <a
                href="/admin"
                className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 mb-2"
              >
                ← Admin
              </a>
              <h1 className="text-2xl font-bold text-slate-900">Manage Admins</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Grant or revoke per-product admin access. Super admins see everything.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {signedInEmail && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {signedInEmail}
                </span>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setAddOpen((v) => !v)}
              >
                {addOpen ? "Cancel" : "+ Add admin"}
              </Button>
            </div>
          </div>

          {/* Banner */}
          {banner && (
            <div
              className={`mb-4 text-xs px-3 py-2 rounded-lg border ${
                banner.tone === "success"
                  ? "bg-green-50 border-green-100 text-green-800"
                  : "bg-red-50 border-red-100 text-red-800"
              }`}
            >
              {banner.text}
            </div>
          )}

          {/* Add form */}
          {addOpen && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                Grant admin access
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-[2fr,1fr,1.5fr,auto] gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="someone@merkle.com"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Role
                  </label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as Role)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 bg-white"
                  >
                    <option value="user">user</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Scopes
                  </label>
                  <div className="flex gap-2 pt-1">
                    {SCOPE_VALUES.map((s) => (
                      <label
                        key={s}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border cursor-pointer ${
                          addScopes.has(s)
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-slate-200 text-slate-500"
                        } ${addRole === "super_admin" ? "opacity-50" : ""}`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={addScopes.has(s)}
                          disabled={addRole === "super_admin"}
                          onChange={() => toggleAddScope(s)}
                        />
                        {SCOPE_LABELS[s]}
                      </label>
                    ))}
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  loading={addBusy}
                  onClick={submitAdd}
                >
                  Save
                </Button>
              </div>
              {addRole === "super_admin" && (
                <p className="text-[11px] text-slate-400 mt-2">
                  super_admin grants every admin scope automatically; individual
                  scopes are ignored.
                </p>
              )}
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <input
              placeholder="Filter by email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>

          {/* Users table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Scopes</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Updated</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-400 text-sm"
                    >
                      No admins match the filter.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => {
                  const isSelf =
                    signedInEmail !== null &&
                    signedInEmail === u.email.toLowerCase();
                  const busy = rowBusy === u.email;
                  const isSuper = u.role === "super_admin";
                  return (
                    <tr
                      key={u.email}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{u.email}</p>
                        {isSelf && (
                          <p className="text-[10px] text-slate-400 mt-0.5">you</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            isSuper
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {SCOPE_VALUES.map((s) => {
                            const on = isSuper || u.admin_scopes?.includes(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                disabled={busy || isSuper}
                                onClick={() => toggleScope(u, s)}
                                title={
                                  isSuper
                                    ? `${SCOPE_LABELS[s]} is implied by super_admin`
                                    : on
                                    ? `Click to revoke ${SCOPE_LABELS[s]} access`
                                    : `Click to grant ${SCOPE_LABELS[s]} access`
                                }
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                                  on
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                } ${
                                  busy || isSuper
                                    ? "cursor-not-allowed opacity-60"
                                    : "cursor-pointer"
                                }`}
                              >
                                {SCOPE_LABELS[s]}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs text-slate-500">
                          {formatDateTime(u.updated_at).date}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy || (isSelf && isSuper)}
                            onClick={() => togglePromote(u)}
                            title={
                              isSelf && isSuper
                                ? "You can't demote yourself"
                                : isSuper
                                ? "Demote to user"
                                : "Promote to super_admin"
                            }
                            className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {isSuper ? "Demote" : "Promote"}
                          </button>
                          <span className="text-slate-200">·</span>
                          <button
                            type="button"
                            disabled={busy || Boolean(isSelf)}
                            onClick={() => setConfirmDelete(u)}
                            title={
                              isSelf
                                ? "You can't remove yourself"
                                : "Remove admin record"
                            }
                            className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 mt-4">
            Removing a row returns the user to default access (no admin).
            Users who haven&apos;t signed up yet can still be pre-provisioned —
            their scopes apply the moment they authenticate.
          </p>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => rowBusy !== confirmDelete.email && setConfirmDelete(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm mx-4 p-6">
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Remove admin record
            </h3>
            <p className="text-sm text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">
                {confirmDelete.email}
              </span>
            </p>
            <p className="text-sm text-slate-500 mb-6">
              They&apos;ll lose {confirmDelete.role === "super_admin" ? "super admin" : "scoped admin"} access.
              They can still sign in as a regular user.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={rowBusy === confirmDelete.email}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                disabled={rowBusy === confirmDelete.email}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {rowBusy === confirmDelete.email ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Removing…
                  </>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

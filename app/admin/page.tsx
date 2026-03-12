import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin · CRM Diagnostic",
  robots: { index: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}

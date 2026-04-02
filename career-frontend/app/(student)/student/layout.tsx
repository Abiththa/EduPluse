import StudentSidebar from "@/components/layout/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <StudentSidebar />
      <main className="flex-1 px-8 py-6">{children}</main>
    </div>
  );
}
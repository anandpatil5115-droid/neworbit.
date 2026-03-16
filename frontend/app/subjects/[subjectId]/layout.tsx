import Sidebar from '@/components/Sidebar';

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
    </div>
  );
}

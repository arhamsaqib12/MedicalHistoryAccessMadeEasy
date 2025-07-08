import PatientSidebar from '@/components/patientSidebar';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Sidebar (fixed) */}
      < PatientSidebar />

      {/* Main content (pushed right by sidebar width) */}
      <main className="ml-14 sm:ml-52 p-4 sm:p-6 bg-white min-h-screen">
        {children}
      </main>
    </div>
  );
}

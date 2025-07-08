import PharmacySidebar from '@/components/pharmacySiderbar';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen ml-12 sm:ml-48 p-4 sm:p-6">
      <PharmacySidebar />
      <main className="flex-grow bg-white p-6">
        {children}
      </main>
    </div>
  );
}

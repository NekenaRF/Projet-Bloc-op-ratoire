import WelcomeBanner from "@/components/bloc/dashboard/WelcomeBanner";
import StatsGrid from "@/components/bloc/dashboard/StatsGrid";
import PatientsTable from "@/components/bloc/dashboard/PatientsTable";
import EtatGlobalPatients from "@/components/bloc/dashboard/EtatGlobalPatients";
import SalleReveilTable from "@/components/bloc/dashboard/SalleReveilTable";
import { 
  mockMedecin, 
  dashboardStats, 
  mockPatientsJour, 
  mockPatientsReveil, 
  mockEtatGlobal 
} from "@/lib/mock/bloc-dashboard";

export default function DashboardPage() {
  return (
    <main className="p-8 flex flex-col gap-8">
      <h1 className="font-headline font-extrabold text-3xl text-on-surface">
        Tableau de bord
      </h1>

      <WelcomeBanner medecin={mockMedecin} totalPatients={mockEtatGlobal.total} />
      
      <EtatGlobalPatients 
        total={mockEtatGlobal.total}
        stat={mockEtatGlobal.stat}
        urgent={mockEtatGlobal.urgent}
        normal={mockEtatGlobal.normal}
      />

      <StatsGrid stats={dashboardStats} />

      <PatientsTable patients={mockPatientsJour} />

      <SalleReveilTable patients={mockPatientsReveil} />
      
      {/* Rest of the content will be added in next steps */}
    </main>
  );
}

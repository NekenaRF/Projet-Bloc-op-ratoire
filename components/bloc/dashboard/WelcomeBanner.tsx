import { Medecin } from "@/types/bloc";

interface WelcomeBannerProps {
  medecin: Medecin;
  totalPatients: number;
}

export default function WelcomeBanner({ medecin, totalPatients }: WelcomeBannerProps) {
  return (
    <div className="bg-primary-container/10 border-l-4 border-primary p-6 rounded-r-xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">
            waving_hand
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface font-headline tracking-tight">
            Bonjour Dr. {medecin.prenom} {medecin.nom}
          </h1>
          <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-base">calendar_month</span>
            Mardi 28 Avril 2026
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
          Patients du jour
        </p>
        <p className="text-4xl font-black text-primary">
          {totalPatients}
        </p>
      </div>
    </div>
  );
}

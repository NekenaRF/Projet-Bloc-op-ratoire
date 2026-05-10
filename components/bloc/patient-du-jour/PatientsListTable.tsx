"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  operation: string;
  etat: string;
}

interface PatientsListTableProps {
  patients: Patient[];
}

export default function PatientsListTable({ patients }: PatientsListTableProps) {
  const router = useRouter();
  const [loadingPatients, setLoadingPatients] = useState<Set<string>>(new Set());

  const handleDemarrer = async (patient: Patient) => {
    // Add patient ID to loading set
    setLoadingPatients((prev) => new Set(prev).add(patient.id));
    
    // Simulate loading delay (1s)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Navigate to per-op activity
    const cleanId = patient.id.replace("#", "");
    router.push(`/bloc/activite-pendant-operation/${cleanId}`);
    
    // Note: In a real app, we might not need to clear loading if navigating away,
    // but for the sake of completion:
    setLoadingPatients((prev) => {
      const next = new Set(prev);
      next.delete(patient.id);
      return next;
    });
  };

  const handleDossier = (patient: Patient) => {
    const cleanId = patient.id.replace("#", "");
    router.push(`/bloc/dossier-patient/${cleanId}`);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container">
      {/* Table Header */}
      <div className="px-8 py-6 bg-white border-b border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h4 className="text-xl font-extrabold text-on-surface tracking-tight font-headline">
              Liste des patients
            </h4>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-container-high transition-all border border-outline-variant">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filtrer
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white shadow-sm">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                ID Patient
              </th>
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Nom & Prénom
              </th>
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                TYPE D'OPÉRATION
              </th>
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                État
              </th>
              <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {patients.map((patient) => {
              const isLoading = loadingPatients.has(patient.id);
              return (
                <tr 
                  key={patient.id} 
                  className="hover:bg-surface-container-high/40 transition-colors duration-200"
                >
                  <td className="px-8 py-5 text-sm font-mono text-on-surface-variant">
                    {patient.id}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarBgColor(patient.etat)}`}>
                        {getInitials(patient.nom, patient.prenom)}
                      </div>
                      <span className="font-bold text-on-surface">
                        {patient.nom} {patient.prenom}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-on-surface">
                      {patient.operation}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <EtatBadge etat={patient.etat} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleDemarrer(patient)}
                        disabled={isLoading}
                        aria-label={`Démarrer le suivi de ${patient.nom}`}
                        className={`min-w-[100px] px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner />
                            Chargement...
                          </>
                        ) : (
                          "Démarrer"
                        )}
                      </button>
                      <button 
                        onClick={() => handleDossier(patient)}
                        aria-label={`Voir le dossier de ${patient.nom}`}
                        className="px-4 py-1.5 bg-white text-primary border border-primary/30 rounded-lg text-xs font-bold hover:bg-primary-fixed transition-all active:scale-95 shadow-sm"
                      >
                        Dossier
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
  );
}

function getInitials(nom: string, prenom: string) {
  const n = nom.trim().charAt(0);
  const p = prenom.trim().charAt(0);
  return `${n}${p}`.toUpperCase() || n.toUpperCase();
}

function getAvatarBgColor(etat: string) {
  switch (etat) {
    case 'STAT':
    case 'Urgent':
      return 'bg-tertiary-fixed text-tertiary';
    default:
      return 'bg-primary-fixed text-primary';
  }
}

function EtatBadge({ etat }: { etat: string }) {
  const styles = {
    Stable: { color: "bg-secondary", text: "text-secondary" },
    Urgent: { color: "bg-tertiary animate-pulse", text: "text-tertiary" },
    STAT: { color: "bg-tertiary", text: "text-tertiary" },
  };

  const style = styles[etat as keyof typeof styles] || styles.Stable;

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${style.color}`}></span>
      <span className={`text-xs font-bold uppercase ${style.text}`}>
        {etat}
      </span>
    </div>
  );
}

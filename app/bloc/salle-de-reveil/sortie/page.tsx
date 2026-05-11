"use client";

import { useState } from "react";
import HeaderPatient from "@/components/bloc/sortie-reveil/HeaderPatient";
import ScoreResume from "@/components/bloc/sortie-reveil/ScoreResume";
import OrientationPatient from "@/components/bloc/sortie-reveil/OrientationPatient";
import ChecklistSortie from "@/components/bloc/sortie-reveil/ChecklistSortie";
import { mockPatientSortie, mockServicesDestination } from "@/lib/mock/salle-reveil";

export default function SortieReveilPage() {
  const [sortieValidee, setSortieValidee] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
      <section>
        <h3 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
          Sortie salle de réveil / Avis médical
        </h3>
        <div className="h-1.5 w-28 bg-primary rounded-full" />
      </section>

      <HeaderPatient patient={mockPatientSortie} />

      <ScoreResume score={mockPatientSortie.scoreSCCRE} />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <OrientationPatient services={mockServicesDestination} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ChecklistSortie />
        </div>
      </div>

      <div className="mt-auto pt-4 pb-2 flex justify-end">
        {!sortieValidee ? (
          <button
            onClick={() => setSortieValidee(true)}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-5 text-lg font-bold tracking-tight shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-4 rounded-sm uppercase"
          >
            <span>Valider la sortie</span>
            <span className="material-symbols-outlined text-2xl">logout</span>
          </button>
        ) : (
          <div className="flex items-center gap-6 bg-secondary/10 border border-secondary/20 rounded-xl px-8 py-5">
            <span
              className="material-symbols-outlined text-4xl text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div>
              <p className="font-bold text-secondary text-lg font-headline">Sortie validée avec succès</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Le patient JEAN-PIERRE Marc a été transféré. Dossier clôturé à 14:45.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

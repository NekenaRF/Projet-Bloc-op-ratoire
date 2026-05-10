"use client";

import { useState } from "react";
import PatientStatsCards from "@/components/bloc/patient-du-jour/PatientStatsCards";
import PatientsListTable from "@/components/bloc/patient-du-jour/PatientsListTable";
import PatientFilters from "@/components/bloc/patient-du-jour/PatientFilters";
import { patientStatsMock, patientsJourMock } from "@/lib/mock/patient-jour";
import { FiltresPatient } from "@/types/bloc";

export default function PatientDuJourPage() {
  const [filtres, setFiltres] = useState<FiltresPatient>({
    statut: "Tous les statuts",
    specialite: "Toutes les spécialités",
  });

  const patientsFiltres = patientsJourMock.filter((patient) => {
    const matchStatut = filtres.statut === "Tous les statuts" || patient.etat === filtres.statut;
    const matchSpecialite = filtres.specialite === "Toutes les spécialités" || patient.operation === filtres.specialite;
    return matchStatut && matchSpecialite;
  });

  return (
    <main className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
          Patient du jour
        </h1>
        <p className="text-on-surface-variant mt-1">
          Liste des patients programmés aujourd'hui
        </p>
      </div>

      <PatientStatsCards stats={patientStatsMock} />

      <PatientFilters onFilterChange={setFiltres} />

      <PatientsListTable patients={patientsFiltres} />
    </main>
  );
}

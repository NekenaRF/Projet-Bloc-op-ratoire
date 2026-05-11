'use client';

import { useState } from 'react';
import WelcomeBanner from "@/components/bloc/dashboard/WelcomeBanner";
import StatsGrid from "@/components/bloc/dashboard/StatsGrid";
import PatientsTable from "@/components/bloc/dashboard/PatientsTable";
import EtatGlobalPatients from "@/components/bloc/dashboard/EtatGlobalPatients";
import SalleReveilTable from "@/components/bloc/dashboard/SalleReveilTable";
import AlerteBandeau from "@/components/bloc/dashboard/AlerteBandeau";
import RaccourcisBloc from "@/components/bloc/dashboard/RaccourcisBloc";
import {
  mockMedecin,
  dashboardStats,
  mockPatientsJour,
  mockPatientsReveil,
  mockEtatGlobal,
} from "@/lib/mock/bloc-dashboard";

export default function DashboardPage() {
  const [alerteVisible, setAlerteVisible] = useState(true);
  
  const todayFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const prioriteBadge: Record<string, string> = {
    STAT: 'bg-tertiary/20 text-tertiary',
    Urgent: 'bg-orange-500/20 text-orange-600',
    Normal: 'bg-primary/20 text-primary',
  };

  const prioriteHeure: Record<string, string> = {
    STAT: 'text-tertiary font-bold',
    Urgent: 'text-orange-600 font-bold',
    Normal: 'text-primary',
  };

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* 1. BANNIERE BIENVENUE */}
      <div className="bg-primary/5 border-l-4 border-primary 
                      p-6 rounded-r-xl flex items-center 
                      justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full 
                          flex items-center justify-center">
            <span className="material-symbols-outlined 
                             text-primary text-2xl">
              waving_hand
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface 
                           tracking-tight font-headline">
              Bonjour {mockMedecin.nom}
            </h1>
            <p className="text-sm font-medium text-on-surface-variant 
                          flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-xs">
                calendar_month
              </span>
              {todayFormatted}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase 
                        tracking-[0.2em] text-primary">
            Patients du jour
          </p>
          <p className="text-4xl font-black text-primary">
            {mockPatientsJour.length}
          </p>
        </div>
      </div>

      {/* 2. ALERTE */}
      {alerteVisible && (
        <div className="bg-tertiary/10 border border-tertiary/20 
                        rounded-xl p-4 flex items-center gap-4">
          <span
            className="material-symbols-outlined text-tertiary 
                       text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <p className="text-sm font-bold text-tertiary flex-1">
            1 Urgence en attente de salle
          </p>
          <button
            onClick={() => setAlerteVisible(false)}
            className="text-xs font-bold text-tertiary underline 
                       hover:no-underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* 3. ÉTAT GLOBAL DES PATIENTS */}
      <div className="bg-white rounded-xl shadow-sm border 
                      border-outline-variant/10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-on-surface 
                         font-headline uppercase tracking-wider">
            État Global des Patients
          </h3>
          <div className="bg-error-container/30 text-error px-3 
                          py-1 rounded-full text-[10px] font-bold 
                          uppercase">
            Temps réel
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-surface-container-low 
                          rounded-xl flex items-center 
                          justify-center">
            <span className="material-symbols-outlined 
                             text-primary text-3xl">
              groups
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary 
                          uppercase tracking-widest">
              Total Patients (STAT + Urgents + Normaux)
            </p>
            <p className="text-5xl font-black text-on-surface 
                          tracking-tighter">
              {mockPatientsJour.length}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-50 
                        flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full" />
              <span className="text-xs font-bold text-slate-600">
                STAT:{' '}
                <span className="text-on-surface font-black">
                  01
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-xs font-bold text-slate-600">
                Urgents:{' '}
                <span className="text-on-surface font-black">
                  01
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-xs font-bold text-slate-600">
                Normaux:{' '}
                <span className="text-on-surface font-black">
                  02
                </span>
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 
                        uppercase tracking-widest">
            Mise à jour en temps réel
          </p>
        </div>
      </div>

      {/* 4. STATS (4 cartes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 
                      lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border 
                       border-outline-variant/10 p-6 
                       flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-full 
                            flex items-center justify-center 
                            ${stat.bg}`}>
              <span className={`material-symbols-outlined 
                               text-2xl ${stat.couleur}`}>
                {stat.icon}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold 
                            text-on-surface-variant uppercase 
                            tracking-wider">
                {stat.label}
              </p>
              <p className={`text-3xl font-extrabold 
                             ${stat.couleur}`}>
                {stat.valeur}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {stat.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 5. VOS PATIENTS AUJOURD'HUI */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            person_check
          </span>
          <h2 className="font-bold text-on-surface font-headline 
                         text-xl">
            Vos patients aujourd'hui
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border 
                        border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-on-surface-variant 
                               text-[11px] font-bold uppercase 
                               tracking-widest border-b 
                               border-outline-variant/10">
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Patient & ID</th>
                  <th className="px-6 py-4">Intervention</th>
                  <th className="px-6 py-4">Heure</th>
                  <th className="px-6 py-4">Durée prévue</th>
                  <th className="px-6 py-4 text-right">
                    Départ Bloc
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 
                                text-sm">
                {mockPatientsJour.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 
                                         transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded 
                                       text-[10px] font-bold 
                                       uppercase 
                                       ${prioriteBadge[p.priorite]}`}>
                        {p.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-on-surface">
                        {p.nom}
                      </span>
                      <br />
                      <span className="text-[10px] 
                                       text-on-surface-variant">
                        {p.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">{p.intervention}</td>
                    <td className={`px-6 py-4 
                                   ${prioriteHeure[p.priorite]}`}>
                      {p.heure}
                    </td>
                    <td className="px-6 py-4">{p.duree}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold 
                                       text-slate-600">
                        {p.depart}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. SALLE DE RÉVEIL */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            bed
          </span>
          <h2 className="font-bold text-on-surface font-headline 
                         text-xl">
            Salle de Réveil
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border 
                        border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-on-surface-variant 
                               text-[11px] font-bold uppercase 
                               tracking-widest border-b 
                               border-outline-variant/10">
                  <th className="px-6 py-4">Patient & ID</th>
                  <th className="px-6 py-4">
                    Intervention terminée
                  </th>
                  <th className="px-6 py-4">Salle / Lit</th>
                  <th className="px-6 py-4">Durée séjour</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 
                                text-sm">
                {mockPatientsReveil.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 
                                         transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-on-surface">
                        {r.nom}
                      </span>
                      <br />
                      <span className="text-[10px] 
                                       text-on-surface-variant">
                        {r.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">{r.intervention}</td>
                    <td className="px-6 py-4">{r.salle}</td>
                    <td className="px-6 py-4">{r.duree}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-slate-100 text-slate-600 
                                       px-3 py-1 rounded-full 
                                       text-[10px] font-bold 
                                       uppercase">
                        {r.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

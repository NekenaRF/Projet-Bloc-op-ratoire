"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { patientActif } from "@/lib/mock/patient-actif";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PeriData {
  perfusions: string;
  transfusions: string;
  sorties: string;
}

interface Constantes {
  fc: string;
  ta: string;
  spo2: string;
  spo3: string;
  score: string;
  capnie: string;
  temperature: string;
}

interface Ventilation {
  intubOT: boolean;
  intubOTNotes: string;
  sArmee: boolean;
  sArmeeNotes: string;
  mLarynx: boolean;
  mLarynxNotes: string;
}

interface OptionsVentilation {
  spontanee: string;
  assistee: string;
  controlee: string;
  peep: string;
  circuitFerme: string;
}

type EtatArrivee = "CALME" | "DETENDU" | "ANXIEUX" | "AGITE" | null;

interface PerOpData {
  periData: PeriData;
  constantes: Constantes;
  ventilation: Ventilation;
  optionsVent: OptionsVentilation;
  etatArrivee: EtatArrivee;
}

// ── Initial values ─────────────────────────────────────────────────────────────

const INITIAL: PerOpData = {
  periData: { perfusions: "", transfusions: "", sorties: "" },
  constantes: { fc: "", ta: "", spo2: "", spo3: "", score: "", capnie: "", temperature: "" },
  ventilation: { intubOT: false, intubOTNotes: "", sArmee: false, sArmeeNotes: "", mLarynx: false, mLarynxNotes: "" },
  optionsVent: { spontanee: "", assistee: "", controlee: "", peep: "", circuitFerme: "" },
  etatArrivee: null,
};

const TABS = [
  { id: "operateur", label: "Opérateur", icon: "medical_information" },
  { id: "anesthesiste", label: "Anesthésiste", icon: "ecg" },
  { id: "aide", label: "Aide", icon: "diversity_3" },
  { id: "chirurgien", label: "Chirurgien", icon: "personal_injury" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function storageKey(patientId: string) {
  return `activite_per_op_patient_${patientId}`;
}

function loadFromStorage(patientId: string): PerOpData {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(storageKey(patientId));
    return raw ? (JSON.parse(raw) as PerOpData) : INITIAL;
  } catch {
    return INITIAL;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ActivitePendantOperationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? patientActif.id;

  const [activeTab, setActiveTab] = useState("operateur");
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Unified state ──────────────────────────────────────────────────────────
  const [data, setData] = useState<PerOpData>(INITIAL);

  const setPeri = (key: keyof PeriData, val: string) =>
    setData((d) => ({ ...d, periData: { ...d.periData, [key]: val } }));

  const setC = (key: keyof Constantes, val: string) =>
    setData((d) => ({ ...d, constantes: { ...d.constantes, [key]: val } }));

  const setV = <K extends keyof Ventilation>(key: K, val: Ventilation[K]) =>
    setData((d) => ({ ...d, ventilation: { ...d.ventilation, [key]: val } }));

  const setOV = (key: keyof OptionsVentilation, val: string) =>
    setData((d) => ({ ...d, optionsVent: { ...d.optionsVent, [key]: val } }));

  const setEtat = (val: EtatArrivee) => setData((d) => ({ ...d, etatArrivee: val }));

  // ── Load from localStorage on mount ───────────────────────────────────────
  useEffect(() => {
    setData(loadFromStorage(patientId));
    setHydrated(true);
  }, [patientId]);

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = () => {
    localStorage.setItem(storageKey(patientId), JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setTimeout(
      () =>
        router.push(
          `/bloc/apres-operation?patientId=${encodeURIComponent(patientId)}`
        ),
      1200
    );
  };

  // ── Sub-content for other tabs (MVP placeholder) ───────────────────────────
  const tabPlaceholder = (label: string) => (
    <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant gap-3">
      <span className="material-symbols-outlined text-4xl text-outline">construction</span>
      <p className="text-sm font-medium">
        Contenu <strong>{label}</strong> à venir
      </p>
    </div>
  );

  if (!hydrated) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* ── Patient Context Header ──────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-xl z-50 sticky top-0 border-b border-surface-container-highest shadow-sm flex justify-between items-center w-full px-6 py-2">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-0.5">
              Patient en cours
            </span>
            <h2 className="font-headline font-bold text-lg text-on-surface leading-tight">
              {patientActif.nom}
            </h2>
          </div>
          <div className="h-10 w-px bg-surface-container-highest" />
          <div className="grid grid-cols-4 gap-x-8 gap-y-1">
            {[
              { label: "ID / MRN", val: patientActif.id },
              { label: "Âge", val: `${patientActif.age} ans` },
              { label: "Opération", val: patientActif.intervention },
              { label: "Chirurgien", val: patientActif.chirurgien },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-[9px] text-on-surface-variant font-semibold uppercase tracking-tighter">
                  {label}
                </p>
                <p className="font-label text-xs font-bold text-on-surface truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-tertiary/10 text-tertiary px-3 py-1.5 rounded-full flex items-center gap-2 border border-tertiary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
            </span>
            <span className="text-[10px] font-extrabold tracking-wider">PROCÉDURE EN COURS</span>
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-primary-container flex items-center justify-center bg-primary-fixed text-primary font-bold text-sm">
            SR
          </div>
        </div>
      </header>

      {/* ── Navigation Tabs ─────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-surface-container-highest px-6 flex gap-8 shrink-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 border-b-2 text-sm font-bold flex items-center gap-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ── Scrollable Content Zone ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-8">

        {activeTab !== "operateur" && tabPlaceholder(TABS.find((t) => t.id === activeTab)?.label ?? "")}

        {activeTab === "operateur" && (
          <>
            {/* Section 1 – APPORTS */}
            <section className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">input</span>
                <h3 className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm">
                  Apports (Entrées)
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "perfusions" as const, label: "Perfusions", ph: "Saisir les détails des perfusions..." },
                  { key: "transfusions" as const, label: "Transfusions", ph: "Saisir les détails des transfusions..." },
                ].map(({ key, label, ph }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
                    <textarea rows={3} value={data.periData[key]} onChange={(e) => setPeri(key, e.target.value)}
                      placeholder={ph} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-outline resize-none transition-all" />
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 – SORTIES */}
            <section className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-xl">output</span>
                <h3 className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm">Sorties</h3>
              </div>
              <div className="p-6 space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Journal des sorties</label>
                <textarea rows={4} value={data.periData.sorties} onChange={(e) => setPeri("sorties", e.target.value)}
                  placeholder="Quantifier et décrire les sorties (urines, aspirations, etc.)..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-outline resize-none transition-all" />
              </div>
            </section>

            {/* Section 3 – CONSTANTES */}
            <section className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">monitoring</span>
                <h3 className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm">Surveillance des constantes</h3>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {([
                  { key: "fc", label: "FC (BPM)", ph: "—" },
                  { key: "ta", label: "TA (mmHg)", ph: "00/00" },
                  { key: "spo2", label: "SPO2 (%)", ph: "—" },
                  { key: "spo3", label: "SPO3 (%)", ph: "—" },
                  { key: "score", label: "Score", ph: "—" },
                  { key: "capnie", label: "Capnie", ph: "—" },
                  { key: "temperature", label: "Temp. (°C)", ph: "—" },
                ] as { key: keyof Constantes; label: string; ph: string }[]).map(({ key, label, ph }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">{label}</label>
                    <input type="text" value={data.constantes[key]} onChange={(e) => setC(key, e.target.value)}
                      placeholder={ph} className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/50 text-center" />
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 – VENTILATION */}
            <section className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">pulmonology</span>
                <h3 className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm">Ventilation</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {([
                  { ck: "intubOT", nk: "intubOTNotes", label: "INTUB - OT" },
                  { ck: "sArmee", nk: "sArmeeNotes", label: "S.ARMEE" },
                  { ck: "mLarynx", nk: "mLarynxNotes", label: "M.LARYNCE" },
                ] as { ck: keyof Ventilation; nk: keyof Ventilation; label: string }[]).map(({ ck, nk, label }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id={label} checked={data.ventilation[ck] as boolean}
                        onChange={(e) => setV(ck, e.target.checked)} className="w-5 h-5 rounded cursor-pointer accent-primary" />
                      <label htmlFor={label} className="text-xs font-bold text-on-surface uppercase tracking-wide cursor-pointer">{label}</label>
                    </div>
                    <input type="text" value={data.ventilation[nk] as string}
                      onChange={(e) => setV(nk, e.target.value)} placeholder="Notes..."
                      className="w-full h-8 px-2 text-xs bg-white border border-outline-variant rounded focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/50" />
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 – OPTIONS DE VENTILATION */}
            <section className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">settings_input_component</span>
                <h3 className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm">Options de ventilation</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                {([
                  { key: "spontanee", label: "Spontanée" },
                  { key: "assistee", label: "Assistée" },
                  { key: "controlee", label: "Contrôlée" },
                  { key: "peep", label: "PEEP" },
                  { key: "circuitFerme", label: "Circuit fermé" },
                ] as { key: keyof OptionsVentilation; label: string }[]).map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">{label}</label>
                    <input type="text" value={data.optionsVent[key]} onChange={(e) => setOV(key, e.target.value)}
                      placeholder="Détails..." className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/50" />
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6 – PATIENT À L'ARRIVÉE */}
            <section className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
              <div className="bg-surface-container-low px-6 py-3 border-b border-surface-container-highest flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">psychology</span>
                <h3 className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm">Patient à l'arrivée</h3>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                {(["CALME", "DETENDU", "ANXIEUX", "AGITE"] as EtatArrivee[]).map((etat) => {
                  const isSelected = data.etatArrivee === etat;
                  return (
                    <label key={etat}
                      className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? "border-primary bg-primary-fixed/50" : "border-outline-variant/30 bg-background hover:border-primary/50"
                      }`}
                    >
                      <input type="radio" name="etatArrivee" value={etat!} checked={isSelected}
                        onChange={() => setEtat(etat)} className="w-6 h-6 cursor-pointer accent-primary" />
                      <span className={`text-sm font-bold uppercase tracking-wide ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                        {etat}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Save button + toast */}
            <div className="flex flex-col items-end gap-3 pt-4 pb-8">
              {saved && (
                <div className="flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-lg text-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Données enregistrées — redirection en cours...
                </div>
              )}
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-headline font-extrabold shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-2xl">save</span>
                Valider et enregistrer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

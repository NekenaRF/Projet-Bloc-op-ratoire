"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { patientActif } from "@/lib/mock/patient-actif";
import type {
  ChecklistSortie,
  ChecklistSortieQuestions,
} from "@/types/checklist-sortie";

/** Heure de sortie du bloc (mock, en attendant lien avec les données réelles). */
const HEURE_SORTIE_MOCK = "14:45";

const STORAGE_PREFIX = "checklist_sortie_patient_";

function storageKey(patientId: string) {
  return `${STORAGE_PREFIX}${patientId}`;
}

const INITIAL_CHECKLIST: ChecklistSortieQuestions = {
  intervention: null,
  compteFinal: null,
  etiquetage: null,
  signalement: null,
};

const radioClass =
  "h-5 w-5 shrink-0 border-outline-variant text-primary accent-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

function checklistComplete(c: ChecklistSortieQuestions): boolean {
  return (
    c.intervention !== null &&
    c.compteFinal !== null &&
    c.etiquetage !== null &&
    c.signalement !== null
  );
}

function parseStored(raw: string): ChecklistSortie | null {
  try {
    const data = JSON.parse(raw) as ChecklistSortie;
    if (!data || typeof data !== "object") return null;
    if (!data.checklist || typeof data.observations !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

function ApresOperationContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? patientActif.id;

  const [checklist, setChecklist] =
    useState<ChecklistSortieQuestions>(INITIAL_CHECKLIST);
  const [observations, setObservations] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey(patientId));
      if (!raw) {
        setHydrated(true);
        return;
      }
      const data = parseStored(raw);
      if (data) {
        setChecklist({
          intervention: data.checklist.intervention ?? null,
          compteFinal: data.checklist.compteFinal ?? null,
          etiquetage: data.checklist.etiquetage ?? null,
          signalement: data.checklist.signalement ?? null,
        });
        setObservations(data.observations);
        if (data.validated === true) setIsValidated(true);
      }
    } finally {
      setHydrated(true);
    }
  }, [patientId]);

  const setField = (
    key: keyof ChecklistSortieQuestions,
    value: ChecklistSortieQuestions[typeof key]
  ) => {
    if (isValidated) return;
    setChecklist((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (isValidated) return;

    if (!checklistComplete(checklist)) {
      const missing: string[] = [];
      if (checklist.intervention === null) {
        missing.push("Intervention enregistrée");
      }
      if (checklist.compteFinal === null) {
        missing.push("Compte final des compresses, aiguilles, instruments");
      }
      if (checklist.etiquetage === null) {
        missing.push("Étiquetage des prélèvements / pièces opératoires");
      }
      if (checklist.signalement === null) {
        missing.push("Signalement des dysfonctionnements et événements indésirables");
      }
      alert(
        `Veuillez répondre à toutes les questions obligatoires :\n\n• ${missing.join("\n• ")}`
      );
      return;
    }

    if (
      !confirm(
        "Valider la checklist après intervention ?\nLa signature électronique sera enregistrée."
      )
    ) {
      return;
    }

    const now = new Date().toISOString();
    const signatureSimulee = `Signature électronique simulée — ${patientActif.nom} — ${now}`;

    const payload: ChecklistSortie = {
      patientId,
      checklist,
      observations,
      updatedAt: now,
      heureSortieBloc: HEURE_SORTIE_MOCK,
      validated: true,
      dateValidation: now,
      signature: signatureSimulee,
    };

    try {
      localStorage.setItem(storageKey(patientId), JSON.stringify(payload));
    } catch {
      alert("Impossible d’enregistrer localement (stockage indisponible).");
      return;
    }

    setIsValidated(true);
    setSaveSuccess(true);
    window.setTimeout(() => setSaveSuccess(false), 5000);
  };

  if (!hydrated) {
    return (
      <main className="min-h-[40vh] px-4 py-12 text-center text-on-surface-variant sm:px-8">
        Chargement de la checklist…
      </main>
    );
  }

  return (
    <main>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:p-8">
        <div className="sticky top-0 z-30 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-primary-fixed/30 bg-surface-container-lowest p-4 shadow-md sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-6 sm:p-6">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-14 sm:w-14">
                <span className="material-symbols-outlined text-xl text-primary sm:text-2xl">
                  patient_list
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="font-headline text-lg font-extrabold leading-snug tracking-tight text-on-surface sm:text-xl md:text-2xl">
                  Check-list après intervention – Check de sortie du bloc
                </h1>
                <p className="mt-2 text-xs text-on-surface-variant sm:text-sm">
                  <span className="font-semibold text-on-surface">
                    {patientActif.nom}
                  </span>
                  <span className="mx-2 text-outline-variant" aria-hidden="true">
                    ·
                  </span>
                  <span>{patientId}</span>
                  <span className="mx-2 text-outline-variant" aria-hidden="true">
                    ·
                  </span>
                  <span>{HEURE_SORTIE_MOCK}</span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {isValidated && (
                <span className="rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary">
                  Déjà validé
                </span>
              )}
              <Link 
                href="/bloc/protocole-operatoire"
                className="rounded-full border border-primary/25 bg-primary-fixed/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-primary-fixed hover:bg-primary/20 transition-colors"
              >
                Protocole opératoire
              </Link>
              <span
                className="min-w-[8rem] rounded-full border border-dashed border-outline-variant/50 bg-transparent px-3 py-1 text-center text-xs font-medium text-on-surface-variant/50"
                title="À compléter"
              >
                —
              </span>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-primary-container/5 bg-surface-container-low p-4 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
              1
            </div>
            <h2 className="font-headline text-base font-bold text-on-surface sm:text-lg">
              Confirmation orale par l&apos;équipe
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Q1 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 flex-1 text-sm font-medium text-on-surface">
                Intervention enregistrée
              </p>
              <div className="flex shrink-0 gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q1"
                    value="oui"
                    disabled={isValidated}
                    checked={checklist.intervention === "oui"}
                    onChange={() => setField("intervention", "oui")}
                    className={radioClass}
                  />
                  Oui
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q1"
                    value="non"
                    disabled={isValidated}
                    checked={checklist.intervention === "non"}
                    onChange={() => setField("intervention", "non")}
                    className={radioClass}
                  />
                  Non
                </label>
              </div>
            </div>

            {/* Q2 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 flex-1 text-sm font-medium text-on-surface">
                Compte final des compresses, aiguilles, instruments correct
              </p>
              <div className="flex shrink-0 gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q2"
                    value="oui"
                    disabled={isValidated}
                    checked={checklist.compteFinal === "oui"}
                    onChange={() => setField("compteFinal", "oui")}
                    className={radioClass}
                  />
                  Oui
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q2"
                    value="na"
                    disabled={isValidated}
                    checked={checklist.compteFinal === "na"}
                    onChange={() => setField("compteFinal", "na")}
                    className={radioClass}
                  />
                  N/A
                </label>
              </div>
            </div>

            {/* Q3 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 flex-1 text-sm font-medium text-on-surface">
                Étiquetage des prélèvements/pièces opératoires vérifié
              </p>
              <div className="flex shrink-0 gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q3"
                    value="oui"
                    disabled={isValidated}
                    checked={checklist.etiquetage === "oui"}
                    onChange={() => setField("etiquetage", "oui")}
                    className={radioClass}
                  />
                  Oui
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q3"
                    value="na"
                    disabled={isValidated}
                    checked={checklist.etiquetage === "na"}
                    onChange={() => setField("etiquetage", "na")}
                    className={radioClass}
                  />
                  N/A
                </label>
              </div>
            </div>

            {/* Q4 */}
            <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 flex-1 text-sm font-medium text-on-surface">
                Signalement des dysfonctionnements matériels et événements
                indésirables
              </p>
              <div className="flex shrink-0 gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q4"
                    value="oui"
                    disabled={isValidated}
                    checked={checklist.signalement === "oui"}
                    onChange={() => setField("signalement", "oui")}
                    className={radioClass}
                  />
                  Oui
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant hover:text-primary">
                  <input
                    type="radio"
                    name="q4"
                    value="non"
                    disabled={isValidated}
                    checked={checklist.signalement === "non"}
                    onChange={() => setField("signalement", "non")}
                    className={radioClass}
                  />
                  Non
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm sm:mt-8 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">
              Observations Particulières
            </h3>
          </div>
          <textarea
            value={observations}
            disabled={isValidated}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Saisissez ici les motifs de dérogation ou les incidents techniques notables..."
            className="min-h-[120px] w-full resize-y rounded-2xl border-none bg-surface-container-low p-5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </section>

        {saveSuccess && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary sm:mt-8"
          >
            Check-list validée et enregistrée localement pour ce patient.
          </p>
        )}

        <div className="mt-10 mb-12 flex flex-col gap-4 border-t border-outline-variant/10 pt-8 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isValidated}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-headline font-bold text-white shadow-xl shadow-primary/20 transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <span className="material-symbols-outlined text-[22px]">save_as</span>
            Valider et enregistrer
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ApresOperationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[40vh] px-4 py-12 text-center text-on-surface-variant">
          Chargement…
        </main>
      }
    >
      <ApresOperationContent />
    </Suspense>
  );
}

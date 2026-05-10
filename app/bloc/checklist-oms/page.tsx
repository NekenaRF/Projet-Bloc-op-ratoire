"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChecklistData, CHECKLIST_INITIAL, BoolPair, RadioVal } from "@/types/bloc";
import PhaseAvantInduction from "@/components/bloc/checklist-oms/PhaseAvantInduction";
import PhaseAvantIntervention from "@/components/bloc/checklist-oms/PhaseAvantIntervention";
import SignatureModal from "@/components/bloc/checklist-oms/SignatureModal";

const STORAGE_KEY = "checklist-oms-data";
const VALIDATED_KEY = "checklist-oms-validated";
const MEDECIN_NOM = "Dr. Sarah RASOANIRINA";

// ── Validation helpers ─────────────────────────────────────────────────────────

function boolPairOk(p: BoolPair) {
  return p.oui || p.non;
}

function radioOk(v: RadioVal) {
  return v !== null;
}

function validateChecklist(data: ChecklistData): string[] {
  const errors: string[] = [];

  // Phase 1
  const p1 = data.phase1;
  if (!radioOk(p1.identite)) errors.push("Phase 1 — Q1 : Identité du patient");
  if (!radioOk(p1.siteConfirme)) errors.push("Phase 1 — Q2 : Site opératoire confirmé");
  if (!radioOk(p1.docsDisponibles)) errors.push("Phase 1 — Q2 : Documentation disponible");
  if (!radioOk(p1.installation)) errors.push("Phase 1 — Q3 : Mode d'installation");
  if (!boolPairOk(p1.materielChir)) errors.push("Phase 1 — Q4 : Matériel chirurgical");
  if (!boolPairOk(p1.materielAnes)) errors.push("Phase 1 — Q4 : Matériel anesthésique");
  if (!boolPairOk(p1.allergie)) errors.push("Phase 1 — Q5 : Allergie du patient");
  if (!boolPairOk(p1.risqueIntubation)) errors.push("Phase 1 — Q5 : Risque d'intubation");
  if (!boolPairOk(p1.risqueSaignement)) errors.push("Phase 1 — Q5 : Risque de saignement");

  // Phase 2
  const p2 = data.phase2;
  if (!boolPairOk(p2.v6_identite)) errors.push("Phase 2 — Q6 : Identité patient");
  if (!boolPairOk(p2.v6_intervention)) errors.push("Phase 2 — Q6 : Intervention confirmée");
  if (!boolPairOk(p2.v6_site)) errors.push("Phase 2 — Q6 : Site opératoire");
  if (!boolPairOk(p2.v6_installation)) errors.push("Phase 2 — Q6 : Installation");
  if (!boolPairOk(p2.v6_documents)) errors.push("Phase 2 — Q6 : Documents disponibles");
  if (!radioOk(p2.chirurgical.radio)) errors.push("Phase 2 — Q7 : Plan chirurgical");
  if (!radioOk(p2.anesth.radio)) errors.push("Phase 2 — Q7 : Plan anesthésique");
  if (!radioOk(p2.ideIbode.radio)) errors.push("Phase 2 — Q7 : IDE/IBODE");
  if (!radioOk(p2.antibio)) errors.push("Phase 2 — Q8 : Antibioprophylaxie");

  return errors;
}

// ── Storage helpers ────────────────────────────────────────────────────────────

function loadChecklist(): ChecklistData {
  if (typeof window === "undefined") return CHECKLIST_INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChecklistData) : CHECKLIST_INITIAL;
  } catch {
    return CHECKLIST_INITIAL;
  }
}

function isAlreadyValidated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(VALIDATED_KEY) === "true";
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ChecklistOmsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? "PT-00000";

  const [checklistData, setChecklistData] = useState<ChecklistData>(CHECKLIST_INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Hydrate on mount
  useEffect(() => {
    setChecklistData(loadChecklist());
    setValidated(isAlreadyValidated());
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistData));
  }, [checklistData, hydrated]);

  const handleValidateClick = () => {
    const errors = validateChecklist(checklistData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setShowModal(true);
  };

  const handleSignatureConfirmed = () => {
    setShowModal(false);
    localStorage.setItem(VALIDATED_KEY, "true");
    setValidated(true);
    alert("Signature validée — Check-list OMS enregistrée.");
    router.push(`/bloc/activite-pendant-operation?patientId=${patientId}`);
  };

  const handleReset = () => {
    setChecklistData(CHECKLIST_INITIAL);
    setValidationErrors([]);
    setValidated(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VALIDATED_KEY);
  };

  return (
    <>
      {showModal && (
        <SignatureModal
          medecinNom={MEDECIN_NOM}
          onConfirm={handleSignatureConfirmed}
          onCancel={() => setShowModal(false)}
        />
      )}

      <main className="p-8">
        <div className="space-y-8">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">
                Check-list avant opération
              </h1>
              {validated && (
                <span className="inline-flex items-center gap-1.5 mt-2 bg-secondary/10 text-secondary text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Checklist déjà validée
                </span>
              )}
            </div>
            <Link
              href={`/bloc/medicaments-anesthesie?patientId=${encodeURIComponent(patientId)}`}
              className="inline-flex items-center gap-2 self-start rounded-lg bg-[#001b3d] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#001b3d]/90 md:self-auto"
            >
              <span className="material-symbols-outlined text-[20px]">medication</span>
              Médicament
            </Link>
          </header>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PhaseAvantInduction
              data={checklistData.phase1}
              onChange={(phase1) => setChecklistData((prev) => ({ ...prev, phase1 }))}
            />
            <PhaseAvantIntervention
              data={checklistData.phase2}
              onChange={(phase2) => setChecklistData((prev) => ({ ...prev, phase2 }))}
            />
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-error-container/40 border border-error/20 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {validationErrors.length} section(s) incomplète(s) — veuillez renseigner tous les champs obligatoires.
              </p>
              <ul className="space-y-1 pl-6">
                {validationErrors.map((err) => (
                  <li key={err} className="text-xs text-error/80 list-disc">{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Réinitialiser
            </button>

            <button
              onClick={handleValidateClick}
              disabled={validated}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-2xl">check_circle</span>
              <span>{validated ? "Déjà validée" : "Valider la check-list"}</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

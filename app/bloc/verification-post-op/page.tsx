"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { patientActif } from "@/lib/mock/patient-actif";

export default function VerificationPostOpPage() {
  const router = useRouter();
  const [reponse, setReponse] = useState<"oui" | "non" | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    const saved = localStorage.getItem(`verification_post_op_patient_${patientActif.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.reponse) setReponse(parsed.reponse);
        if (parsed.valide) setIsValidated(true);
      } catch (e) {
        console.error("Erreur de chargement", e);
      }
    }
  }, []);

  const handleValidate = () => {
    if (reponse === null) {
      alert("Veuillez répondre à la question avant de valider.");
      return;
    }

    if (!confirm("Voulez-vous valider cette vérification ? Une signature électronique sera apposée au nom du Dr. RANDRIAMANANA Martin.")) {
      return;
    }

    const data = {
      reponse,
      dateValidation: new Date().toISOString(),
      signature: "Dr. RANDRIAMANANA Martin",
      valide: true
    };

    localStorage.setItem(`verification_post_op_patient_${patientActif.id}`, JSON.stringify(data));
    setIsSaved(true);
    setIsValidated(true);
    
    setTimeout(() => {
      setIsSaved(false);
      router.replace('/bloc/salle-de-reveil');
    }, 2000);
  };


  return (
    <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
      {/* Container Principal */}
      <div className="flex-1 p-6 md:p-10 bg-sky-50/50 flex flex-col gap-12">
        
        {/* Header contextuel */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="inline-flex w-fit text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-1 rounded-md">
                Étape Post-Opératoire
              </span>
              {isValidated && (
                <span className="inline-flex w-fit text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-1 rounded-md">
                  Déjà Validé
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-manrope font-extrabold text-on-surface mt-2 tracking-tight">
              Check-list de vérification
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-50">
              <span className="material-symbols-outlined text-blue-600 text-sm">person</span>
              <span className="text-xs font-bold text-on-surface">Patient: {patientActif.nom}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-50">
              <span className="material-symbols-outlined text-blue-600 text-sm">fingerprint</span>
              <span className="text-xs font-bold text-on-surface">MRN: {patientActif.id}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl bg-white rounded-full p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 border border-transparent hover:border-blue-100 transition-all">
            {/* Left side */}
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full bg-sky-100 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl md:text-4xl fill-1">prescriptions</span>
              </div>
              <h3 className="text-xl md:text-2xl font-manrope font-semibold text-on-surface leading-snug">
                Les prescriptions pour les suites opératoire sont faites de manière conjointe
              </h3>
            </div>

            {/* Right side: Styled Radio inputs */}
            <div className="flex gap-4">
              <label className={`relative flex items-center group ${isValidated ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                <input 
                  type="radio" 
                  name="conjoint" 
                  value="oui" 
                  className="peer sr-only" 
                  checked={reponse === "oui"} 
                  onChange={() => !isValidated && setReponse("oui")} 
                  disabled={isValidated}
                />
                <div className="px-8 py-4 rounded-full border-2 border-slate-100 text-outline font-bold font-manrope transition-all group-hover:border-secondary/50 peer-checked:bg-secondary peer-checked:border-secondary peer-checked:text-white peer-checked:shadow-lg peer-checked:scale-105">
                  Oui
                </div>
              </label>

              <label className={`relative flex items-center group ${isValidated ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                <input 
                  type="radio" 
                  name="conjoint" 
                  value="non" 
                  className="peer sr-only" 
                  checked={reponse === "non"} 
                  onChange={() => !isValidated && setReponse("non")} 
                  disabled={isValidated}
                />
                <div className="px-8 py-4 rounded-full border-2 border-slate-100 text-outline font-bold font-manrope transition-all group-hover:border-tertiary/50 peer-checked:bg-tertiary peer-checked:border-tertiary peer-checked:text-white peer-checked:shadow-lg peer-checked:scale-105">
                  Non
                </div>
              </label>
            </div>
          </div>
        </div>

      </div>

      {/* Footer sticky */}
      <footer className="sticky bottom-0 bg-white/60 backdrop-blur-md px-6 md:px-10 py-6 flex flex-col items-end gap-4 border-t border-slate-100 z-30">
        {/* Toast de succès */}
        {isSaved && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-100 animate-in fade-in slide-in-from-bottom-4">
            <span className="material-symbols-outlined font-bold text-lg">verified_user</span>
            <span className="text-sm font-bold">Vérification validée et signée. Redirection...</span>
          </div>
        )}

        <button
          onClick={handleValidate}
          className="bg-primary hover:bg-primary-container text-white px-12 py-4 rounded-full text-lg font-extrabold flex items-center gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={reponse === null || isValidated}
        >
          <span>{isValidated ? "Déjà validé" : "Valider et signer"}</span>
          <span className="material-symbols-outlined font-bold">
            {isValidated ? "lock" : "check_circle"}
          </span>
        </button>
      </footer>
    </main>

  );
}

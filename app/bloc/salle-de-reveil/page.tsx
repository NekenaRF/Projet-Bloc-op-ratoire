"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { patientActif } from "@/lib/mock/patient-actif";

export default function SalleDeReveilPage() {
  const [heureArrivee, setHeureArrivee] = useState("14:25");
  const [respiratoire, setRespiratoire] = useState({
    etatInitial: { intubation: false, curarisation: false },
    reponse: { intubation: false, curarisation: false }
  });
  const [douleur, setDouleur] = useState({
    evs: null as number | null,
    eqa: null as number | null,
    eva: 3
  });
  const [scoreSCCRE, setScoreSCCRE] = useState({
    motricite: 2,
    respiration: 2,
    pression: 2,
    conscience: 2,
    coloration: 1
  });
  const [retourService, setRetourService] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  const router = useRouter();

  const totalSCCRE = Object.values(scoreSCCRE).reduce((acc, curr) => acc + curr, 0);

  // Charger les données au montage
  useEffect(() => {
    const saved = localStorage.getItem(`salle_reveil_patient_${patientActif.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.heureArrivee) setHeureArrivee(parsed.heureArrivee);
        if (parsed.respiratoire) setRespiratoire(parsed.respiratoire);
        if (parsed.douleur) setDouleur(parsed.douleur);
        if (parsed.scoreSCCRE) setScoreSCCRE(parsed.scoreSCCRE);
        if (parsed.retourService !== undefined) setRetourService(parsed.retourService);
      } catch (e) {
        console.error("Erreur de chargement", e);
      }
    }
  }, []);

  const handleValidate = () => {
    if (totalSCCRE < 9) {
      alert("Le score SCCRE doit être supérieur ou égal à 9 pour autoriser la sortie.");
      return;
    }
    if (!retourService) {
      alert("Veuillez cocher l'autorisation de retour en service.");
      return;
    }

    if (!confirm("Valider la sortie de salle de réveil ? Signature électronique requise (Dr. Martin).")) {
      return;
    }

    const dataToSave = {
      heureArrivee,
      respiratoire,
      douleur,
      scoreSCCRE,
      retourService,
      dateValidation: new Date().toISOString(),
      signature: "Dr. Martin (Anesthésiste)"
    };

    localStorage.setItem(`salle_reveil_patient_${patientActif.id}`, JSON.stringify(dataToSave));
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      router.push('/bloc');
    }, 2000);
  };

  const toggleRespiratoire = (section: "etatInitial" | "reponse", key: "intubation" | "curarisation") => {
    setRespiratoire(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }));
  };

  return (
    <main className="relative min-h-screen bg-surface">
      {/* TopAppBar (sticky, glassmorphique) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="font-manrope font-extrabold text-primary text-3xl tracking-tight">
            Salle de réveil
          </h2>
          
          {/* Barre de recherche */}
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input 
              type="text" 
              placeholder="Rechercher un patient ou un soin..."
              className="pl-10 pr-4 py-2 bg-surface-container-low rounded-full border-none focus:ring-2 focus:ring-primary/20 text-sm w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative p-2 hover:bg-surface-container-low rounded-full cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-tertiary rounded-full border-2 border-white"></span>
          </div>

          {/* Settings */}
          <div className="p-2 hover:bg-surface-container-low rounded-full cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
          </div>

          <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>

          {/* Avatar Médecin */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface">Dr. RANDRIAMANANA</p>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Chirurgien</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Barre horizontale patient contextuel */}
      <div className="bg-surface-container-high border-b border-outline-variant/10 px-8 py-3">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Patient</span>
            <span className="text-sm font-extrabold text-on-surface">{patientActif.nom}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Âge</span>
            <span className="text-sm font-bold text-on-surface">42 ans</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">ID Dossier</span>
            <span className="text-sm font-mono font-medium text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
              {patientActif.id}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Intervention</span>
            <span className="text-sm font-bold text-on-surface">Chirurgie Digestive</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Responsable</span>
            <span className="text-sm font-bold text-on-surface">Dr. Martin (Anesthésiste)</span>
          </div>

          <div className="flex-1"></div>

          {/* Heure d'arrivée */}
          <div className="flex items-center gap-3 bg-white/50 pl-4 pr-1 py-1 rounded-lg border border-outline-variant/20 shadow-sm">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Arrivée SSPI</span>
            <input 
              type="time" 
              value={heureArrivee}
              onChange={(e) => setHeureArrivee(e.target.value)}
              className="bg-transparent border-none text-sm font-black text-primary focus:ring-0 p-1"
            />
          </div>
        </div>
      </div>

      {/* Zone de contenu scrollable */}
      <div className="p-8 scrolling-content max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Colonne gauche (lg:col-span-5) */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Carte "État respiratoire / Neuromusculaire" */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">air</span>
                <h3 className="font-bold text-on-surface">État respiratoire / Neuromusculaire</h3>
              </div>

              <div className="space-y-6">
                {/* État initial */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-outline">État initial</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-3">
                    <label className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={respiratoire.etatInitial.intubation}
                        onChange={() => toggleRespiratoire("etatInitial", "intubation")}
                        className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer transition-all group-hover:scale-110"
                      />
                      <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Intubation</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={respiratoire.etatInitial.curarisation}
                        onChange={() => toggleRespiratoire("etatInitial", "curarisation")}
                        className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer transition-all group-hover:scale-110"
                      />
                      <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Curarisation</span>
                    </label>
                  </div>
                </div>

                {/* Réponse */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-outline">Réponse</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pl-3">
                    <label className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={respiratoire.reponse.intubation}
                        onChange={() => toggleRespiratoire("reponse", "intubation")}
                        className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer transition-all group-hover:scale-110"
                      />
                      <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Intubation</span>
                    </label>
                    <label className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={respiratoire.reponse.curarisation}
                        onChange={() => toggleRespiratoire("reponse", "curarisation")}
                        className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer transition-all group-hover:scale-110"
                      />
                      <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-on-surface">Curarisation</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte "Évaluation de la Douleur" */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">thermostat</span>
                <h3 className="font-bold text-on-surface">Évaluation de la Douleur</h3>
              </div>

              <div className="space-y-8">
                {/* EVS */}
                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-outline">EVS (Échelle Verbale Simple)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 1, label: "Aucune" },
                      { val: 2, label: "Modérée" },
                      { val: 3, label: "Intense" }
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => setDouleur(prev => ({ ...prev, evs: item.val }))}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border-2 ${
                          douleur.evs === item.val
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-slate-100 bg-surface-container-low text-on-surface-variant hover:border-primary/30"
                        }`}
                      >
                        {item.label} ({item.val})
                      </button>
                    ))}
                  </div>
                </div>

                {/* EQA */}
                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-outline">EQA (Qualité analgésie)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 1, label: "Calme" },
                      { val: 2, label: "Agité" },
                      { val: 3, label: "Plaintes" }
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => setDouleur(prev => ({ ...prev, eqa: item.val }))}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border-2 ${
                          douleur.eqa === item.val
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-slate-100 bg-surface-container-low text-on-surface-variant hover:border-primary/30"
                        }`}
                      >
                        {item.label} ({item.val})
                      </button>
                    ))}
                  </div>
                </div>

                {/* EVA */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-black uppercase tracking-widest text-outline">EVA (Échelle Visuelle Analogique)</p>
                    <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Score: {douleur.eva}/10
                    </span>
                  </div>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="1"
                      value={douleur.eva}
                      onChange={(e) => setDouleur(prev => ({ ...prev, eva: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 px-1">
                      <span className="text-[10px] font-bold text-outline">1</span>
                      <span className="text-[10px] font-bold text-outline">5</span>
                      <span className="text-[10px] font-bold text-outline">10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite (lg:col-span-7) */}
          <section className="lg:col-span-7 space-y-6">
            {/* Carte "Score de réveil (SCCRE)" */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-white/40">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">clinical_notes</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-lg">Score de réveil (SCCRE)</h3>
                    <p className="text-xs text-outline-variant font-medium">Évaluation de la récupération post-anesthésique</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-lg border border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                    Surveillance
                  </button>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-outline">Score Total</span>
                    <span className={`text-2xl font-black ${totalSCCRE >= 9 ? 'text-emerald-600' : 'text-primary'}`}>
                      {totalSCCRE.toString().padStart(2, '0')}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { 
                    key: "motricite", 
                    label: "1. Motricité", 
                    options: [
                      { val: 2, text: "Bouge 4 membres" },
                      { val: 1, text: "Bouge 2 membres" },
                      { val: 0, text: "Immobile" }
                    ]
                  },
                  { 
                    key: "respiration", 
                    label: "2. Respiration", 
                    options: [
                      { val: 2, text: "Respire prof. + tousse" },
                      { val: 1, text: "Dyspnée / respiration lim." },
                      { val: 0, text: "Apnée" }
                    ]
                  },
                  { 
                    key: "pression", 
                    label: "3. Pression artérielle", 
                    options: [
                      { val: 2, text: "≤ 20 mmHg" },
                      { val: 1, text: "20–50 mmHg" },
                      { val: 0, text: "≥ 50 mmHg" }
                    ]
                  },
                  { 
                    key: "conscience", 
                    label: "4. État de conscience", 
                    options: [
                      { val: 2, text: "Réveillé" },
                      { val: 1, text: "Réveille à la demande" },
                      { val: 0, text: "Ne répond pas" }
                    ]
                  },
                  { 
                    key: "coloration", 
                    label: "5. Coloration", 
                    options: [
                      { val: 2, text: "Normale" },
                      { val: 1, text: "Pâle / grisâtre" },
                      { val: 0, text: "Cyanose" }
                    ]
                  }
                ].map((row) => (
                  <div key={row.key} className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-outline">{row.label}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {row.options.map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => setScoreSCCRE(prev => ({ ...prev, [row.key]: opt.val }))}
                          className={`p-3 rounded-xl text-[10px] md:text-xs font-bold text-center leading-tight transition-all flex flex-col items-center justify-center gap-1 border-2 ${
                            (scoreSCCRE as any)[row.key] === opt.val
                              ? "bg-primary border-primary text-white shadow-md scale-[1.02]"
                              : "bg-surface-container-low border-transparent text-on-surface-variant hover:border-primary/20"
                          }`}
                        >
                          <span className="text-[10px] opacity-60">Score {opt.val}</span>
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte "Décision de sortie" */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-l-secondary">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">output</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">Décision de sortie</h3>
                    <p className="text-[10px] text-outline-variant font-medium uppercase tracking-wider">Autorisation de retour en service</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10">
                <label className={`flex items-center gap-4 cursor-pointer group ${totalSCCRE < 9 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={retourService}
                    disabled={totalSCCRE < 9}
                    onChange={(e) => setRetourService(e.target.checked)}
                    className="w-6 h-6 text-secondary border-outline-variant rounded-lg focus:ring-secondary cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">Retour en service hospitalier autorisé</p>
                    <p className={`text-[10px] font-bold ${totalSCCRE >= 9 ? 'text-emerald-600' : 'text-tertiary'}`}>
                      {totalSCCRE >= 9 ? "Condition remplie (Score ≥ 9)" : "Condition non remplie (Score ≥ 9 requis)"}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-8 border-t border-outline-variant/20">
          <button className="flex items-center gap-2 text-outline-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-bold text-sm">Retour</span>
          </button>

          <button 
            onClick={handleValidate}
            className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">done_all</span>
            <span>Valider le passage en SSPI</span>
          </button>
        </div>
      </div>

      {/* Alerte flottante */}
      {showAlert && (
        <div className="fixed left-72 bottom-8 z-50 animate-in slide-in-from-left-4 fade-in duration-500">
          <div className="bg-tertiary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 ring-4 ring-tertiary/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white animate-pulse">warning</span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-black tracking-tight leading-none mb-1 uppercase">Alerte Critique</p>
              <p className="text-xs font-medium text-white/90">Patient en zone de surveillance active SSPI</p>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast de succès */}
      {isSaved && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined">verified</span>
            <span className="font-bold">Sortie SSPI validée avec succès ! Redirection...</span>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { patientActif } from "@/lib/mock/patient-actif";
import { equipeOperatoire } from "@/lib/mock/equipe-operatoire";

export default function ProtocoleOperatoirePage() {
  const router = useRouter();
  const [protocole, setProtocole] = React.useState("");
  const [surveillance, setSurveillance] = React.useState({
    ta: { checked: true, value: "" },
    pouls: { checked: true, value: "" },
    fr: { checked: true, value: "" },
    temperature: { checked: true, value: "" },
    diurese: { checked: false, value: "" },
    autres: { checked: false, value: "" },
  });

  const [drainages, setDrainages] = React.useState({
    naso: null,
    crane: null,
    thorax: null,
    abdomenG: null,
    abdomenD: null,
  });

  const [perfusions, setPerfusions] = React.useState({
    brasG: false,
    brasD: false,
    voieCentrale: false,
  });

  const [traitements, setTraitements] = React.useState({
    antibiotiques: "",
    antalgiques: "",
    autres: "",
  });

  const [isSaved, setIsSaved] = React.useState(false);

  // Charger les données existantes
  React.useEffect(() => {
    const savedData = localStorage.getItem(`protocole_post_op_patient_${patientActif.id}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setProtocole(parsed.protocole || "");
        if (parsed.surveillance) setSurveillance(parsed.surveillance);
        if (parsed.drainages) setDrainages(parsed.drainages);
        if (parsed.perfusions) setPerfusions(parsed.perfusions);
        if (parsed.traitements) setTraitements(parsed.traitements);
      } catch (e) {
        console.error("Erreur lors du chargement des données", e);
      }
    }
  }, []);

  const handleSave = () => {
    const confirmSave = confirm("Valider le protocole opératoire ? Cette action va générer une signature électronique simulée.");
    
    if (confirmSave) {
      const dataToSave = {
        protocole,
        surveillance,
        drainages,
        perfusions,
        traitements,
        timestamp: new Date().toISOString(),
        signataire: patientActif.chirurgien
      };

      localStorage.setItem(`protocole_post_op_patient_${patientActif.id}`, JSON.stringify(dataToSave));
      setIsSaved(true);
      
      // Petit délai pour laisser voir le message de succès avant redirection
      setTimeout(() => {
        router.push('/bloc/verification-post-op');
      }, 1500);
    }
  };

  const handleSurveillanceChange = (key: string, field: "checked" | "value", val: any) => {
    setSurveillance(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], [field]: val }
    }));
  };

  const toggleDrainage = (key: string, value: string) => {
    setDrainages(prev => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? null : value
    }));
  };

  const togglePerfusion = (key: string) => {
    setPerfusions(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleTraitementChange = (key: string, value: string) => {
    setTraitements(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-surface">
      {/* TopAppBar Context Header */}
      <header className="bg-white/80 backdrop-blur-xl fixed top-0 right-0 left-64 z-40 px-6 py-3 flex justify-between items-center shadow-sm border-b">
        {/* Left: Patient Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-on-surface">
                {patientActif.nom} | {patientActif.age} ans
              </h2>
            </div>
            <p className="text-[11px] text-outline font-medium">
              ID: {patientActif.id} • {patientActif.specialite} ({patientActif.intervention})
            </p>
          </div>
        </div>

        {/* Right: Surgeon Info & Icons */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-r border-surface-variant/30 pr-6">
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface leading-tight">
                {patientActif.chirurgien}
              </p>
              <p className="text-[10px] text-outline font-bold uppercase tracking-wider">
                Chirurgien
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs ring-2 ring-primary/20">
              MR
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-outline hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="p-2 text-outline hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 mt-16 flex flex-col overflow-hidden">
        {/* Titre Principal */}
        <h1 className="mx-8 mt-8 mb-4 text-2xl font-extrabold text-on-surface font-headline">
          Protocole opératoire et Instructions Post-opératoires
        </h1>

        {/* Section Équipe Opératoire */}
        <div className="mx-8 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {equipeOperatoire.map((membre) => (
            <div 
              key={membre.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-surface-variant/50 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  {membre.role.includes("Chirurgien") ? "medical_information" : 
                   membre.role.includes("Infirmière") ? "medical_services" : 
                   membre.role.includes("Anesthésiste") ? "ecg" : "person"}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface leading-snug">{membre.nom}</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider">{membre.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Zone de contenu principale (colonnes) - C'est cette zone qui scrolle si besoin */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 p-8 pt-0 overflow-y-auto">
          {/* Colonne Gauche: Protocole Opératoire */}
          <section className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-extrabold text-on-surface font-headline">Protocole Opératoire</h3>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Édition Libre
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col p-6 ring-1 ring-black/5 flex-1 min-h-[400px]">
              <label className="text-sm font-bold text-on-surface-variant mb-3">
                Compte-rendu de l’intervention
              </label>
              <textarea
                className="flex-1 w-full bg-surface-container-low rounded-lg p-4 font-body text-on-surface border-none resize-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[300px]"
                placeholder="Saisissez ici les détails de l’intervention, les observations per-opératoires et les éventuelles complications..."
                value={protocole}
                onChange={(e) => setProtocole(e.target.value)}
              />
            </div>
          </section>

          {/* Colonne Droite: Instructions Post-opératoires */}
          <section className="flex-1 lg:w-[500px] lg:flex-none flex flex-col space-y-6">
            <h3 className="text-2xl font-extrabold text-on-surface font-headline mb-2">
              Instructions Post-opératoires
            </h3>

            {/* Section 1 – Surveillance */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
                <span className="uppercase text-xs tracking-widest font-bold text-on-surface-variant">
                  1. Surveillance
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {[
                  { key: "ta", label: "TA (Tension)", placeholder: "Val..." },
                  { key: "pouls", label: "Pouls", placeholder: "bpm" },
                  { key: "fr", label: "FR (Respiration)", placeholder: "c/min" },
                  { key: "temperature", label: "Température", placeholder: "°C" },
                  { key: "diurese", label: "Diurèse", placeholder: "ml" },
                  { key: "autres", label: "Autres", placeholder: "..." },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-surface-dim text-primary focus:ring-primary/20 cursor-pointer"
                        checked={(surveillance as any)[item.key].checked}
                        onChange={(e) => handleSurveillanceChange(item.key, "checked", e.target.checked)}
                      />
                      <label className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                    <input
                      type="text"
                      className="w-24 bg-slate-50 border-none rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary/30 transition-all"
                      placeholder={item.placeholder}
                      value={(surveillance as any)[item.key].value}
                      onChange={(e) => handleSurveillanceChange(item.key, "value", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 – Drainages */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">fluid_med</span>
                <span className="uppercase text-xs tracking-widest font-bold text-on-surface-variant">
                  2. Drainages
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { key: "naso", label: "Sonde naso-gastrique", options: ["Siphon", "Aspira."] },
                  { key: "crane", label: "Drain crâne", options: ["Siphon", "Aspira."] },
                  { key: "thorax", label: "Drain thorax", options: ["Siphon", "Aspira."] },
                  { key: "abdomenG", label: "Drain abdomen", badge: "GAUCHE", options: ["Siphon", "Aspira."] },
                  { key: "abdomenD", label: "Drain abdomen", badge: "DROITE", options: ["Siphon", "Aspira."] },
                ].map((drain) => (
                  <div key={drain.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-on-surface">{drain.label}</span>
                      {drain.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${drain.badge === "GAUCHE" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                          {drain.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                      {drain.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => toggleDrainage(drain.key, opt.toLowerCase())}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            (drainages as any)[drain.key] === opt.toLowerCase()
                              ? "bg-white text-primary shadow-sm"
                              : "text-outline hover:text-on-surface"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 – Prescription à suivre */}
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">prescriptions</span>
                <span className="uppercase text-xs tracking-widest font-bold text-on-surface-variant">
                  3. Prescription à suivre
                </span>
              </div>

              {/* Sous-section Perfusion */}
              <div className="mb-6">
                <p className="text-[11px] font-bold text-outline uppercase tracking-wider mb-3">Perfusion</p>
                <div className="space-y-2">
                  {[
                    { key: "brasG", label: "Bras gauche" },
                    { key: "brasD", label: "Bras droit" },
                    { key: "voieCentrale", label: "Voie centrale" },
                  ].map((perf) => (
                    <div key={perf.key} className="flex items-center justify-between bg-surface-container-low/50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-on-surface">{perf.label}</span>
                      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => togglePerfusion(perf.key)}>
                        <input
                          type="checkbox"
                          checked={(perfusions as any)[perf.key]}
                          readOnly
                          className="w-4 h-4 rounded border-surface-dim text-secondary focus:ring-secondary/20 cursor-pointer"
                        />
                        <span className="text-[11px] font-bold text-secondary group-hover:opacity-80 transition-opacity">
                          En Y
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sous-section Traitement */}
              <div>
                <p className="text-[11px] font-bold text-outline uppercase tracking-wider mb-3">Traitement</p>
                <div className="space-y-3">
                  {[
                    { key: "antibiotiques", label: "Antibiotiques", icon: "vaccines", border: "border-secondary" },
                    { key: "antalgiques", label: "Antalgiques", icon: "pill", border: "border-primary" },
                    { key: "autres", label: "Autres", icon: "more_horiz", border: "border-outline" },
                  ].map((tr) => (
                    <div key={tr.key} className={`flex items-center gap-3 bg-white p-2 rounded-lg border-l-4 ${tr.border} shadow-sm ring-1 ring-black/5`}>
                      <span className="material-symbols-outlined text-outline text-[18px]">{tr.icon}</span>
                      <input
                        type="text"
                        className="bg-transparent border-none text-xs w-full placeholder:text-slate-400 focus:ring-0"
                        placeholder={`Saisissez ${tr.label.toLowerCase()}...`}
                        value={(traitements as any)[tr.key]}
                        onChange={(e) => handleTraitementChange(tr.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Message de succès */}
            {isSaved && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-100 mb-4 animate-in fade-in slide-in-from-bottom-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="text-xs font-bold">Protocole validé et enregistré localement</span>
              </div>
            )}

            {/* Bouton de validation */}
            <div className="flex justify-end pt-4 pb-8">
              <button 
                onClick={handleSave}
                className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold flex items-center space-x-3 shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">verified_user</span>
                <span>Valider et enregistrer</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


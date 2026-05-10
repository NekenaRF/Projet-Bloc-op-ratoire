"use client";

import { useState } from "react";
import MedicamentTable, {
  type MedicamentRow,
} from "@/components/bloc/medicaments-anesthesie/MedicamentTable";
import { patientActif } from "@/lib/mock/patient-actif";

const STORAGE_KEY = "bloc_medicaments_anesthesie_selection";

type ConsommablesState = {
  cotonAlcool: boolean;
  sparadrap: boolean;
  dakin: boolean;
  betadine: boolean;
  seringues: boolean;
  securefix: boolean;
  lunettesNasales: boolean;
  kitAgAlr: boolean;
};

const INITIAL_CONSOMMABLES: ConsommablesState = {
  cotonAlcool: false,
  sparadrap: false,
  dakin: false,
  betadine: false,
  seringues: false,
  securefix: false,
  lunettesNasales: false,
  kitAgAlr: false,
};

const CONSOMMABLE_ITEMS: {
  key: keyof ConsommablesState;
  label: string;
}[] = [
  { key: "cotonAlcool", label: "Coton / Alcool" },
  { key: "sparadrap", label: "Sparadrap" },
  { key: "dakin", label: "Dakin" },
  { key: "betadine", label: "Bétadine" },
  { key: "seringues", label: "Seringues" },
  { key: "securefix", label: "Sécurefix" },
  { key: "lunettesNasales", label: "Lunettes nasales" },
  { key: "kitAgAlr", label: "Kit AG / ALR" },
];

function formatSelectedTableRows(section: string, rows: MedicamentRow[]): string | null {
  const lines = rows
    .filter((r) => r.selected)
    .map((r) => {
      const parts = [r.label];
      if (r.dosage.trim()) parts.push(`Qté/dosage: ${r.dosage}`);
      if (r.observation.trim()) parts.push(`Obs.: ${r.observation}`);
      return `  • ${parts.join(" — ")}`;
    });
  if (!lines.length) return null;
  return `${section}\n${lines.join("\n")}`;
}

export default function MedicamentsAnesthesiePage() {
  /** Liste CHU Fianarantsoa — Sérums (vol. indicatifs dans placeholder) */
  const [serums, setSerums] = useState<MedicamentRow[]>([
    {
      id: "sgi",
      label: "SGI 5%",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "500 ml – 1000 ml",
    },
    {
      id: "ssi",
      label: "SSI 9%",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "500 ml – 1000 ml",
    },
    {
      id: "rl",
      label: "RL (Ringer lactate)",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "500 ml – 1000 ml",
    },
    {
      id: "hestar",
      label: "Hestar",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "500 ml",
    },
    {
      id: "dns",
      label: "DNS",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "500 ml",
    },
    {
      id: "mannitol",
      label: "Mannitol 20 %",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "100 ml à 500 ml",
    },
    {
      id: "serum-compose",
      label: "Sérum composé",
      selected: false,
      dosage: "",
      observation: "",
      dosagePlaceholder: "500 ml",
    },
  ]);

  /** Produits anesthésiques — CHU Fianarantsoa */
  const [anesthesiques, setAnesthesiques] = useState<MedicamentRow[]>([
    {
      id: "nesdonal-pancuronium-vecuronium",
      label:
        "Nesdonal 1 g — Pancuronium 4 mg / Vecuronium 4 mg",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "fentanyl-ketamine",
      label: "Fentanyl 100–500 — Ketamine 100 mg",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "provive-propofol-lipuro",
      label: "Provive 1 % 20 ml — Propofol lipuro 1 % 20 ml",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "diazepam-midazolam",
      label: "Diazépam 10 mg inj. — Midazolam inj.",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "atropine",
      label: "Atropine 0,50 mg – 0,25 mg",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "atarax-butorphanol",
      label: "Atarax 100 mg inj. — Butorphanol tartrate 100 mg",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "bupivacaine-rachi",
      label:
        "Bupivacaïne rachi 0,50 % 4 ml — Bupivacaïne 0,50 % 4 ml",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "bupivacaine-alro",
      label:
        "Bupivacaïne ALRO 0,50 % 20 ml sans adrénaline — Bupivacaïne 0,50 % 20 ml sans adrén.",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "lidocaine",
      label:
        "Lidocaïne 1 % – 2 % (avec / sans adrénaline) — Lidocaïne 1 % – 2 %",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "stimuplex-halothane",
      label: "Stimuplex 50 mm — Halothane",
      selected: false,
      dosage: "",
      observation: "",
    },
  ]);

  /** Antalgiques — CHU Fianarantsoa */
  const [antalgiques, setAntalgiques] = useState<MedicamentRow[]>([
    {
      id: "perfalgan-doliprane",
      label:
        "Perfalgan 500 mg – 1000 mg — Doliprane suppo (100–150–200–300–1000 mg)",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "profenid-lamaline",
      label: "Profénid 100 mg inj. / suppo — Lamaline suppo",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "nifluril-tramadol",
      label: "Nifluril 400 mg inj. / suppo — Tramadol 100 mg inj.",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "acupan",
      label: "Acupan 20 mg inj.",
      selected: false,
      dosage: "",
      observation: "",
    },
  ]);

  /** Kit pour asepsie — CHU Fianarantsoa */
  const [kitAsepsie, setKitAsepsie] = useState<MedicamentRow[]>([
    {
      id: "blouse-calot",
      label: "Blouse — Calot",
      selected: false,
      dosage: "",
      observation: "",
      dosageInputType: "number",
      dosagePlaceholder: "Qté",
    },
    {
      id: "champ-set-central",
      label: "Champ stérile PM – GM — SET pour voie centrale",
      selected: false,
      dosage: "",
      observation: "",
      dosageInputType: "text",
      dosagePlaceholder: "N° / précision",
    },
    {
      id: "set-peripheriques",
      label: "SET pour voie périphériques",
      selected: false,
      dosage: "",
      observation: "",
      dosageInputType: "text",
      dosagePlaceholder: "N° / précision",
    },
    {
      id: "gants-non-steriles",
      label: "Paires de gants non stériles",
      selected: false,
      dosage: "",
      observation: "",
      dosageInputType: "text",
      dosagePlaceholder: "Taille / qté",
    },
    {
      id: "kit-bloc",
      label: "Kit bloc",
      selected: false,
      dosage: "",
      observation: "",
      dosageInputType: "text",
      dosagePlaceholder: "N° / précision",
    },
  ]);

  const [antibiotiques, setAntibiotiques] = useState<MedicamentRow[]>([
    {
      id: "flagyl",
      label: "Flagyl",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "heparine",
      label: "Héparine",
      selected: false,
      dosage: "",
      observation: "",
    },
  ]);

  const [dispositifsMedicaux, setDispositifsMedicaux] = useState<
    MedicamentRow[]
  >([
    {
      id: "perfuseur",
      label: "Perfuseur",
      selected: false,
      dosage: "",
      observation: "",
    },
    {
      id: "catheter",
      label: "Cathéter",
      selected: false,
      dosage: "",
      observation: "",
    },
  ]);

  const [consommables, setConsommables] =
    useState<ConsommablesState>(INITIAL_CONSOMMABLES);

  const toggleConsommable = (key: keyof ConsommablesState) => {
    setConsommables((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleValiderSelection = () => {
    const payload = {
      patientId: patientActif.id,
      updatedAt: new Date().toISOString(),
      serums,
      anesthesiques,
      antalgiques,
      kitAsepsie,
      antibiotiques,
      dispositifsMedicaux,
      consommables,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota / private mode */
    }

    const tableBlocks = [
      formatSelectedTableRows("1. SÉRUMS", serums),
      formatSelectedTableRows("2. ANESTHÉSIQUES", anesthesiques),
      formatSelectedTableRows("3. ANTALGIQUES", antalgiques),
      formatSelectedTableRows("4. KIT ASEPSIE", kitAsepsie),
      formatSelectedTableRows("5. ANTIBIOTIQUES & AUTRES", antibiotiques),
      formatSelectedTableRows("6. DISPOSITIFS MÉDICAUX", dispositifsMedicaux),
    ].filter(Boolean);

    const consommablesList = CONSOMMABLE_ITEMS.filter(
      (item) => consommables[item.key]
    ).map((item) => `  • ${item.label}`);

    const consommablesBlock =
      consommablesList.length > 0
        ? `7. CONSOMMABLES\n${consommablesList.join("\n")}`
        : null;

    const recapParts = [...tableBlocks, consommablesBlock].filter(Boolean);
    const message =
      recapParts.length > 0
        ? `Sélection enregistrée pour ${patientActif.nom}.\n\n${recapParts.join("\n\n")}`
        : `Aucun élément coché pour ${patientActif.nom}.\nLa fiche a tout de même été enregistrée (état vide).`;

    alert(message);
  };

  return (
    <main className="relative">
      <div className="min-h-screen p-8 pb-40">
        <div className="sticky top-0 z-30 mb-8 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-surface/80 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-container">
              <span className="material-symbols-outlined text-4xl text-primary">
                person
              </span>
            </div>
            <div>
              <h2 className="font-headline text-lg font-extrabold tracking-tight text-on-surface">
                {patientActif.nom}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium text-on-surface-variant">
                <span className="rounded bg-surface-container px-2 py-0.5 text-xs font-semibold">
                  ID&nbsp;: {patientActif.id}
                </span>
                <span aria-hidden="true">•</span>
                <span>{patientActif.age} ans</span>
                <span aria-hidden="true">•</span>
                <span>Chambre {patientActif.chambre}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
              Chirurgien
            </p>
            <p className="mt-1 font-headline text-base font-bold text-primary">
              {patientActif.chirurgien}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <h1 className="font-headline mx-auto mb-8 inline-block border-b-4 border-primary px-8 pb-2 text-center text-2xl font-extrabold uppercase text-on-surface">
            Liste des médicaments nécessaires pour l&apos;Anesthésie et la
            Réanimation
          </h1>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <MedicamentTable
            title="1. SÉRUMS"
            accent="primary"
            rows={serums}
            onRowsChange={setSerums}
          />
          <MedicamentTable
            title="2. ANESTHÉSIQUES"
            accent="secondary"
            rows={anesthesiques}
            onRowsChange={setAnesthesiques}
          />
          <MedicamentTable
            title="3. ANTALGIQUES"
            accent="tertiary"
            rows={antalgiques}
            onRowsChange={setAntalgiques}
          />
          <MedicamentTable
            title="4. KIT ASEPSIE"
            accent="primary-container"
            rows={kitAsepsie}
            onRowsChange={setKitAsepsie}
          />
          <MedicamentTable
            title="5. ANTIBIOTIQUES & AUTRES"
            accent="error"
            rows={antibiotiques}
            onRowsChange={setAntibiotiques}
          />
          <MedicamentTable
            title="6. DISPOSITIFS MÉDICAUX"
            accent="inverse-primary"
            rows={dispositifsMedicaux}
            onRowsChange={setDispositifsMedicaux}
          />

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-6 w-1.5 rounded-full bg-surface-variant" />
              <h3 className="font-headline text-lg font-bold uppercase text-on-surface">
                7. CONSOMMABLES
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {CONSOMMABLE_ITEMS.map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center gap-3 text-sm hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={consommables[item.key]}
                    onChange={() => toggleConsommable(item.key)}
                    className="h-4 w-4 rounded border-outline-variant text-secondary accent-secondary focus:ring-2 focus:ring-secondary"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="fixed bottom-0 left-64 right-0 z-40 flex justify-end border-t border-outline-variant/30 bg-surface/90 p-6 backdrop-blur-md">
        <button
          type="button"
          onClick={handleValiderSelection}
          className="flex items-center gap-2 rounded bg-navy-blue px-10 py-3 font-bold text-on-primary shadow-lg transition-all hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          Valider la sélection
        </button>
      </footer>
    </main>
  );
}

"use client";

import { ChecklistPhase1, RadioVal, BoolPair } from "@/types/bloc";

interface Props {
  data: ChecklistPhase1;
  onChange: (data: ChecklistPhase1) => void;
}

function set<K extends keyof ChecklistPhase1>(
  data: ChecklistPhase1,
  onChange: (d: ChecklistPhase1) => void,
  key: K,
  val: ChecklistPhase1[K]
) {
  onChange({ ...data, [key]: val });
}

function setBoolPair<K extends keyof ChecklistPhase1>(
  data: ChecklistPhase1,
  onChange: (d: ChecklistPhase1) => void,
  key: K,
  side: "oui" | "non",
  val: boolean
) {
  onChange({ ...data, [key]: { ...(data[key] as BoolPair), [side]: val } });
}

function RadioGroup({
  name,
  value,
  onChange,
  options,
  colorClass = "accent-primary",
}: {
  name: string;
  value: RadioVal;
  onChange: (v: RadioVal) => void;
  options: { label: string; value: RadioVal }[];
  colorClass?: string;
}) {
  return (
    <div className="flex space-x-6">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className={`w-4 h-4 cursor-pointer ${colorClass}`}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxPair({
  label,
  pair,
  onOui,
  onNon,
  colorClass = "accent-primary",
}: {
  label: string;
  pair: BoolPair;
  onOui: (v: boolean) => void;
  onNon: (v: boolean) => void;
  colorClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs leading-snug text-on-surface-variant flex-1">{label}</span>
      <div className="flex space-x-4 shrink-0">
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input type="checkbox" checked={pair.oui} onChange={(e) => onOui(e.target.checked)} className={`w-4 h-4 rounded cursor-pointer ${colorClass}`} />
          oui
        </label>
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input type="checkbox" checked={pair.non} onChange={(e) => onNon(e.target.checked)} className={`w-4 h-4 rounded cursor-pointer ${colorClass}`} />
          non
        </label>
      </div>
    </div>
  );
}

function QuestionCard({ children, borderColor = "border-outline-variant/10" }: { children: React.ReactNode; borderColor?: string }) {
  return <div className={`bg-white rounded-lg p-4 border ${borderColor}`}>{children}</div>;
}

export default function PhaseAvantInduction({ data, onChange }: Props) {
  return (
    <section className="bg-surface-container-low rounded-xl p-6 shadow-sm border-t-4 border-primary">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">timer_10_alt_1</span>
        </div>
        <h2 className="font-headline font-bold text-xl text-primary uppercase tracking-wide">
          Avant Induction Anesthésique
        </h2>
      </div>
      <p className="text-xs italic text-on-surface-variant mb-6">
        Temps de pause avant anesthésie
      </p>

      <div className="space-y-4">
        {/* Q1 – Identité */}
        <QuestionCard>
          <p className="text-sm font-bold text-primary mb-2">1- Identité du patient :</p>
          <p className="text-xs text-on-surface-variant mb-3">
            - le patient a décliné son nom. Sinon par défaut, autre moyen de vérification de son identité
          </p>
          <RadioGroup
            name="identite"
            value={data.identite}
            onChange={(v) => set(data, onChange, "identite", v)}
            options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }]}
          />
        </QuestionCard>

        {/* Q2 – Intervention & site */}
        <QuestionCard>
          <p className="text-sm font-bold text-primary mb-3">
            2- L'intervention et site opératoire sont confirmés :
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-on-surface-variant mb-2">
                - Idéalement par le patient et dans tous les cas, par le dossier ou procédure spécifique
              </p>
              <RadioGroup
                name="site_confirme"
                value={data.siteConfirme}
                onChange={(v) => set(data, onChange, "siteConfirme", v)}
                options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }]}
              />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-2">
                - La documentation clinique et para-clinique nécessaire est disponible en salle
              </p>
              <RadioGroup
                name="docs_disponibles"
                value={data.docsDisponibles}
                onChange={(v) => set(data, onChange, "docsDisponibles", v)}
                options={[{ label: "Oui", value: "oui" }, { label: "Non", value: "non" }]}
              />
            </div>
          </div>
        </QuestionCard>

        {/* Q3 – Installation */}
        <QuestionCard>
          <p className="text-sm font-bold text-primary mb-2">3- Le mode d'installation est :</p>
          <p className="text-xs text-on-surface-variant mb-3">
            Connu de l'équipe en salle. Caché/réel avec le site / intervention et non dangereuse pour le patient
          </p>
          <RadioGroup
            name="installation"
            value={data.installation}
            onChange={(v) => set(data, onChange, "installation", v)}
            options={[{ label: "Oui", value: "oui" }, { label: "N/A", value: "na" }]}
          />
        </QuestionCard>

        {/* Q4 – Matériel */}
        <QuestionCard>
          <p className="text-sm font-bold text-primary mb-3">
            4- Le matériel nécessaire pour l'intervention est vérifié :
          </p>
          <div className="space-y-3">
            <CheckboxPair
              label="- pour la partie chirurgicale..."
              pair={data.materielChir}
              onOui={(v) => setBoolPair(data, onChange, "materielChir", "oui", v)}
              onNon={(v) => setBoolPair(data, onChange, "materielChir", "non", v)}
            />
            <CheckboxPair
              label="- pour la partie anesthésique"
              pair={data.materielAnes}
              onOui={(v) => setBoolPair(data, onChange, "materielAnes", "oui", v)}
              onNon={(v) => setBoolPair(data, onChange, "materielAnes", "non", v)}
            />
          </div>
        </QuestionCard>

        {/* Q5 – Vérification croisée */}
        <QuestionCard borderColor="border-error/20">
          <p className="text-sm font-bold text-error mb-1">5- Vérification croisée par l'équipe :</p>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant/70 mb-3">
            Points critiques et mesures adéquates à prendre
          </p>
          <div className="space-y-4">
            <CheckboxPair
              label="- Allergie du patient"
              pair={data.allergie}
              onOui={(v) => setBoolPair(data, onChange, "allergie", "oui", v)}
              onNon={(v) => setBoolPair(data, onChange, "allergie", "non", v)}
              colorClass="accent-error"
            />
            <CheckboxPair
              label="- Risque d'inhalation, de difficulté d'intubation ou de ventilation au masque"
              pair={data.risqueIntubation}
              onOui={(v) => setBoolPair(data, onChange, "risqueIntubation", "oui", v)}
              onNon={(v) => setBoolPair(data, onChange, "risqueIntubation", "non", v)}
              colorClass="accent-error"
            />
            <CheckboxPair
              label="- Risque de saignement important"
              pair={data.risqueSaignement}
              onOui={(v) => setBoolPair(data, onChange, "risqueSaignement", "oui", v)}
              onNon={(v) => setBoolPair(data, onChange, "risqueSaignement", "non", v)}
              colorClass="accent-error"
            />
          </div>
        </QuestionCard>
      </div>
    </section>
  );
}

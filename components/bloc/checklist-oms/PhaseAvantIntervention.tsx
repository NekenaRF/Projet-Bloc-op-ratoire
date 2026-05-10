"use client";

import { ChecklistPhase2, RadioVal, BoolPair, InfoPartage } from "@/types/bloc";

interface Props {
  data: ChecklistPhase2;
  onChange: (data: ChecklistPhase2) => void;
}

function setBool<K extends keyof ChecklistPhase2>(
  data: ChecklistPhase2,
  onChange: (d: ChecklistPhase2) => void,
  key: K,
  side: "oui" | "non",
  val: boolean
) {
  onChange({ ...data, [key]: { ...(data[key] as BoolPair), [side]: val } });
}

function setInfoPartage<K extends keyof ChecklistPhase2>(
  data: ChecklistPhase2,
  onChange: (d: ChecklistPhase2) => void,
  key: K,
  field: keyof InfoPartage,
  val: RadioVal | string
) {
  onChange({ ...data, [key]: { ...(data[key] as InfoPartage), [field]: val } });
}

function CheckboxPair({
  label,
  pair,
  onOui,
  onNon,
}: {
  label: string;
  pair: BoolPair;
  onOui: (v: boolean) => void;
  onNon: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-on-surface-variant flex-1">{label}</span>
      <div className="flex space-x-4 shrink-0">
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input type="checkbox" checked={pair.oui} onChange={(e) => onOui(e.target.checked)} className="w-4 h-4 rounded cursor-pointer accent-secondary" />
          oui
        </label>
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input type="checkbox" checked={pair.non} onChange={(e) => onNon(e.target.checked)} className="w-4 h-4 rounded cursor-pointer accent-secondary" />
          non
        </label>
      </div>
    </div>
  );
}

function RadioPair({
  name,
  value,
  onChange,
  colorClass = "accent-secondary",
}: {
  name: string;
  value: RadioVal;
  onChange: (v: RadioVal) => void;
  colorClass?: string;
}) {
  return (
    <div className="flex space-x-3">
      {(["oui", "non"] as RadioVal[]).map((opt) => (
        <label key={opt} className="flex items-center gap-1 text-[10px] font-medium cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className={`w-3 h-3 cursor-pointer ${colorClass}`}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function QuestionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-lg p-4 border border-outline-variant/10">{children}</div>;
}

export default function PhaseAvantIntervention({ data, onChange }: Props) {
  return (
    <section className="bg-surface-container-low rounded-xl p-6 shadow-sm border-t-4 border-secondary">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary text-xl">pause_circle</span>
        </div>
        <h2 className="font-headline font-bold text-xl text-secondary uppercase tracking-wide">
          Avant Intervention Chirurgicale
        </h2>
      </div>
      <p className="text-xs italic text-on-surface-variant mb-6">
        Temps de pause avant incision
      </p>

      <div className="space-y-4">
        {/* Q6 – Vérification ultime */}
        <QuestionCard>
          <p className="text-sm font-bold text-secondary mb-3">
            6- Vérification « ultime » croisée au sein de l'équipe :
          </p>
          <div className="space-y-3">
            {(
              [
                { key: "v6_identite", label: "- Identité patient correct" },
                { key: "v6_intervention", label: "- Intervention prévue confirmée" },
                { key: "v6_site", label: "- Site opératoire" },
                { key: "v6_installation", label: "- Installation correct" },
                { key: "v6_documents", label: "- Documents nécessaires disponibles" },
              ] as { key: keyof ChecklistPhase2; label: string }[]
            ).map(({ key, label }) => (
              <CheckboxPair
                key={key}
                label={label}
                pair={data[key] as BoolPair}
                onOui={(v) => setBool(data, onChange, key, "oui", v)}
                onNon={(v) => setBool(data, onChange, key, "non", v)}
              />
            ))}
          </div>
        </QuestionCard>

        {/* Q7 – Partage des informations */}
        <QuestionCard>
          <p className="text-sm font-bold text-secondary mb-1">7- Partage des informations</p>
          <p className="text-[10px] text-on-surface-variant italic mb-3">
            Essentielles dans l'équipe sur des éléments à risque/points critiques de l'intervention
          </p>
          <div className="space-y-3">
            {/* 7a – Chirurgical */}
            <div className="p-3 bg-surface rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-primary">- Sur le plan chirurgical</p>
                <RadioPair
                  name="chirurgical"
                  value={data.chirurgical.radio}
                  onChange={(v) => setInfoPartage(data, onChange, "chirurgical", "radio", v)}
                  colorClass="accent-primary"
                />
              </div>
              <p className="text-[9px] text-on-surface-variant italic mb-1">
                (temps opération difficile, points spécifiques de l'intervention...)
              </p>
              <textarea
                value={data.chirurgical.notes}
                onChange={(e) => setInfoPartage(data, onChange, "chirurgical", "notes", e.target.value)}
                placeholder="Notes chirurgie..."
                className="w-full text-xs border border-outline-variant/20 bg-white rounded-md p-2 focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-outline h-16 resize-none"
              />
            </div>

            {/* 7b – Anesthésique */}
            <div className="p-3 bg-surface rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-secondary">- Sur le plan anesthésique</p>
                <RadioPair
                  name="anesth"
                  value={data.anesth.radio}
                  onChange={(v) => setInfoPartage(data, onChange, "anesth", "radio", v)}
                />
              </div>
              <p className="text-[9px] text-on-surface-variant italic mb-1">
                (risques potentiels liés au terrain ou à des traitements éventuellement maintenus)
              </p>
              <textarea
                value={data.anesth.notes}
                onChange={(e) => setInfoPartage(data, onChange, "anesth", "notes", e.target.value)}
                placeholder="Notes anesthésie..."
                className="w-full text-xs border border-outline-variant/20 bg-white rounded-md p-2 focus:ring-1 focus:ring-secondary focus:outline-none placeholder:text-outline h-16 resize-none"
              />
            </div>

            {/* 7c – IDE/IBODE */}
            <div className="p-3 bg-surface rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-on-surface-variant">- IDE / IBODE</p>
                <RadioPair
                  name="ide_ibode"
                  value={data.ideIbode.radio}
                  onChange={(v) => setInfoPartage(data, onChange, "ideIbode", "radio", v)}
                  colorClass="accent-outline"
                />
              </div>
              <p className="text-[9px] text-on-surface-variant italic mb-1">
                (stérilité confirmée, matériel disponible, préoccupations ?)
              </p>
              <textarea
                value={data.ideIbode.notes}
                onChange={(e) => setInfoPartage(data, onChange, "ideIbode", "notes", e.target.value)}
                placeholder="Notes IDE/IBODE..."
                className="w-full text-xs border border-outline-variant/20 bg-white rounded-md p-2 focus:ring-1 focus:outline-none placeholder:text-outline h-16 resize-none"
              />
            </div>
          </div>
        </QuestionCard>

        {/* Q8 – Antibioprophylaxie */}
        <QuestionCard>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-secondary">8- Antibioprophylaxie effectuée</p>
            <div className="flex space-x-4">
              {(["oui", "non"] as RadioVal[]).map((opt) => (
                <label key={opt} className="flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="antibio"
                    checked={data.antibio === opt}
                    onChange={() => onChange({ ...data, antibio: opt })}
                    className="w-4 h-4 cursor-pointer accent-secondary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </QuestionCard>
      </div>
    </section>
  );
}

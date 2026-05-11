export default function SalleDeReveilPage() {
  return (
    <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
      <section>
        <h3 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Sortie salle de réveil / Avis médical</h3>
        <div className="h-1.5 w-28 bg-primary" />
      </section>

      <div className="bg-white p-6 flex items-center justify-between shadow-sm border-l-[6px] border-primary">
        <div className="flex items-center gap-16">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Patient</p>
            <p className="font-bold text-xl text-on-surface">JEAN-PIERRE, Marc</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">ID Dossier</p>
            <p className="font-semibold text-lg text-on-surface">#PX-90442-24</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Chambre</p>
            <p className="font-semibold text-lg text-on-surface">Bloc B - 402</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-1.5 bg-[#006a6a] text-white text-xs font-bold flex items-center gap-2 uppercase tracking-wide rounded-sm">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            stable
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white p-8 shadow-sm">
            <h4 className="text-lg font-bold text-primary mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined">move_item</span>
              ORIENTATION DU PATIENT
            </h4>
            <div className="space-y-8">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-7 h-7 border-2 border-outline-variant rounded-sm flex items-center justify-center group-hover:border-primary transition-colors">
                  <input className="hidden" id="service_origine" type="checkbox" />
                  <div className="w-4 h-4 bg-primary scale-0 transition-transform" id="check-icon" />
                </div>
                <label className="text-on-surface font-bold text-xl cursor-pointer" htmlFor="service_origine">Service d'origine</label>
              </div>
              <div className="p-8 bg-[#e6f6ff]/50 rounded-sm">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4 block">Autres services de destination</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select className="w-full bg-white border-outline-variant py-4 px-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none rounded-sm">
                      <option>Sélectionner ou saisir un service...</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
                  </div>
                  <button className="bg-primary text-white px-8 py-4 font-bold flex items-center gap-3 hover:bg-primary/90 transition-all rounded-sm uppercase tracking-wide">
                    <span className="material-symbols-outlined">add</span>
                    AJOUTER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#dff4ff]/50 p-8 rounded-sm h-full border border-surface-variant/20">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-[0.2em] mb-6">CHECKLIST DE SORTIE</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#006a6a] text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Signes vitaux stables</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">(dernière prise: 14:00)</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-[#006a6a] text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                <p className="text-sm font-semibold text-on-surface">Douleur contrôlée (EVA &lt; 3)</p>
              </li>
              <li className="flex items-start gap-4 opacity-40">
                <span className="material-symbols-outlined text-outline text-xl">radio_button_unchecked</span>
                <p className="text-sm font-semibold text-on-surface"><br /></p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 pb-2 flex justify-end">
        <button className="relative overflow-hidden group px-10 py-5 text-lg font-bold tracking-tight shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-4 rounded-sm uppercase text-white">
          <img
            alt=""
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:brightness-[0.5] transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZGWj7sXGUXQZQ5cknUlwNklHtX367wnHDY9UQA4zHmiKthYljtVNoRfs7eYLa1BA8sE3snFwlP-oh6HsNJAgXxJ58CKSLJFcP4_Zz0tuTmyhs9cZes1azzgZXKGGE93KR8ZB0xqALGM9ypTqj2DVMAjQV2PHaPlHJ_1Oc1lp21Jo91gVEsgeCVTDVECIyS9iwJOkvSkgmvm5SP9sQIayhleADDWVS-2eTU0v7SdoIMo-9vNJyhyvVpOvo4HjRFZX5SDYacNlJR2Q"
          />
          <span className="relative z-10">Valider la sortie</span>
          <span className="material-symbols-outlined text-2xl relative z-10">logout</span>
        </button>
      </div>
    </main>
  );
}

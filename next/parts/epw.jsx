<div  className="epw" id="epw" hidden role="dialog" aria-modal="true" aria-labelledby="epmT">
  <div  className="epm">
    <button  className="epm-x" type="button" id="epX" aria-label="Fermer">
      <svg  width="16" height="16" viewBox="0 0 16 16" fill="none"><path  d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" /></svg>
    </button>
    <div  className="epm-l">
      <div>
        <div  className="epm-ico" id="epmIco" aria-hidden="true"></div>
        <div  className="epm-n" id="epmN"></div>
        <h3  className="epm-t" id="epmT"></h3>
        <div  className="epm-sub" id="epmS"></div>
      </div>
      <ul  className="epm-tech" id="epmTech"></ul>
    </div>
    <div  className="epm-r">
      <div>
        <h4>Records du monde</h4>
        <div  className="recs" id="epmWR"></div>
      </div>
      <div>
        <h4>Records du Sénégal</h4>
        <div  className="recs" id="epmSEN"></div>
      </div>
      <a  href="#agenda" className="btn btn-ink" id="epmCta" style={{"alignSelf":"flex-start"}}>Voir le calendrier</a>
    </div>
    <div  className="epm-nav">
      <button  type="button" id="epPrev">‹ Épreuve précédente</button>
      <span  className="epm-hint">← → pour naviguer · Échap pour fermer</span>
      <button  type="button" id="epNext">Épreuve suivante ›</button>
    </div>
  </div>
</div>

{/* ═══ FEEDBACK ════════════════════════════════════════════════════ */}
<button  className="fb-btn" type="button" id="fbBtn" aria-expanded="false" aria-controls="fbPanel">
  <svg  width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path  d="M14 10.5a1.5 1.5 0 0 1-1.5 1.5H5l-3 3V3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
  Feedback <span  className="fb-count" id="fbCount">0</span>
</button>
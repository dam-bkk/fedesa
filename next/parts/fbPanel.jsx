<div  className="fb-panel" id="fbPanel" hidden>
  <h4  style={{"fontSize":"17px"}}>Laisser un retour</h4>
  <label  htmlFor="fb-type">Type</label>
  <select  id="fb-type"><option>Change request</option><option>Bug</option><option>Question</option><option>Works for me</option></select>
  <label  htmlFor="fb-sec">Section</label>
  <select  id="fb-sec"><option>Hero</option><option>Actualités</option><option>Résultats</option><option>Calendrier</option>
    <option>Galerie</option><option>Athlète du mois</option><option>Clubs / régions</option><option>Records</option>
    <option>Licences</option><option>La Fédé</option><option>Partenaires</option><option>FAQ</option><option>Footer</option></select>
  <label  htmlFor="fb-msg">Note</label>
  <textarea  id="fb-msg" placeholder="Ce qui marche, ce qui ne marche pas…"></textarea>
  <div  className="fb-row">
    <button  className="btn btn-ink btn-sm" type="button" id="fbSave">Enregistrer</button>
    <button  className="btn btn-oink btn-sm" type="button" id="fbExport">Export JSON</button>
    <button  className="btn btn-oink btn-sm" type="button" id="fbClear">Vider</button>
  </div>
  <div  className="fb-list" id="fbList"></div>
</div>
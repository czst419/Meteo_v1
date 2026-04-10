import React from 'react';

const FavoritesList = ({ luoghiPreferiti, onSeleziona, onRimuovi, onEsporta, onImporta }) => {
  return (
    <section className="favorites-list">
      <div className="favorites-header">
        <h3>⭐ Luoghi Preferiti</h3>
        <div className="favorites-actions">
          <input 
            type="file" 
            accept=".json" 
            onChange={onImporta} 
            id="import-file"
            style={{display: 'none'}}
          />
          <label htmlFor="import-file" className="btn-import">📥 Importa</label>
          <button onClick={onEsporta} className="btn-export">📤 Esporta</button>
        </div>
      </div>
      
      {luoghiPreferiti.length === 0 ? (
        <p className="no-favorites">Nessun preferito salvato. Aggiungi un luogo dalla ricerca!</p>
      ) : (
        <ul>
          {luoghiPreferiti.map((luogo, index) => (
            <li key={index}>
              <span className="favorite-name">{luogo.nome}</span>
              <div className="favorite-buttons">
                <button onClick={() => onSeleziona(luogo.lat, luogo.lon, true, luogo.nome)} className="btn-select">
                  ✅ Seleziona
                </button>
                <button onClick={() => onRimuovi(index)} className="btn-remove">
                  ❌ Rimuovi
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FavoritesList;

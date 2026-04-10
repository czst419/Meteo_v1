import React from 'react';

const MultiCityCompare = ({ citta, onRimuovi, unitaTemp }) => {
  const convertiTemp = (celsius) => {
    return unitaTemp === 'F' ? Math.round((celsius * 9/5) + 32) : Math.round(celsius);
  };

  if (citta.length === 0) {
    return (
      <section className="multi-city-compare">
        <h3>🌍 Confronto Multi-Città</h3>
        <p className="no-cities">Aggiungi città dalla ricerca per confrontare</p>
      </section>
    );
  }

  return (
    <section className="multi-city-compare">
      <h3>🌍 Confronto Multi-Città</h3>
      <div className="cities-grid">
        {citta.map((città, index) => (
          <div key={index} className="city-compare-card">
            <button className="remove-city" onClick={() => onRimuovi(index)}>✕</button>
            <h4>{città.nome}</h4>
            <div className="city-icon">{città.icona}</div>
            <div className="city-temp">{convertiTemp(città.temp)}°{unitaTemp}</div>
            <div className="city-minmax">
              <span className="temp-min">{convertiTemp(città.tempMin)}°</span>
              <span className="divider">/</span>
              <span className="temp-max">{convertiTemp(città.tempMax)}°</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MultiCityCompare;

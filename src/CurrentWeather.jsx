import React from 'react';

const CurrentWeather = ({ meteo, posizioneCorrente, unitaTemp, unitaVento }) => {
  if (!meteo) {
    return (
      <section className="current-weather">
        <p>⏳ Caricamento meteo attuale...</p>
      </section>
    );
  }

  const convertiTemp = (celsius) => {
    return unitaTemp === 'F' ? Math.round((celsius * 9/5) + 32) : Math.round(celsius);
  };

  const convertiVento = (kmh) => {
    if (unitaVento === 'mph') return Math.round(kmh * 0.621371);
    if (unitaVento === 'ms') return Math.round(kmh / 3.6);
    return Math.round(kmh);
  };

  const getUnitaVentoLabel = () => {
    if (unitaVento === 'mph') return 'mph';
    if (unitaVento === 'ms') return 'm/s';
    return 'km/h';
  };
  
  return (
    <section className="current-weather">
      <h2>📍 {posizioneCorrente.nome}</h2>
      <div className="icona-grande">{meteo.icona}</div>
      <div className="temp-principale">{convertiTemp(meteo.temperatura)}°{unitaTemp}</div>
      <div className="condizioni-principali">{meteo.condizioni}</div>
      <div className="dettagli-grid">
        <div className="dettaglio-item">
          <span className="label">Sensazione</span>
          <span className="valore">{convertiTemp(meteo.sensazione)}°{unitaTemp}</span>
        </div>
        <div className="dettaglio-item">
          <span className="label">Umidità</span>
          <span className="valore">{meteo.umidità}%</span>
        </div>
        <div className="dettaglio-item">
          <span className="label">Vento</span>
          <span className="valore">{convertiVento(meteo.vento)} {getUnitaVentoLabel()}</span>
        </div>
        {meteo.alba && (
          <div className="dettaglio-item">
            <span className="label">Alba</span>
            <span className="valore">{new Date(meteo.alba).toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'})}</span>
          </div>
        )}
        {meteo.tramonto && (
          <div className="dettaglio-item">
            <span className="label">Tramonto</span>
            <span className="valore">{new Date(meteo.tramonto).toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'})}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrentWeather;

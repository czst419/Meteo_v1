import React from 'react';

const WeatherStats = ({ meteoGiornaliero }) => {
  if (!meteoGiornaliero || meteoGiornaliero.length === 0) return null;

  const tempMedia = (meteoGiornaliero.reduce((acc, g) => acc + (g.tempMax + g.tempMin) / 2, 0) / meteoGiornaliero.length).toFixed(1);
  const giorniPiovosi = meteoGiornaliero.filter(g => g.precipitazioni > 0).length;
  const tempMaxSettimana = Math.max(...meteoGiornaliero.map(g => g.tempMax));
  const tempMinSettimana = Math.min(...meteoGiornaliero.map(g => g.tempMin));
  const totPrecipitazioni = meteoGiornaliero.reduce((acc, g) => acc + g.precipitazioni, 0).toFixed(1);

  return (
    <section className="weather-stats">
      <h3>📊 Statistiche Settimanali</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌡️</div>
          <div className="stat-label">Temp Media</div>
          <div className="stat-value">{tempMedia}°C</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔼</div>
          <div className="stat-label">Max Settimana</div>
          <div className="stat-value">{Math.round(tempMaxSettimana)}°C</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔽</div>
          <div className="stat-label">Min Settimana</div>
          <div className="stat-value">{Math.round(tempMinSettimana)}°C</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌧️</div>
          <div className="stat-label">Giorni Piovosi</div>
          <div className="stat-value">{giorniPiovosi}/7</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-label">Tot. Pioggia</div>
          <div className="stat-value">{totPrecipitazioni} mm</div>
        </div>
      </div>
    </section>
  );
};

export default WeatherStats;

import React from 'react';

const HourlyForecast = ({ meteoOrario }) => {
  if (!meteoOrario || meteoOrario.length === 0) {
    return (
      <section className="hourly-forecast">
        <h3>⏰ Prossime 24 ore</h3>
        <p>Nessun dato disponibile</p>
      </section>
    );
  }

  return (
    <section className="hourly-forecast">
      <h3>⏰ Prossime 24 ore</h3>
      <div className="lista-oraria-scroll">
        {meteoOrario.map((ora, i) => (
          <div key={i} className="ora-item-improved">
            <div className="ora-time">{ora.orario}:00</div>
            <div className="ora-icon-large">{ora.icona}</div>
            <div className="ora-temp-large">{Math.round(ora.temperatura)}°</div>
            <div className="ora-details">
              <span className="detail-badge umidita">
                <span className="icon">💧</span>
                <span>{ora.umidità}%</span>
              </span>
              <span className="detail-badge pioggia">
                <span className="icon">🌧️</span>
                <span>{ora.probPioggia}%</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourlyForecast;

import React from 'react';

const DailyForecast = ({ meteoGiornaliero }) => {
  if (!meteoGiornaliero || meteoGiornaliero.length === 0) {
    return (
      <section className="daily-forecast">
        <h3>📅 Prossimi 7 giorni</h3>
        <p>Nessun dato disponibile</p>
      </section>
    );
  }

  return (
    <section className="daily-forecast">
      <h3>📅 Prossimi 7 giorni</h3>
      <div className="tabella-giornaliera">
        {meteoGiornaliero.map((giorno, i) => (
          <div key={i} className="giorno-card">
            <div className="giorno-data">{giorno.data}</div>
            <div className="giorno-icon">{giorno.icona}</div>
            <div className="giorno-temp">
              <span className="temp-min">{Math.round(giorno.tempMin)}°</span>
              <span className="temp-divider">/</span>
              <span className="temp-max">{Math.round(giorno.tempMax)}°</span>
            </div>
            <div className="giorno-cond">{giorno.condizioni}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyForecast;

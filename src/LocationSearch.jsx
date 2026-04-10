import React, { useState, useEffect } from 'react';

const LocationSearch = ({ onCercaPosizione, onAggiungiPreferito, posizioneCorrente, inCaricamento, getPosizioneGPS, onAggiungiConfronto }) => {
  const [nome, setNome] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [mostraSuggerimenti, setMostraSuggerimenti] = useState(false);
  const [caricamentoSuggerimenti, setCaricamentoSuggerimenti] = useState(false);

  useEffect(() => {
    if (nome.length < 2) {
      setSuggerimenti([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCaricamentoSuggerimenti(true);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=5&language=it&format=json`;
        const response = await fetch(url);
        const dati = await response.json();
        
        if (dati.results) {
          setSuggerimenti(dati.results);
          setMostraSuggerimenti(true);
        } else {
          setSuggerimenti([]);
        }
      } catch (error) {
        console.error('Errore geocoding:', error);
        setSuggerimenti([]);
      } finally {
        setCaricamentoSuggerimenti(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nome]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const latNum = parseFloat(lat) || posizioneCorrente.lat;
    const lonNum = parseFloat(lon) || posizioneCorrente.lon;
    onCercaPosizione(latNum, lonNum, true, nome || null);
    if (nome) onAggiungiPreferito({ nome, lat: latNum, lon: lonNum });
    setNome('');
    setLat('');
    setLon('');
    setSuggerimenti([]);
    setMostraSuggerimenti(false);
  };

  const selezionaCitta = (citta) => {
    const nomeCompleto = `${citta.name}${citta.admin1 ? ', ' + citta.admin1 : ''}${citta.country ? ' (' + citta.country + ')' : ''}`;
    setNome('');
    setLat('');
    setLon('');
    setSuggerimenti([]);
    setMostraSuggerimenti(false);
    onCercaPosizione(citta.latitude, citta.longitude, true, nomeCompleto);
    onAggiungiPreferito({ nome: nomeCompleto, lat: citta.latitude, lon: citta.longitude });
  };

  const aggiungiAlConfronto = (citta) => {
    const nomeCompleto = `${citta.name}${citta.admin1 ? ', ' + citta.admin1 : ''}`;
    onAggiungiConfronto(citta.latitude, citta.longitude, nomeCompleto);
    setSuggerimenti([]);
    setMostraSuggerimenti(false);
    setNome('');
  };

  const pulsantiRapidi = [
    { nome: 'Brescia', lat: 45.54, lon: 10.22 },
    { nome: 'Milano', lat: 45.46, lon: 9.19 },
    { nome: 'Roma', lat: 41.90, lon: 12.50 },
    { nome: 'Napoli', lat: 40.85, lon: 14.27 },
    { nome: 'Torino', lat: 45.07, lon: 7.69 }
  ];

  return (
    <section className="location-search">
      <form onSubmit={handleSubmit}>
        <div className="input-autocomplete">
          <input 
            type="text" 
            placeholder="🔍 Cerca città (es. Milano, Roma...)" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)}
            onFocus={() => suggerimenti.length > 0 && setMostraSuggerimenti(true)}
          />
          {caricamentoSuggerimenti && <span className="loader">⏳</span>}
          
          {mostraSuggerimenti && suggerimenti.length > 0 && (
            <div className="suggerimenti-dropdown">
              {suggerimenti.map((citta, i) => (
                <div key={i} className="suggerimento-item-wrapper">
                  <div className="suggerimento-item" onClick={() => selezionaCitta(citta)}>
                    <strong>{citta.name}</strong>
                    {citta.admin1 && <span>, {citta.admin1}</span>}
                    {citta.country && <span> ({citta.country})</span>}
                    <small> - {citta.latitude.toFixed(2)}, {citta.longitude.toFixed(2)}</small>
                  </div>
                  <button 
                    type="button"
                    className="btn-confronta"
                    onClick={() => aggiungiAlConfronto(citta)}
                  >
                    + Confronta
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <input 
          type="number" 
          step="any" 
          placeholder="Latitudine" 
          value={lat} 
          onChange={(e) => setLat(e.target.value)} 
        />
        <input 
          type="number" 
          step="any" 
          placeholder="Longitudine" 
          value={lon} 
          onChange={(e) => setLon(e.target.value)} 
        />
        <button type="submit" disabled={inCaricamento}>
          {inCaricamento ? '⏳ Caricamento...' : '🔍 Cerca'}
        </button>
        <button type="button" onClick={getPosizioneGPS} disabled={inCaricamento} className="btn-gps">
          📍 GPS
        </button>
      </form>
      
      <div className="pulsanti-rapidi">
        <strong>Città rapide:</strong>
        {pulsantiRapidi.map((p, i) => (
          <button key={i} onClick={() => {
            onCercaPosizione(p.lat, p.lon, true, p.nome);
            onAggiungiPreferito(p);
          }}>
            {p.nome}
          </button>
        ))}
      </div>
    </section>
  );
};

export default LocationSearch;

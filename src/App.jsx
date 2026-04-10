import React, { useState, useEffect } from 'react';
import LocationSearch from './LocationSearch';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import FavoritesList from './FavoritesList';
import WeatherChart from './WeatherChart';
import WeatherMap from './WeatherMap';
import MultiCityCompare from './MultiCityCompare';
import WeatherStats from './WeatherStats';
import Settings from './Settings';
import pb from './pbClient';
import './App.css';

const N8N_BASE_URL = 'http://localhost:5678'; // Cambia se il tuo n8n gira altrove

function App() {
  const [meteoAttuale, setMeteoAttuale] = useState(null);
  const [meteoOrario, setMeteoOrario] = useState([]);
  const [meteoGiornaliero, setMeteoGiornaliero] = useState([]);
  const [posizioneCorrente, setPosizioneCorrente] = useState({
    nome: 'Brescia',
    lat: 45.54,
    lon: 10.22,
  });

  const [luoghiPreferiti, setLuoghiPreferiti] = useState([]);
  const [inCaricamento, setInCaricamento] = useState(false);
  const [errore, setErrore] = useState(null);
  const [temaNotte, setTemaNotte] = useState(false);
  const [ultimoAggiornamento, setUltimoAggiornamento] = useState(null);
  const [mostraMappa, setMostraMappa] = useState(false);
  const [mostraConfronti, setMostraConfronti] = useState(false);
  const [mostraImpostazioni, setMostraImpostazioni] = useState(false);
  const [cittaConfronto, setCittaConfronto] = useState([]);

  const [impostazioni, setImpostazioni] = useState({
    unitaTemp: 'C',
    unitaVento: 'kmh',
    lingua: 'it',
    autoAggiornamento: true,
    suoniAttivi: false,
    emailTime: '09:00', // nuova impostazione: ora invio giornaliero
    userEmail: '',      // nuova impostazione: email destinatario
  });

  const [storicoMeteo, setStoricoMeteo] = useState([]);

  // Tema notte/giorno iniziale
  useEffect(() => {
    const ora = new Date().getHours();
    setTemaNotte(ora < 7 || ora > 20);
  }, []);

  // Richiesta permesso notifiche
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Carica impostazioni da localStorage
  useEffect(() => {
    const impostazioniSalvate = localStorage.getItem('weather_settings');
    if (impostazioniSalvate) {
      try {
        const parsed = JSON.parse(impostazioniSalvate);
        // Merge con default per i nuovi campi
        setImpostazioni({
          unitaTemp: 'C',
          unitaVento: 'kmh',
          lingua: 'it',
          autoAggiornamento: true,
          suoniAttivi: false,
          emailTime: '09:00',
          userEmail: '',
          ...parsed,
        });
      } catch (e) {
        console.error('Errore caricamento impostazioni:', e);
      }
    }
  }, []);

  // Auto aggiornamento meteo ogni 5 minuti se attivo
  useEffect(() => {
    if (!impostazioni.autoAggiornamento) return;

    const interval = setInterval(() => {
      if (posizioneCorrente.lat) {
        caricaMeteo(
          posizioneCorrente.lat,
          posizioneCorrente.lon,
          false,
          posizioneCorrente.nome
        );
      }
    }, 300000); // 5 minuti

    return () => clearInterval(interval);
  }, [posizioneCorrente, impostazioni.autoAggiornamento]);

  const updateNomeCitta = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=it`;
      const response = await fetch(url);
      const dati = await response.json();

      if (dati.address) {
        const nome =
          dati.address.city ||
          dati.address.town ||
          dati.address.village ||
          dati.address.municipality ||
          'Posizione sconosciuta';
        const regione = dati.address.state || '';
        const nomeCompleto = regione ? `${nome}, ${regione}` : nome;
        setPosizioneCorrente({ lat, lon, nome: nomeCompleto });
      } else {
        setPosizioneCorrente({
          lat,
          lon,
          nome: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
        });
      }
    } catch (error) {
      console.error('Errore reverse geocoding:', error);
      setPosizioneCorrente({
        lat,
        lon,
        nome: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      });
    }
  };

  const getIconaMeteo = (code) => {
    const icone = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      53: '🌦️',
      55: '🌧️',
      61: '🌧️',
      63: '🌧️',
      65: '⛈️',
      71: '🌨️',
      73: '❄️',
      75: '❄️',
      80: '🌦️',
      81: '🌧️',
      82: '⛈️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️',
    };
    return icone[code] || '🌤️';
  };

  const getCondizioniTesto = (code) => {
    const mapCodici = {
      0: 'Cielo sereno',
      1: 'Quasi sereno',
      2: 'Velato',
      3: 'Coperto',
      45: 'Nebbia',
      48: 'Brina',
      51: 'Pioviggine leggera',
      53: 'Pioviggine',
      55: 'Pioviggine forte',
      61: 'Pioggia leggera',
      63: 'Pioggia',
      65: 'Pioggia forte',
      71: 'Neve leggera',
      73: 'Neve',
      75: 'Neve forte',
      80: 'Rovesci leggeri',
      81: 'Rovesci',
      82: 'Rovesci forti',
      95: 'Temporale',
      96: 'Temporale con grandine',
      99: 'Temporale violento',
    };
    return mapCodici[code] || 'Sconosciuto';
  };

  const convertiTemperatura = (celsius) => {
    return impostazioni.unitaTemp === 'F'
      ? (celsius * 9) / 5 + 32
      : celsius;
  };

  const caricaMeteo = async (
    lat,
    lon,
    mostraNotifica = true,
    nomeCitta = null
  ) => {
    setInCaricamento(true);
    setErrore(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,apparent_temperature,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset&timezone=auto&current_weather=true`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Errore nella richiesta API');
      const dati = await response.json();
      if (!dati.hourly || !dati.daily)
        throw new Error('Dati meteo non disponibili');

      const nuovoMeteoAttuale = {
        temperatura: dati.hourly.temperature_2m?.[0] || 0,
        sensazione: dati.hourly.apparent_temperature?.[0] || 0,
        umidità: dati.hourly.relativehumidity_2m?.[0] || 0,
        vento: dati.hourly.windspeed_10m?.[0] || 0,
        weathercode: dati.hourly.weathercode?.[0] || 0,
        condizioni: getCondizioniTesto(dati.hourly.weathercode?.[0] || 0),
        icona: getIconaMeteo(dati.hourly.weathercode?.[0] || 0),
        alba: dati.daily.sunrise?.[0] || null,
        tramonto: dati.daily.sunset?.[0] || null,
      };

      setMeteoAttuale(nuovoMeteoAttuale);

      const meteoOrarioMap = dati.hourly.time.slice(0, 24).map((time, i) => ({
        orario: new Date(time).getHours(),
        temperatura: dati.hourly.temperature_2m[i] || 0,
        umidità: dati.hourly.relativehumidity_2m[i] || 0,
        probPioggia: dati.hourly.precipitation_probability[i] || 0,
        weathercode: dati.hourly.weathercode[i] || 0,
        icona: getIconaMeteo(dati.hourly.weathercode[i] || 0),
      }));
      setMeteoOrario(meteoOrarioMap);

      const meteoGiornoMap = dati.daily.time.slice(0, 7).map((data, i) => ({
        data: new Date(data).toLocaleDateString('it-IT', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        tempMin: dati.daily.temperature_2m_min[i] || 0,
        tempMax: dati.daily.temperature_2m_max[i] || 0,
        precipitazioni: dati.daily.precipitation_sum[i] || 0,
        weathercode: dati.daily.weathercode[i] || 0,
        condizioni: getCondizioniTesto(dati.daily.weathercode[i] || 0),
        icona: getIconaMeteo(dati.daily.weathercode[i] || 0),
      }));
      setMeteoGiornaliero(meteoGiornoMap);

      if (nomeCitta) {
        setPosizioneCorrente({ lat, lon, nome: nomeCitta });
      } else {
        await updateNomeCitta(lat, lon);
      }

      const now = new Date();
      setUltimoAggiornamento(now);

      aggiungiStorico({
        lat,
        lon,
        meteo: nuovoMeteoAttuale,
        timestamp: now,
      });

      if (impostazioni.suoniAttivi) {
        riproduciSuonoMeteo(nuovoMeteoAttuale.weathercode);
      }

      if (mostraNotifica && 'Notification' in window && Notification.permission === 'granted') {
        if (
          nuovoMeteoAttuale.temperatura < 0 ||
          nuovoMeteoAttuale.temperatura > 35
        ) {
          new Notification('🌤️ Allerta Meteo!', {
            body: `Temp: ${Math.round(
              convertiTemperatura(nuovoMeteoAttuale.temperatura)
            )}${impostazioni.unitaTemp === 'F' ? '°F' : '°C'} - ${
              nuovoMeteoAttuale.condizioni
            }`,
            icon: nuovoMeteoAttuale.icona,
          });
        }
      }
    } catch (err) {
      setErrore(`Errore: ${err.message}`);
      console.error('Errore API:', err);
    } finally {
      setInCaricamento(false);
    }
  };

  const aggiungiStorico = (entry) => {
    const nuovoStorico = [...storicoMeteo, entry].slice(-30);
    setStoricoMeteo(nuovoStorico);
    localStorage.setItem('weather_history', JSON.stringify(nuovoStorico));
  };

  const riproduciSuonoMeteo = (weathercode) => {
    if ([61, 63, 65, 80, 81, 82].includes(weathercode)) {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 200;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 500);
      } catch (e) {
        console.error('Errore audio:', e);
      }
    }
  };

  const aggiungiPreferito = async (luogo) => {
    if (luoghiPreferiti.find((p) => p.lat === luogo.lat && p.lon === luogo.lon))
      return;

    try {
      const record = await pb.collection('favorites').create({
        name: luogo.nome,
        lat: luogo.lat,
        lon: luogo.lon,
      });

      const nuovoPreferito = {
        id: record.id,
        nome: record.name,
        lat: record.lat,
        lon: record.lon,
      };

      const nuovi = [...luoghiPreferiti, nuovoPreferito];
      setLuoghiPreferiti(nuovi);
      localStorage.setItem('weather_favorites', JSON.stringify(nuovi));
    } catch (err) {
      console.error('Errore salvataggio preferito PB:', err);
      alert('Errore nel salvataggio del preferito su PocketBase');
    }
  };

  const rimuoviPreferito = async (index) => {
    const preferito = luoghiPreferiti[index];
    if (!preferito) return;

    try {
      if (preferito.id) {
        await pb.collection('favorites').delete(preferito.id);
      }

      const nuovi = luoghiPreferiti.filter((_, i) => i !== index);
      setLuoghiPreferiti(nuovi);
      localStorage.setItem('weather_favorites', JSON.stringify(nuovi));
    } catch (err) {
      console.error('Errore rimozione preferito PB:', err);
      alert('Errore nella rimozione del preferito da PocketBase');
    }
  };

  const esportaPreferiti = () => {
    const dataStr = JSON.stringify(luoghiPreferiti, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute(
      'download',
      `preferiti-meteo-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importaPreferiti = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const nuovi = JSON.parse(e.target.result);
        if (!Array.isArray(nuovi)) throw new Error('Formato non valido');

        for (const fav of nuovi) {
          await pb.collection('favorites').create({
            name: fav.nome,
            lat: fav.lat,
            lon: fav.lon,
          });
        }

        setLuoghiPreferiti(nuovi);
        localStorage.setItem('weather_favorites', JSON.stringify(nuovi));
        alert('Preferiti importati e sincronizzati con PocketBase!');
      } catch (err) {
        console.error(err);
        alert('File JSON non valido');
      }
    };
    reader.readAsText(file);
  };

  const getPosizioneGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          caricaMeteo(lat, lon, true, null);
        },
        (err) => setErrore('❌ GPS negato: ' + err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setErrore('❌ Geolocalizzazione non supportata dal browser');
    }
  };

  const toggleTema = () => setTemaNotte(!temaNotte);

  const aggiungiCittaConfronto = async (lat, lon, nome) => {
    if (cittaConfronto.length >= 4) {
      alert('Massimo 4 città per confronto');
      return;
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const response = await fetch(url);
      const dati = await response.json();

      setCittaConfronto([
        ...cittaConfronto,
        {
          nome,
          lat,
          lon,
          temp: dati.current_weather.temperature,
          weathercode: dati.current_weather.weathercode,
          icona: getIconaMeteo(dati.current_weather.weathercode),
          tempMax: dati.daily.temperature_2m_max[0],
          tempMin: dati.daily.temperature_2m_min[0],
        },
      ]);
    } catch (err) {
      console.error('Errore caricamento città:', err);
    }
  };

  const rimuoviCittaConfronto = (index) => {
    setCittaConfronto(cittaConfronto.filter((_, i) => i !== index));
  };

  // Salva impostazioni + invia anche a n8n per l'ora/email giornaliera
  const salvaImpostazioni = async (nuoveImpostazioni) => {
    setImpostazioni(nuoveImpostazioni);
    localStorage.setItem('weather_settings', JSON.stringify(nuoveImpostazioni));

    try {
      await fetch(`${N8N_BASE_URL}/webhook/meteo-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: nuoveImpostazioni.userEmail,
          emailTime: nuoveImpostazioni.emailTime,
          lat: posizioneCorrente.lat,
          lon: posizioneCorrente.lon,
          nome: posizioneCorrente.nome,
        }),
      });
    } catch (e) {
      console.error('Errore invio impostazioni a n8n:', e);
    }
  };

  // Invio manuale report email (bottone)
  const inviaReportEmail = async () => {
    if (!impostazioni.userEmail) {
      alert('Imposta prima la tua email nelle Impostazioni.');
      return;
    }

    try {
      const res = await fetch(`${N8N_BASE_URL}/webhook/meteo-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: impostazioni.userEmail,
          lat: posizioneCorrente.lat,
          lon: posizioneCorrente.lon,
          nome: posizioneCorrente.nome,
        }),
      });

      if (res.ok) {
        alert('Report meteo inviato alla tua email!');
      } else {
        alert('Errore durante l’invio del report.');
      }
    } catch (e) {
      console.error('Errore rete invio report:', e);
      alert('Errore di rete durante l’invio del report.');
    }
  };

  // Caricamento iniziale + realtime PocketBase
  useEffect(() => {
    const caricaIniziale = async () => {
      try {
        const records = await pb.collection('favorites').getFullList({
          sort: '-created',
        });
        const preferitiDaBackend = records.map((r) => ({
          id: r.id,
          nome: r.name,
          lat: r.lat,
          lon: r.lon,
        }));
        setLuoghiPreferiti(preferitiDaBackend);
        localStorage.setItem(
          'weather_favorites',
          JSON.stringify(preferitiDaBackend)
        );
      } catch (err) {
        console.error('Errore caricamento preferiti PB:', err);
        const preferiti = localStorage.getItem('weather_favorites');
        if (preferiti) setLuoghiPreferiti(JSON.parse(preferiti));
      }

      const storico = localStorage.getItem('weather_history');
      if (storico) {
        try {
          setStoricoMeteo(JSON.parse(storico));
        } catch (e) {
          console.error('Errore caricamento storico:', e);
        }
      }

      await caricaMeteo(45.54, 10.22, true, 'Brescia');
    };

    caricaIniziale();

    const unsub = pb.collection('favorites').subscribe('*', async () => {
      try {
        const records = await pb.collection('favorites').getFullList({
          sort: '-created',
        });
        const preferiti = records.map((r) => ({
          id: r.id,
          nome: r.name,
          lat: r.lat,
          lon: r.lon,
        }));
        setLuoghiPreferiti(preferiti);
        localStorage.setItem(
          'weather_favorites',
          JSON.stringify(preferiti)
        );
      } catch (err) {
        console.error('Errore realtime PB:', err);
      }
    });

    return () => {
      pb.collection('favorites').unsubscribe('*');
    };
  }, []);

  return (
    <div className={`App ${temaNotte ? 'tema-notte' : 'tema-giorno'}`}>
      <header className="app-header">
        <h1>Dashboard Meteo Avanzata</h1>
        <div className="header-controls">
          <button className="toggle-tema" onClick={toggleTema}>
            {temaNotte ? 'Giorno' : 'Notte'}
          </button>
          <button
            className="btn-mappa"
            onClick={() => setMostraMappa(!mostraMappa)}
          >
            {mostraMappa ? 'Nascondi Mappa' : 'Mostra Mappa'}
          </button>
          <button
            className="btn-confronto"
            onClick={() => setMostraConfronti(!mostraConfronti)}
          >
            {mostraConfronti ? 'Nascondi Confronta' : 'Confronta Città'}
          </button>
          <button
            className="btn-settings"
            onClick={() => setMostraImpostazioni(true)}
          >
            Impostazioni
          </button>
          <button className="btn-report" onClick={inviaReportEmail}>
            Invia Report Email
          </button>
        </div>
        {ultimoAggiornamento && (
          <p className="ultimo-aggiornamento">
            Ultimo aggiornamento:{' '}
            {ultimoAggiornamento.toLocaleTimeString('it-IT')}
          </p>
        )}
      </header>

      {errore && <div className="errore">{errore}</div>}

      {mostraImpostazioni && (
        <Settings
          impostazioni={impostazioni}
          onSalva={salvaImpostazioni}
          onChiudi={() => setMostraImpostazioni(false)}
        />
      )}

      <main className="main-layout">
        <section className="colonna-sinistra">
          <LocationSearch
            onCercaPosizione={caricaMeteo}
            onAggiungiPreferito={aggiungiPreferito}
            posizioneCorrente={posizioneCorrente}
            inCaricamento={inCaricamento}
            getPosizioneGPS={getPosizioneGPS}
            onAggiungiConfronto={aggiungiCittaConfronto}
          />

          {mostraMappa && posizioneCorrente.lat && (
            <WeatherMap
              lat={posizioneCorrente.lat}
              lon={posizioneCorrente.lon}
              onClickMappa={(lat, lon) => caricaMeteo(lat, lon, true, null)}
            />
          )}

          {mostraConfronti && (
            <MultiCityCompare
              citta={cittaConfronto}
              onRimuovi={rimuoviCittaConfronto}
              unitaTemp={impostazioni.unitaTemp}
            />
          )}

          <CurrentWeather
            meteo={meteoAttuale}
            posizioneCorrente={posizioneCorrente}
            unitaTemp={impostazioni.unitaTemp}
            unitaVento={impostazioni.unitaVento}
          />

          <WeatherStats meteoGiornaliero={meteoGiornaliero} />
        </section>

        <section className="colonna-destra">
          <WeatherChart
            meteoOrario={meteoOrario}
            temaNotte={temaNotte}
            unitaTemp={impostazioni.unitaTemp}
          />

          <div className="forecast-container">
            <HourlyForecast
              meteoOrario={meteoOrario}
              unitaTemp={impostazioni.unitaTemp}
            />
            <DailyForecast
              meteoGiornaliero={meteoGiornaliero}
              unitaTemp={impostazioni.unitaTemp}
            />
          </div>
        </section>
      </main>

      <FavoritesList
        luoghiPreferiti={luoghiPreferiti}
        onSeleziona={caricaMeteo}
        onRimuovi={rimuoviPreferito}
        onEsporta={esportaPreferiti}
        onImporta={importaPreferiti}
      />
    </div>
  );
}

export default App;

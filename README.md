# 🌍 GeoCompare Weather Dashboard

Una dashboard meteo moderna costruita con **React + Vite** che utilizza **Open‑Meteo** per i dati atmosferici e **PocketBase** per la persistenza dei luoghi preferiti.  
L’app consente di cercare città, visualizzare meteo attuale e previsioni, salvare località preferite su backend e mostrarle in una **mappa SVG interattiva** con collegamenti visivi e distanze dalla posizione corrente.[file:117][file:121]

---

## ✨ Caratteristiche principali

Questo progetto include:

- Ricerca di città tramite interfaccia semplice e immediata.
- Visualizzazione del **meteo attuale**:
  - temperatura,
  - temperatura percepita,
  - umidità,
  - descrizione testuale delle condizioni,
  - icona meteo.
- Visualizzazione delle **prossime 24 ore**.
- Visualizzazione dei **prossimi 7 giorni**.
- Gestione dei **preferiti salvati su PocketBase**.
- Mappa SVG con:
  - punto della posizione corrente,
  - punti dei luoghi preferiti,
  - archi che collegano la posizione corrente ai preferiti,
  - lista delle distanze in chilometri.
- Struttura del codice organizzata in componenti React riutilizzabili.[file:117][file:121]

---

## 🧠 Obiettivo del progetto

L’obiettivo di questo progetto è mostrare come costruire una piccola applicazione full stack leggera usando:

- **React** per l’interfaccia utente,
- **Vite** per uno sviluppo rapido,
- **Open‑Meteo** come sorgente dati esterna,
- **PocketBase** come backend minimale per salvare dati utente,
- **SVG** per rappresentare visivamente coordinate e relazioni tra posizioni.[file:117][file:121]

Il progetto è utile sia come esercizio pratico sia come base per app più evolute di geolocalizzazione, meteo o confronto tra luoghi.

---

## 🏗️ Stack tecnologico

### Frontend
- React
- Vite
- JavaScript ES Modules
- CSS puro

### Backend / Database
- PocketBase

### API esterne
- Open‑Meteo Forecast API

### Logica geografica
- Formula di Haversine per il calcolo delle distanze
- Proiezione equirettangolare semplice per il rendering SVG delle coordinate geografiche.[file:121]

---

## 📸 Funzionalità dell’interfaccia

### 1. Dashboard meteo
La schermata principale mostra:

- titolo dell’app,
- barra di ricerca città,
- campi opzionali per latitudine e longitudine,
- pulsanti rapidi,
- card meteo attuale,
- previsioni orarie,
- previsioni giornaliere.[file:117]

### 2. Preferiti
L’utente può:

- aggiungere una città ai preferiti,
- salvarla su PocketBase,
- ricaricare rapidamente il meteo cliccando sul preferito,
- eliminare un preferito dalla lista.[file:117]

### 3. Mappa SVG
La sezione mappa visualizza:

- la posizione corrente,
- tutti i preferiti con coordinate convertite in punti SVG,
- archi curvi tra la città attuale e ogni luogo salvato,
- elenco delle distanze dalla posizione corrente verso ciascun preferito.[file:117][file:121]

---

## 📁 Struttura del progetto

Esempio di struttura della cartella `src/`:

```text
src/
│
├── App.jsx
├── main.jsx
├── pbClient.js
├── utils.js
├── App.css
├── index.css
│
├── LocationSearch.jsx
├── CurrentWeather.jsx
├── HourlyForecast.jsx
├── DailyForecast.jsx
└── FavoritesList.jsx

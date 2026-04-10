import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

function MapClickHandler({ onClickMappa }) {
  useMapEvents({
    click: (e) => {
      onClickMappa(e.latlng.lat, e.latlng.lng, false, null);
    },
  });
  return null;
}

const WeatherMap = ({ lat, lon, onClickMappa }) => {
  return (
    <section className="weather-map">
      <h3>🗺️ Mappa Interattiva</h3>
      <p className="map-info">Clicca sulla mappa per ottenere il meteo in quella posizione</p>
      <MapContainer 
        center={[lat, lon]} 
        zoom={10} 
        style={{ height: '400px', borderRadius: '15px', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lon]}>
          <Popup>📍 Posizione attuale</Popup>
        </Marker>
        <MapUpdater lat={lat} lon={lon} />
        <MapClickHandler onClickMappa={onClickMappa} />
      </MapContainer>
    </section>
  );
};

export default WeatherMap;

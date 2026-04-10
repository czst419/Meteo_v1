import React, { useState } from 'react';

const Settings = ({ impostazioni, onSalva, onChiudi }) => {
  const [settings, setSettings] = useState(impostazioni);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSalva = () => {
    onSalva(settings);
    onChiudi();
  };

  return (
    <div className="settings-overlay" onClick={onChiudi}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Impostazioni</h3>
          <button className="close-btn" onClick={onChiudi}>
            ×
          </button>
        </div>

        <div className="settings-body">
          <div className="setting-item">
            <label>Unità Temperatura</label>
            <select
              value={settings.unitaTemp}
              onChange={(e) => handleChange('unitaTemp', e.target.value)}
            >
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Unità Vento</label>
            <select
              value={settings.unitaVento}
              onChange={(e) => handleChange('unitaVento', e.target.value)}
            >
              <option value="kmh">km/h</option>
              <option value="mph">mph</option>
              <option value="ms">m/s</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Lingua</label>
            <select
              value={settings.lingua}
              onChange={(e) => handleChange('lingua', e.target.value)}
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Aggiornamento Automatico</label>
            <input
              type="checkbox"
              checked={settings.autoAggiornamento}
              onChange={(e) =>
                handleChange('autoAggiornamento', e.target.checked)
              }
            />
          </div>

          <div className="setting-item">
            <label>Suoni Meteo</label>
            <input
              type="checkbox"
              checked={settings.suoniAttivi}
              onChange={(e) =>
                handleChange('suoniAttivi', e.target.checked)
              }
            />
          </div>

          <div className="setting-item">
            <label>Ora invio email giornaliera (HH:MM)</label>
            <input
              type="time"
              value={settings.emailTime}
              onChange={(e) => handleChange('emailTime', e.target.value)}
            />
          </div>

          <div className="setting-item">
            <label>Tua email per report</label>
            <input
              type="email"
              placeholder="nome@example.com"
              value={settings.userEmail}
              onChange={(e) => handleChange('userEmail', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-cancel" onClick={onChiudi}>
            Annulla
          </button>
          <button className="btn-save" onClick={handleSalva}>
            Salva
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

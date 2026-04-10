import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const WeatherChart = ({ meteoOrario, temaNotte }) => {
  if (!meteoOrario || meteoOrario.length === 0) return null;

  const data = {
    labels: meteoOrario.map(h => `${h.orario}:00`),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: meteoOrario.map(h => h.temperatura),
        borderColor: temaNotte ? '#74b9ff' : '#0984e3',
        backgroundColor: temaNotte ? 'rgba(116, 185, 255, 0.2)' : 'rgba(9, 132, 227, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      },
      {
        label: 'Umidità (%)',
        data: meteoOrario.map(h => h.umidità),
        borderColor: temaNotte ? '#a29bfe' : '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        tension: 0.4,
        fill: false,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderDash: [5, 5]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: temaNotte ? '#dfe6e9' : '#2d3436',
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: '📊 Andamento Temperatura e Umidità',
        color: temaNotte ? '#dfe6e9' : '#2d3436',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: temaNotte ? 'rgba(45, 52, 54, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: temaNotte ? '#dfe6e9' : '#2d3436',
        bodyColor: temaNotte ? '#dfe6e9' : '#2d3436',
        borderColor: temaNotte ? '#74b9ff' : '#0984e3',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        ticks: { color: temaNotte ? '#dfe6e9' : '#2d3436' },
        grid: { color: temaNotte ? 'rgba(223, 230, 233, 0.1)' : 'rgba(45, 52, 54, 0.1)' }
      },
      x: {
        ticks: { color: temaNotte ? '#dfe6e9' : '#2d3436' },
        grid: { color: temaNotte ? 'rgba(223, 230, 233, 0.1)' : 'rgba(45, 52, 54, 0.1)' }
      }
    }
  };

  return (
    <section className="weather-chart">
      <div style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>
    </section>
  );
};

export default WeatherChart;

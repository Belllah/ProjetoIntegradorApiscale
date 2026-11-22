
import { Line } from 'react-chartjs-2'
import './Charts.css'
import './chartConfig'

export default function PerformanceChart({ desempenho }) {

  const data = {
    labels: desempenho?.labels || [],

    datasets: [
      {
        label: 'Tarefas concluídas',
        data: desempenho?.valores || [],

        borderColor: '#457CFF',
        backgroundColor: 'rgba(69, 124, 255, 0.12)',

        borderWidth: 3,
        fill: true,
        tension: 0.4,

        pointBackgroundColor: '#1B39AD',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#FFFFFF',
        bodyColor: '#E8F1F2',
        padding: 12,
        displayColors: false,
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          color: '#64748B',
          stepSize: 1,
        },

        grid: {
          color: 'rgba(69, 124, 255, 0.10)'
        },

        border: {
          display: false
        }
      },

      x: {
        ticks: {
          color: '#64748B'
        },

        grid: {
          display: false
        },

        border: {
          display: false
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  )
}

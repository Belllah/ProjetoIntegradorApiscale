
import { Doughnut } from 'react-chartjs-2'
import './Charts.css'
import './chartConfig'
import { useTheme } from '../../context/ThemeContext'

export default function TasksChart({ tarefasPorStatus }) {
  const { isDark } = useTheme()

  const data = {
    labels: tarefasPorStatus?.labels || [],

    datasets: [
      {
        data: tarefasPorStatus?.valores || [],

        backgroundColor: [
          '#1B39AD',
          '#457CFF',
          '#009694',
          '#960020'
        ],

        hoverBackgroundColor: [
          '#142B88',
          '#2865ED',
          '#007C7A',
          '#C0002A'
        ],

        borderWidth: 3,
        borderColor: isDark ? '#131c2e' : '#FFFFFF',

        hoverOffset: 8
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: '68%',

    plugins: {
      legend: {
        position: 'bottom',

        labels: {
          color: isDark ? '#E2E8F0' : '#334155',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 22,

          font: {
            size: 12,
            weight: '500'
          }
        }
      },

      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#FFFFFF',
        bodyColor: '#E8F1F2',
        padding: 12
      }
    }
  }

  return (
    <div className="chart-container doughnut-container">
      <Doughnut data={data} options={options} />
    </div>
  )
}

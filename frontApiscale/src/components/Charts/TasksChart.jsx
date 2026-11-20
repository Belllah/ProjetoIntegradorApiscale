import { Doughnut } from 'react-chartjs-2';
import './Charts.css';
import './chartConfig';

// Dados fictícios para demonstração
const dadosExemplo = {
  labels: ['Concluídas', 'Em andamento', 'Pendentes'],
  valores: [18, 4, 6]
};

export default function TasksChart({ tarefasPorStatus }) {

  // Utiliza os dados recebidos ou os dados de exemplo
  const dados = tarefasPorStatus || dadosExemplo;

  const data = {
    labels: dados.labels,

    datasets: [
      {
        data: dados.valores,

        backgroundColor: [
          '#1B39AD',
          '#457CFF',
          '#960020'
        ],

        hoverBackgroundColor: [
          '#142B88',
          '#2865ED',
          '#e00031'
        ],

        borderWidth: 3,
        borderColor: '#FFFFFF',

        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: '68%',

    plugins: {
      legend: {
        position: 'bottom',

        labels: {
          color: '#334155',
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
  };

  return (
    <div className="chart-container doughnut-container">
      <Doughnut data={data} options={options} />
    </div>
  );
}

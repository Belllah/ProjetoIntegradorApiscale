
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PerformanceChart from '../../components/Charts/PerformanceChart'
import TasksChart from '../../components/Charts/TasksChart'

import './Dashboard.css'

// Endereço do backend.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Busca informações da API.
async function apiRequest(path) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`)
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o Spring Boot está rodando.'
    )
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      body?.message || `Erro ao consultar a API (HTTP ${response.status}).`
    )
  }

  return body
}

// Converte os campos recebidos do Java para os nomes utilizados no React.
function toTaskView(task) {
  return {
    id: task.id,
    title: task.titulo,
    description: task.descricao || '',
    status: task.status,
    priority: task.prioridade,
    createdAt: task.dataCriacao,
    dueDate: task.dataPrazo,
    completedAt: task.dataConclusao,
    assignee: task.encarregado?.nome || '',
    team: task.equipe?.nomeEquipe || '',
  }
}

// Formata a data de entrega.
function formatDueDate(value) {
  if (!value) return 'Sem prazo'

  const date = new Date(`${value.slice(0, 10)}T12:00:00`)
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dateKey = value.slice(0, 10)
  const todayKey = today.toLocaleDateString('en-CA')
  const tomorrowKey = tomorrow.toLocaleDateString('en-CA')

  if (dateKey === todayKey) return 'Hoje'
  if (dateKey === tomorrowKey) return 'Amanhã'

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export default function Dashboard() {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  // Busca as tarefas cadastradas no banco.
  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setErrorMessage('')

      try {
        const data = await apiRequest('/api/tarefas')

        if (!Array.isArray(data)) {
          throw new Error('A resposta da API não possui o formato esperado.')
        }

        if (active) {
          setTasks(data.map(toTaskView))
        }

      } catch (error) {
        if (active) {
          setErrorMessage(error.message)
        }

      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }

  }, [retryToken])


  // Calcula os indicadores reais das tarefas.
  const completedTasks = useMemo(
    () => tasks.filter(task => task.status === 'Concluida').length,
    [tasks]
  )

  const inProgressTasks = useMemo(
    () => tasks.filter(task => task.status === 'Em andamento').length,
    [tasks]
  )

  // Mantém somente as três tarefas em andamento mais próximas do prazo.
  const recentTasks = useMemo(() => {
    return tasks
      .filter(task => task.status === 'Em andamento')
      .sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
      .slice(0, 3)
  }, [tasks])


  // Indicadores da distribuição das tarefas para o gráfico.
  const tasksByStatus = useMemo(() => ({
    labels: [
      'Concluídas',
      'Em andamento',
      'Pendentes',
      'Canceladas',
    ],

    valores: [
      tasks.filter(task => task.status === 'Concluida').length,
      tasks.filter(task => task.status === 'Em andamento').length,
      tasks.filter(task => task.status === 'Pendente').length,
      tasks.filter(task => task.status === 'Cancelada').length,
    ],
  }), [tasks])


  // Calcula a quantidade de tarefas concluídas nos últimos sete dias.
  const performanceData = useMemo(() => {

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()

      date.setHours(12, 0, 0, 0)
      date.setDate(date.getDate() - (6 - index))

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return {
        key: `${year}-${month}-${day}`,
        label: date.toLocaleDateString('pt-BR', {
          weekday: 'short',
        }).replace('.', ''),
        value: 0,
      }
    })

    // Conta as tarefas de acordo com a data de conclusão.
    tasks.forEach(task => {
      if (task.status !== 'Concluida' || !task.completedAt) return

      const completedDate = task.completedAt.slice(0, 10)

      const day = days.find(item => item.key === completedDate)

      if (day) {
        day.value++
      }
    })

    return {
      labels: days.map(day => day.label),
      valores: days.map(day => day.value),
    }

  }, [tasks])


  // Cards do Dashboard: gamificação fictícia + dados reais.
  const dashboardStats = [
    {
      label: 'Pontos acumulados',
      value: '1.250',
      icon: 'bi-stars',
    },
    {
      label: 'Tarefas concluídas',
      value: loading ? '...' : errorMessage ? '—' : completedTasks,
      icon: 'bi-check2-circle',
    },
    {
      label: 'Ofensiva atual',
      value: '7 dias',
      icon: 'bi-fire',
    },
    {
      label: 'Tarefas em andamento',
      value: loading ? '...' : errorMessage ? '—' : inProgressTasks,
      icon: 'bi-bullseye',
    },
  ]


  return (
    <section className="dashboard-page">

      {/* Boas-vindas */}
      <div className="welcome-row">

        <div>
          <h2 className="page-title">
            Olá, Isabella! 👋
          </h2>

          <p className="page-subtitle">
            Continue avançando. Cada pequena conquista faz parte da sua evolução.
          </p>
        </div>

        {/* Nível fictício até a implementação da gamificação */}
        <span className="level-pill">
          <i className="bi bi-lightning-charge-fill" />
          Nível 4 · Aprendiz
        </span>

      </div>


      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="dashboard-error" role="alert">
          <span>
            <i className="bi bi-exclamation-circle me-2" />
            {errorMessage}
          </span>

          <button
            type="button"
            onClick={() => setRetryToken(value => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}


      {/* Indicadores */}
      <div className="row g-3 mb-4">

        {dashboardStats.map(item => (
          <div className="col-6 col-xl-3" key={item.label}>

            <article className="stat-card">

              <div className="stat-content">

                <span className="stat-icon">
                  <i className={`bi ${item.icon}`} />
                </span>

                <span className="stat-label">
                  {item.label}
                </span>

              </div>

              <strong className="stat-value">
                {item.value}
              </strong>

            </article>

          </div>
        ))}

      </div>


      <div className="row g-3">

        {/* Tarefas em andamento */}
        <div className="col-xl-5">

          <article className="panel h-100">

            <div className="d-flex justify-content-between align-items-center">

              <h3 className="panel-title">
                Tarefas em andamento
              </h3>

              <Link to="/tarefas" className="small text-decoration-none">
                Ver todas
              </Link>

            </div>


            <div className="task-list">

              {loading ? (

                <p className="dashboard-empty">
                  Carregando tarefas...
                </p>

              ) : errorMessage ? (

                <p className="dashboard-empty">
                  Não foi possível carregar as tarefas.
                </p>

              ) : recentTasks.length > 0 ? (

                recentTasks.map(task => (

                  <div className="task-row" key={task.id}>

                    <div className="d-flex justify-content-between gap-2">

                      <strong>
                        {task.title}
                      </strong>

                      <small>
                        {formatDueDate(task.dueDate)}
                      </small>

                    </div>

                    <span className="task-category">
                      {task.team || task.assignee || 'Sem equipe ou responsável'}
                    </span>

                    <div className="dashboard-task-details">

                      <span className="dashboard-task-status">
                        <i className="bi bi-arrow-repeat me-1" />
                        {task.status}
                      </span>

                      <span className="dashboard-task-priority">
                        {task.priority}
                      </span>

                    </div>

                  </div>

                ))

              ) : (

                <p className="dashboard-empty">
                  Nenhuma tarefa em andamento no momento.
                </p>

              )}

            </div>

          </article>

        </div>


        {/* Jornal do mascote - dados fictícios */}
        <div className="col-xl-7">

          <article className="panel mascot-preview">

            <div className="mascot-map-decoration">
              <i className="bi bi-lightning-charge-fill" />
            </div>

            <div className="mascot-preview-content">

              <div className="mascot-info">

                <span className="section-kicker">
                  <i className="bi bi-newspaper me-1" />
                  JORNAL DO COMPANHEIRO
                </span>

                <h3 className="mascot-title">
                  Novidades de Auron!
                </h3>

                <p className="mascot-description">
                  Nosso pequeno dragão está cada vez mais forte!
                  Com suas últimas conquistas, Auron acumulou
                  experiência e está mais próximo de sua próxima evolução.
                </p>

                <div className="mascot-level">
                  <i className="bi bi-lightning-charge-fill" />
                  Nível 4
                </div>

                <div className="mascot-progress-info">
                  <span>Experiência acumulada</span>
                  <strong>650 / 1000 XP</strong>
                </div>

                <div className="progress mascot-progress">
                  <div
                    className="progress-bar"
                    style={{ width: '65%' }}
                  />
                </div>

                <Link
                  to="/mascote"
                  className="mascot-button mt-4 d-inline-block text-decoration-none"
                >
                  Ler atualizações
                  <i className="bi bi-arrow-up-right ms-2" />
                </Link>

              </div>


              <div className="mascot-image-wrapper">

                <div className="mascot-glow" />

                <img
                  src="/assets/images/MascoteExemplo.png"
                  alt="Auron, seu dragão glacial"
                  className="mascot-image"
                />

                <span className="mascot-name">
                  <i className="bi bi-snow2 me-1" />
                  AURON - DRAGÃO GLACIAL
                </span>

              </div>

            </div>


            <div className="mascot-map-footer">

              <span>
                <i className="bi bi-broadcast me-1" />
                ÚLTIMA ATUALIZAÇÃO
              </span>

              <span>EDIÇÃO Nº 001</span>

            </div>

          </article>

        </div>


        {/* Gráfico de desempenho */}
        <div className="col-xl-6">

          <article className="panel chart-panel">

            <div className="chart-heading">

              <div>
                <h3 className="panel-title">
                  Seu desempenho
                </h3>

                <p className="chart-description">
                  Tarefas concluídas nos últimos sete dias.
                </p>
              </div>

            </div>

            {loading ? (
              <p className="dashboard-empty">Carregando gráfico...</p>
            ) : errorMessage ? (
              <p className="dashboard-empty">Dados indisponíveis.</p>
            ) : (
              <PerformanceChart desempenho={performanceData} />
            )}

          </article>

        </div>


        {/* Gráfico de tarefas */}
        <div className="col-xl-6">

          <article className="panel chart-panel">

            <div className="chart-heading">

              <div>
                <h3 className="panel-title">
                  Suas tarefas
                </h3>

                <p className="chart-description">
                  Distribuição das atividades por status.
                </p>
              </div>

              <span className="chart-heading-icon teal">
                <i className="bi bi-pie-chart-fill" />
              </span>

            </div>

            {loading ? (
              <p className="dashboard-empty">Carregando gráfico...</p>
            ) : errorMessage ? (
              <p className="dashboard-empty">Dados indisponíveis.</p>
            ) : (
              <TasksChart tarefasPorStatus={tasksByStatus} />
            )}

          </article>

        </div>

      </div>

    </section>
  )
}

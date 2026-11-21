import { dashboardStats, tasks } from '../../data/mockData'
import PerformanceChart from '../../components/Charts/PerformanceChart';
import TasksChart from '../../components/Charts/TasksChart';
import './Dashboard.css'

export default function Dashboard() {
  return (
    <section className="dashboard-page">
      <div className="welcome-row"><div><h2 className="page-title">Olá, Isabella! 👋</h2><p className="page-subtitle">Continue avançando. Cada pequena conquista faz parte da sua evolução.</p></div><span className="level-pill"><i className="bi bi-lightning-charge-fill" /> Nível 4 · Aprendiz</span></div>
      <div className="row g-3 mb-4">
        {dashboardStats.map(item => (
          <div className="col-6 col-xl-3" key={item.label}>
            <article className="stat-card">
              <div className="stat-content">
                <span className="stat-icon"><i className={`bi ${item.icon}`} /></span>
                <span className="stat-label">{item.label}</span>
              </div>
              <strong className="stat-value">{item.value}</strong>
            </article>
          </div>
        ))}
      </div>
      <div className="row g-3">
        <div className="col-xl-5"><article className="panel h-100"><div className="d-flex justify-content-between align-items-center"><h3 className="panel-title">Tarefas em andamento</h3><span className="small muted">Ver todas</span></div>
          <div className="task-list">{tasks.map(task=><div className="task-row" key={task.title}><div className="d-flex justify-content-between gap-2"><strong>{task.title}</strong><small>{task.due}</small></div><span className="task-category">{task.category}</span><div className="progress mt-2"><div className="progress-bar" style={{width:`${task.progress}%`}} /></div><small className="muted">{task.progress}% concluído</small></div>)}</div>
        </article></div>

{/* Card de atualizações do mascote */}
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

        <button
          className="mascot-button mt-4"
          onClick={() => window.location.href = '/mascote'}
        >
          Ler atualizações
          <i className="bi bi-arrow-up-right ms-2" />
        </button>

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
          Acompanhe sua evolução ao longo da semana.
        </p>
      </div>
    </div>

    <PerformanceChart />

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
          Visualize o andamento das suas metas.
        </p>
      </div>

      <span className="chart-heading-icon teal">
        <i className="bi bi-pie-chart-fill" />
      </span>
    </div>

    <TasksChart />

  </article>
</div>

      </div>
    </section>
  )
}
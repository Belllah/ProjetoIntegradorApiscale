import { dashboardStats, tasks } from '../../data/mockData'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <section>
      <div className="welcome-row"><div><h2 className="page-title">Olá, Isabella! 👋</h2><p className="page-subtitle">Continue avançando. Cada pequena conquista faz parte da sua evolução.</p></div><span className="level-pill"><i className="bi bi-lightning-charge-fill" /> Nível 4 · Aprendiz</span></div>
      <div className="row g-3 mb-4">
        {dashboardStats.map(item => <div className="col-6 col-xl-3" key={item.label}><article className="stat-card"><div className="d-flex justify-content-between align-items-center"><span className="stat-label">{item.label}</span><span className="stat-icon"><i className={`bi ${item.icon}`} /></span></div><div className="stat-value">{item.value}</div></article></div>)}
      </div>
      <div className="row g-3">
        <div className="col-xl-5"><article className="panel h-100"><div className="d-flex justify-content-between align-items-center"><h3 className="panel-title">Tarefas em andamento</h3><span className="small muted">Ver todas</span></div>
          <div className="task-list">{tasks.map(task=><div className="task-row" key={task.title}><div className="d-flex justify-content-between gap-2"><strong>{task.title}</strong><small>{task.due}</small></div><span className="task-category">{task.category}</span><div className="progress mt-2"><div className="progress-bar" style={{width:`${task.progress}%`}} /></div><small className="muted">{task.progress}% concluído</small></div>)}</div>
        </article></div>
        <div className="col-xl-7"><article className="panel mascot-preview h-100"><div><span className="section-kicker">SUA JORNADA</span><h3 className="panel-title mt-1">Seu dragão está crescendo!</h3><p className="muted">Continue concluindo suas metas para fortalecer seu mascote.</p><div className="d-flex justify-content-between small fw-bold mb-2"><span>Próxima evolução</span><span>65%</span></div><div className="progress"><div className="progress-bar" style={{width:'65%'}} /></div><button className="primary-button mt-4" onClick={()=>window.location.href='/mascote'}>Ver meu mascote <i className="bi bi-arrow-right ms-1" /></button></div><img src="/assets/images/BabyDragon.png" alt="Dragão aprendiz" /></article></div>
        <div className="col-xl-6"><article className="panel"><h3 className="panel-title">Seu desempenho</h3><div className="chart-placeholder"><i className="bi bi-bar-chart-line" /><span>Gráfico de desempenho</span><small>Os dados serão conectados à API posteriormente.</small></div></article></div>
        <div className="col-xl-6"><article className="panel"><h3 className="panel-title">Conquistas recentes</h3><div className="achievement"><span className="achievement-icon"><i className="bi bi-trophy-fill" /></span><div><strong>Primeiros passos</strong><small>Você concluiu sua primeira meta!</small></div><b>+100 pts</b></div><div className="achievement"><span className="achievement-icon teal"><i className="bi bi-fire" /></span><div><strong>Constância em ação</strong><small>7 dias mantendo sua ofensiva.</small></div><b>+50 pts</b></div></article></div>
      </div>
    </section>
  )
}
import './Mascote.css'
const stages = [
  { name:'Ovo', image:'EggDragon.png', description:'O começo de uma grande jornada.' },
  { name:'Aprendiz', image:'BabyDragon.png', description:'Seu dragão está descobrindo suas habilidades.' },
  { name:'Adulto', image:'AdultDragon.png', description:'O resultado de uma jornada de dedicação.' },
]
export default function Mascote() {
  return <section><h2 className="page-title">Meu mascote</h2><p className="page-subtitle">Cada meta concluída ajuda seu dragão a crescer. Cuide dele e acompanhe sua evolução!</p>
    <div className="row g-3"><div className="col-xl-7"><article className="panel mascot-main"><span className="stage-badge">ESTÁGIO ATUAL · APRENDIZ</span><img src="/assets/images/BabyDragon.png" alt="Dragão aprendiz" /><h3>Seu dragão aprendiz</h3><p className="muted">Ele está crescendo junto com você. Continue nessa jornada!</p><div className="mascot-xp"><div className="d-flex justify-content-between small fw-bold mb-2"><span>Experiência para próxima evolução</span><span>650 / 1.000 XP</span></div><div className="progress"><div className="progress-bar" style={{width:'65%'}} /></div></div></article></div>
      <div className="col-xl-5"><article className="panel h-100"><h3 className="panel-title">Cuidados e recompensas</h3><div className="care-item"><i className="bi bi-stars" /><div><strong>1.250 pontos</strong><small>Saldo disponível</small></div></div><div className="care-item"><i className="bi bi-egg" /><div><strong>Ovo de dragão</strong><small>Primeira etapa da evolução</small></div></div><div className="care-item"><i className="bi bi-gift" /><div><strong>Personalizações</strong><small>Itens desbloqueáveis em breve</small></div></div></article></div>
    </div>
    <article className="panel mt-3"><h3 className="panel-title">Etapas da evolução</h3><div className="stage-track">{stages.map((s,i)=><div className={`stage-card ${i===1?'current':''}`} key={s.name}><img src={`/assets/images/${s.image}`} alt={s.name}/><strong>{s.name}</strong><small>{s.description}</small><span>{i===0?'Concluído':i===1?'Estágio atual':'Bloqueado'}</span></div>)}</div></article>
  </section>
}
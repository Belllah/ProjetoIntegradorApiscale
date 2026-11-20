import { useState } from 'react'
import './Equipe.css'

const initialTeams = [
  {
    id: 1,
    name: 'Operações & Processos',
    description: 'Acompanhamento de metas mensais, indicadores e relatórios da área.',
    progress: 75,
    points: '3.450',
    members: [
      { id: 101, name: 'Isabella', role: 'Analista de Operações', streak: 7, points: '1.250', online: true },
      { id: 102, name: 'Lucas Almeida', role: 'Especialista de Processos', streak: 12, points: '1.400', online: true },
      { id: 103, name: 'Mariana Costa', role: 'Assistente Administrativo', streak: 4, points: '800', online: false },
    ],
    messages: [
      { id: 1, author: 'Lucas Almeida', text: 'Fechei a revisão dos relatórios semanais!', time: '10:30' },
      { id: 2, author: 'Isabella', text: 'Ótimo! Já estou atualizando o painel de metas da equipe.', time: '11:15' },
    ]
  },
  {
    id: 2,
    name: 'Relacionamento & Sucesso',
    description: 'Atendimento estratégico, retenção e acompanhamento de clientes.',
    progress: 60,
    points: '2.980',
    members: [
      { id: 104, name: 'Gabriel Santos', role: 'Coordenador de Atendimento', streak: 15, points: '1.680', online: true },
      { id: 105, name: 'Rafael Lima', role: 'Consultor de Relacionamento', streak: 9, points: '1.300', online: true },
    ],
    messages: [
      { id: 1, author: 'Gabriel Santos', text: 'Batemos a meta de satisfação desta semana, parabéns time!', time: '09:45' },
    ]
  }
]

const allCompanyMembers = [
  { id: 101, name: 'Isabella', role: 'Analista de Operações', team: 'Operações & Processos', level: 'Nível 4 · Aprendiz', streak: 7, points: '1.250', online: true },
  { id: 102, name: 'Lucas Almeida', role: 'Especialista de Processos', team: 'Operações & Processos', level: 'Nível 5 · Explorador', streak: 12, points: '1.400', online: true },
  { id: 103, name: 'Mariana Costa', role: 'Assistente Administrativo', team: 'Operações & Processos', level: 'Nível 3 · Iniciante', streak: 4, points: '800', online: false },
  { id: 104, name: 'Gabriel Santos', role: 'Coordenador de Atendimento', team: 'Relacionamento & Sucesso', level: 'Nível 6 · Guardião', streak: 15, points: '1.680', online: true },
  { id: 105, name: 'Rafael Lima', role: 'Consultor de Relacionamento', team: 'Relacionamento & Sucesso', level: 'Nível 4 · Aprendiz', streak: 9, points: '1.300', online: true },
  { id: 106, name: 'Camila Rocha', role: 'Analista de Projetos', team: 'Planejamento & Estratégia', level: 'Nível 5 · Explorador', streak: 11, points: '1.520', online: false },
]


export default function Equipes() {
  const [teams, setTeams] = useState(initialTeams)
  const [selectedTeamId, setSelectedTeamId] = useState(initialTeams.at(0).id)
  const [activeTab, setActiveTab] = useState('minhas-equipes')
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDesc, setNewTeamDesc] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams.at(0)

  const filteredMembers = allCompanyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.team.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          messages: [
            ...team.messages,
            {
              id: Date.now(),
              author: 'Isabella',
              text: newMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }
      }
      return team
    })
    setTeams(updatedTeams)
    setNewMessage('')
  }

  const handleCreateTeam = (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return
    const created = {
      id: Date.now(),
      name: newTeamName,
      description: newTeamDesc || 'Nova equipe criada na plataforma Apiscale.',
      progress: 0,
      points: '0',
      members: [
        { id: 101, name: 'Isabella', role: 'Líder de Equipe', streak: 7, points: '1.250', online: true }
      ],
      messages: []
    }
    setTeams([...teams, created])
    setSelectedTeamId(created.id)
    setNewTeamName('')
    setNewTeamDesc('')
    setShowCreateModal(false)
  }
  return (
    <section>
      <div className="welcome-row">
        <div>
          <h2 className="page-title">Equipes & Colaboração 🤝</h2>
          <p className="page-subtitle">Acompanhe o progresso do seu time, interaja com colegas e alcance metas juntos.</p>
        </div>
        <button className="primary-button" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-lg me-1" /> Nova equipe
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <article className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="stat-label">Minhas equipes</span>
              <span className="stat-icon"><i className="bi bi-people-fill" /></span>
            </div>
            <div className="stat-value">{teams.length}</div>
          </article>
        </div>
        <div className="col-6 col-xl-3">
          <article className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="stat-label">Colegas ativos</span>
              <span className="stat-icon"><i className="bi bi-person-check-fill" /></span>
            </div>
            <div className="stat-value">{allCompanyMembers.filter(m => m.online).length}/{allCompanyMembers.length}</div>
          </article>
        </div>
        <div className="col-6 col-xl-3">
          <article className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="stat-label">Pontos do time</span>
              <span className="stat-icon"><i className="bi bi-trophy-fill" /></span>
            </div>
            <div className="stat-value">{selectedTeam.points}</div>
          </article>
        </div>
        <div className="col-6 col-xl-3">
          <article className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="stat-label">Meta da equipe</span>
              <span className="stat-icon"><i className="bi bi-bullseye" /></span>
            </div>
            <div className="stat-value">{selectedTeam.progress}%</div>
          </article>
        </div>
      </div>

      <div className="equipe-tabs mb-4">
        <button
          className={`equipe-tab-btn ${activeTab === 'minhas-equipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('minhas-equipes')}
        >
          <i className="bi bi-diagram-3 me-2" /> Minhas Equipes
        </button>
        <button
          className={`equipe-tab-btn ${activeTab === 'empresa' ? 'active' : ''}`}
          onClick={() => setActiveTab('empresa')}
        >
          <i className="bi bi-building me-2" /> Todos os Colegas ({allCompanyMembers.length})
        </button>
      </div>

      {activeTab === 'minhas-equipes' && (
        <div className="row g-3">
          <div className="col-xl-4">
            <article className="panel h-100">
              <h3 className="panel-title mb-3">Equipes que participo</h3>
              <div className="d-flex flex-column gap-2">
                {teams.map(team => (
                  <div
                    key={team.id}
                    className={`team-selector-card ${team.id === selectedTeam.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{team.name}</strong>
                      <span className="badge bg-primary-subtle text-primary rounded-pill">
                        {team.members.length} membros
                      </span>
                    </div>
                    <p className="small muted mb-2">{team.description}</p>
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                      <span>Progresso coletivo</span>
                      <span>{team.progress}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ width: `${team.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
          <div className="col-xl-8">
            <article className="panel h-100">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <span className="section-kicker">EQUIPE SELECIONADA</span>
                  <h3 className="panel-title mt-1">{selectedTeam.name}</h3>
                  <p className="muted small mb-0">{selectedTeam.description}</p>
                </div>
                <span className="level-pill">
                  <i className="bi bi-stars" /> {selectedTeam.points} pts acumulados
                </span>
              </div>

              <h4 className="small fw-bold text-uppercase muted mt-4 mb-2">Integrantes do time</h4>
              <div className="row g-2 mb-4">
                {selectedTeam.members.map(member => (
                  <div className="col-md-6" key={member.id}>
                    <div className="member-mini-card" onClick={() => setSelectedMember(member)}>
                      <div className="member-avatar">
                        {member.name.charAt(0)}
                        <span className={`status-dot ${member.online ? 'online' : 'offline'}`} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{member.name}</div>
                        <small className="muted d-block">{member.role}</small>
                      </div>
                      <div className="text-end">
                        <span className="streak-badge">
                          <i className="bi bi-fire" /> {member.streak}d
                        </span>
                        <small className="d-block fw-bold text-primary mt-1">{member.points} pts</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="small fw-bold text-uppercase muted mb-2">Mural da equipe</h4>
              <div className="team-chat-box">
                {selectedTeam.messages.length === 0 ? (
                  <p className="small muted text-center my-3">Nenhuma mensagem ainda. Diga oi para sua equipe!</p>
                ) : (
                  selectedTeam.messages.map(msg => (
                    <div key={msg.id} className="chat-msg">
                      <div className="d-flex justify-content-between">
                        <strong className="small">{msg.author}</strong>
                        <small className="muted">{msg.time}</small>
                      </div>
                      <p className="mb-0 small">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="d-flex gap-2 mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enviar incentivo ou atualização para a equipe..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="primary-button">
                  <i className="bi bi-send-fill" />
                </button>
              </form>
            </article>
          </div>
        </div>
      )}

      {activeTab === 'empresa' && (
        <article className="panel">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <h3 className="panel-title mb-0">Diretório da Empresa</h3>
              <small className="muted">Clique em um colega para visualizar seu perfil e conquistas</small>
            </div>
            <div className="search-box">
              <i className="bi bi-search" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Buscar por nome, cargo ou equipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3">
            {filteredMembers.map(member => (
              <div className="col-md-6 col-xl-4" key={member.id}>
                <div className="company-member-card" onClick={() => setSelectedMember(member)}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="member-avatar lg">
                      {member.name.charAt(0)}
                      <span className={`status-dot ${member.online ? 'online' : 'offline'}`} />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">{member.name}</h5>
                      <span className="small muted d-block">{member.role}</span>
                      <span className="badge bg-light text-dark border mt-1">{member.team}</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top small">
                    <span className="streak-badge"><i className="bi bi-fire" /> {member.streak} dias</span>
                    <strong className="text-primary">{member.points} pts</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      )}

      {selectedMember && (
        <div className="custom-modal-backdrop" onClick={() => setSelectedMember(null)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="section-kicker">PERFIL DO COLABORADOR</span>
              <button className="btn-close" onClick={() => setSelectedMember(null)} />
            </div>
            <div className="text-center mb-3">
              <div className="member-avatar xl mx-auto mb-2">{selectedMember.name.charAt(0)}</div>
              <h4 className="fw-bold mb-0">{selectedMember.name}</h4>
              <p className="muted small mb-1">{selectedMember.role}</p>
              {selectedMember.level && <span className="level-pill">{selectedMember.level}</span>}
            </div>
            <div className="row g-2 text-center my-3">
              <div className="col-6">
                <div className="p-2 rounded bg-light">
                  <small className="muted d-block">Pontos</small>
                  <strong>{selectedMember.points}</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded bg-light">
                  <small className="muted d-block">Ofensiva</small>
                  <strong><i className="bi bi-fire text-warning" /> {selectedMember.streak} dias</strong>
                </div>
              </div>
            </div>
            <button className="primary-button w-100 justify-content-center" onClick={() => setSelectedMember(null)}>
              Fechar perfil
            </button>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="custom-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="panel-title mb-0">Criar Nova Equipe</h4>
              <button className="btn-close" onClick={() => setShowCreateModal(false)} />
            </div>
            <form onSubmit={handleCreateTeam}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Nome da equipe</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Squad Inovação"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Objetivo / Descrição</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Descreva o foco desta equipe..."
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  Criar equipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

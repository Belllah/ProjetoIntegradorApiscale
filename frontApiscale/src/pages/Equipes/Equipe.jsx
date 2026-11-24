import { useEffect, useState } from 'react'
import './Equipe.css'
import { useUser } from '../../context/UserContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options)
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

function formatMemberFromApi(func, index = 0) {
  return {
    id: func.id,
    name: func.nome || 'Colaborador',
    role: func.cargo || 'Funcionário',
    level: 'Nível 4 · Aprendiz',
    streak: 7,
    points: String(1000 + ((func.id || index + 1) * 150)),
    online: true,
    empresaId: func.empresa?.id ?? null,
    empresaCnpj: func.empresa?.cnpj ?? null,
  }
}

function mapEquipeFromApi(equipe, index, tasks, companyFuncionarios) {
  const teamTasks = tasks.filter(t => t.equipe?.id === equipe.id)
  const completedCount = teamTasks.filter(t => t.status === 'Concluida').length
  const progress = teamTasks.length > 0
    ? Math.round((completedCount / teamTasks.length) * 100)
    : 0

  const empresaLabel =
    equipe.empresa?.nomeFantasia ||
    equipe.empresa?.razaoSocial ||
    equipe.empresa?.nome ||
    equipe.empresa?.cnpj ||
    'Apiscale Corporativo'

  // 1) Se a API de equipes já trouxer a lista de integrantes dentro da equipe
  const rawEmbeddedMembers = Array.isArray(equipe.funcionarios)
    ? equipe.funcionarios
    : Array.isArray(equipe.membros)
      ? equipe.membros
      : []

  let teamMembers = rawEmbeddedMembers.map((m, idx) =>
    formatMemberFromApi(m.funcionario || m, idx)
  )

  // 2) Se não vier dentro da equipe, filtra os funcionários da empresa vinculados a essa equipe
  if (teamMembers.length === 0) {
    teamMembers = companyFuncionarios
      .filter(f =>
        f.equipe?.id === equipe.id ||
        f.equipeId === equipe.id ||
        (Array.isArray(f.equipes) && f.equipes.some(eq => eq.id === equipe.id))
      )
      .map((f, idx) => formatMemberFromApi(f, idx))
  }

  return {
    id: equipe.id,
    name: equipe.nomeEquipe,
    description: `Equipe vinculada à unidade ${empresaLabel}.`,
    progress,
    points: String(2400 + (equipe.id || index + 1) * 350),
    tasksCount: teamTasks.length,
    members: teamMembers,
    messages: teamMembers.length > 0
      ? [{
        id: 1,
        author: teamMembers[0].name,
        text: `Metas da equipe ${equipe.nomeEquipe} atualizadas!`,
        time: '10:30',
      }]
      : [],
  }
}

export default function Equipes() {
  const { user } = useUser()
  const [teams, setTeams] = useState([])
  const [companyMembers, setCompanyMembers] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  const [activeTab, setActiveTab] = useState('minhas-equipes')
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDesc, setNewTeamDesc] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState([])
  const [editingTeamId, setEditingTeamId] = useState(null)
  const openEditTeamModal = (team) => {
    setEditingTeamId(team.id)
    setNewTeamName(team.name || '')
    setNewTeamDesc('')
    setSelectedMemberIds(Array.isArray(team.members) ? team.members.map(m => m.id) : [])
    setShowCreateModal(true)
  }

  const closeTeamModal = () => {
    setShowCreateModal(false)
    setEditingTeamId(null)
    setNewTeamName('')
    setNewTeamDesc('')
    setSelectedMemberIds([])
  }
  const [selectedMember, setSelectedMember] = useState(null)
  const toggleMemberSelection = (memberId) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  useEffect(() => {
    let active = true

    async function loadEquipes() {
      setLoading(true)
      setErrorMessage('')

      try {
        const [equipesData, tarefasData, funcionariosData] = await Promise.all([
          apiRequest('/api/equipes'),
          apiRequest('/api/tarefas').catch(() => []),
          apiRequest('/api/funcionarios').catch(() => []),
        ])

        if (!Array.isArray(equipesData)) {
          throw new Error('A resposta da API de equipes não possui o formato esperado.')
        }

        const safeTasks = Array.isArray(tarefasData) ? tarefasData : []
        const safeFuncionarios = Array.isArray(funcionariosData) ? funcionariosData : []

        // Filtra funcionários da mesma empresa do usuário logado
        const userEmpresaId = user?.empresa?.id ?? null
        const userEmpresaCnpj = user?.empresa?.cnpj ?? null

        const mesmosDaEmpresa = safeFuncionarios.filter(func => {
          if (userEmpresaId != null && func.empresa?.id != null) {
            return func.empresa.id === userEmpresaId
          }
          if (userEmpresaCnpj && func.empresa?.cnpj) {
            return func.empresa.cnpj === userEmpresaCnpj
          }
          // Se o usuário logado não tiver empresa vinculada, mostra os retornados
          return userEmpresaId == null && !userEmpresaCnpj
        })

        // Filtra também as equipes da mesma empresa (se houver vínculo)
        const equipesDaEmpresa = equipesData.filter(eq => {
          if (userEmpresaId != null && eq.empresa?.id != null) {
            return eq.empresa.id === userEmpresaId
          }
          if (userEmpresaCnpj && eq.empresa?.cnpj) {
            return eq.empresa.cnpj === userEmpresaCnpj
          }
          return true
        })

        const formattedTeams = equipesDaEmpresa.map((eq, idx) =>
          mapEquipeFromApi(eq, idx, safeTasks, mesmosDaEmpresa)
        )

        const formattedMembers = mesmosDaEmpresa.map((func, idx) => {
          const equipeDoColega = formattedTeams.find(t =>
            t.members.some(m => m.id === func.id)
          )
          return {
            ...formatMemberFromApi(func, idx),
            team: equipeDoColega?.name || func.empresa?.nomeFantasia || func.empresa?.nome || 'Empresa',
          }
        })

        if (active) {
          setTeams(formattedTeams)
          setCompanyMembers(formattedMembers)
          setSelectedTeamId(prev => prev ?? formattedTeams.at(0)?.id ?? null)
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

    loadEquipes()

    return () => {
      active = false
    }
  }, [retryToken, user])

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams.at(0) || {
    id: 0,
    name: 'Nenhuma equipe',
    description: '',
    progress: 0,
    points: '0',
    members: [],
    messages: []
  }

  const allCompanyMembers = companyMembers

  const filteredMembers = allCompanyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.team.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedTeam.id) return
    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          messages: [
            ...team.messages,
            {
              id: Date.now(),
              author: user?.nome || 'Colaborador',
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

  const handleSaveTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    const empresaCnpj = user?.empresa?.cnpj || companyMembers.at(0)?.empresaCnpj || null
    const isEditing = editingTeamId != null

    const payload = {
      nomeEquipe: newTeamName.trim(),
      ...(empresaCnpj ? { empresa: { cnpj: empresaCnpj } } : {}),
      funcionarios: selectedMemberIds.map(id => ({ id })),
    }

    try {
      const endpoint = isEditing ? `/api/equipes/${editingTeamId}` : '/api/equipes'
      const method = isEditing ? 'PUT' : 'POST'

      const savedEquipe = await apiRequest(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const baseTeam = isEditing
        ? teams.find(t => t.id === editingTeamId)
        : null

      const formattedTeam = mapEquipeFromApi(
        savedEquipe,
        isEditing ? 0 : teams.length,
        [],
        companyMembers
      )

      if (isEditing) {
        setTeams(prev =>
          prev.map(t => (t.id === editingTeamId ? { ...formattedTeam, messages: baseTeam?.messages || formattedTeam.messages } : t))
        )
        setSelectedTeamId(savedEquipe.id ?? editingTeamId)
      } else {
        setTeams(prev => [...prev, formattedTeam])
        setSelectedTeamId(savedEquipe.id ?? formattedTeam.id)
      }

      closeTeamModal()
    } catch (error) {
      setErrorMessage(error.message)
      closeTeamModal()
    }
  }
  const handleDeleteTeam = async (teamId, teamName = 'esta equipe') => {
    if (!teamId) return

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${teamName}"? Essa ação não pode ser desfeita.`
    )
    if (!confirmed) return

    try {
      await apiRequest(`/api/equipes/${teamId}`, {
        method: 'DELETE',
      })

      const remainingTeams = teams.filter(t => t.id !== teamId)
      setTeams(remainingTeams)

      if (selectedTeamId === teamId) {
        setSelectedTeamId(remainingTeams.at(0)?.id ?? null)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  return (
    <section>
      <div className="welcome-row">
        <div>
          <h2 className="page-title">Equipes & Colaboração 🤝</h2>
          <p className="page-subtitle">Acompanhe o progresso do seu time, interaja com colegas e alcance metas juntos.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            setEditingTeamId(null)
            setNewTeamName('')
            setNewTeamDesc('')
            setSelectedMemberIds([])
            setShowCreateModal(true)
          }}
        >
          <i className="bi bi-plus-lg me-1" /> Nova equipe
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center mb-4" role="alert">
          <span>
            <i className="bi bi-exclamation-circle me-2" />
            {errorMessage}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => setRetryToken(value => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <article className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="stat-label">Equipes cadastradas</span>
              <span className="stat-icon"><i className="bi bi-people-fill" /></span>
            </div>
            <div className="stat-value">{loading ? '...' : teams.length}</div>
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
            <div className="stat-value">{loading ? '...' : selectedTeam.points}</div>
          </article>
        </div>
        <div className="col-6 col-xl-3">
          <article className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="stat-label">Meta da equipe</span>
              <span className="stat-icon"><i className="bi bi-bullseye" /></span>
            </div>
            <div className="stat-value">{loading ? '...' : `${selectedTeam.progress}%`}</div>
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
              <h3 className="panel-title mb-3">Equipes no sistema</h3>
              {loading ? (
                <p className="muted small">Carregando equipes do banco...</p>
              ) : teams.length === 0 ? (
                <p className="muted small">Nenhuma equipe cadastrada no banco de dados.</p>
              ) : (
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
              )}
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
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="level-pill">
                    <i className="bi bi-stars" /> {selectedTeam.points} pts acumulados
                  </span>
                  {selectedTeam.id !== 0 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openEditTeamModal(selectedTeam)}
                      >
                        <i className="bi bi-pencil me-1" /> Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteTeam(selectedTeam.id, selectedTeam.name)}
                      >
                        <i className="bi bi-trash me-1" /> Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h4 className="small fw-bold text-uppercase muted mt-4 mb-2">Integrantes do time</h4>
              {selectedTeam.members.length === 0 ? (
                <p className="small muted mb-4">Nenhum integrante vinculado a esta equipe no banco de dados.</p>
              ) : (
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
              )}

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
      )
      }

      {
        selectedMember && (
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
        )
      }

      {
        showCreateModal && (
          <div className="custom-modal-backdrop" onClick={closeTeamModal}>
            <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="panel-title mb-0">
                  {editingTeamId != null ? 'Editar Equipe' : 'Criar Nova Equipe'}
                </h4>
                <button className="btn-close" onClick={closeTeamModal} />
              </div>
              <form onSubmit={handleSaveTeam}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Nome da equipe</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Equipe Comercial"
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
                <div className="mb-3">
                  <label className="form-label small fw-bold">Integrantes da equipe</label>
                  <div className="border rounded p-2 d-flex flex-column gap-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    {allCompanyMembers.length === 0 ? (
                      <small className="muted">Nenhum colega disponível na empresa.</small>
                    ) : (
                      allCompanyMembers.map(member => (
                        <label key={member.id} className="form-check d-flex align-items-center gap-2 mb-0" style={{ cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            className="form-check-input mt-0"
                            checked={selectedMemberIds.includes(member.id)}
                            onChange={() => toggleMemberSelection(member.id)}
                          />
                          <span className="small fw-semibold">{member.name}</span>
                          <small className="muted ms-auto">{member.role}</small>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={closeTeamModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="primary-button">
                    {editingTeamId != null ? 'Salvar alterações' : 'Criar equipe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </section >
  )
}

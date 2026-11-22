import { useEffect, useMemo, useState } from 'react'
import './Tarefas.css'

// Usa a URL local do backend, permitindo trocar o endereço com VITE_API_URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// As opções correspondem aos status e prioridades disponíveis nas tarefas.
const STATUS_OPTIONS = ['Pendente', 'Em andamento', 'Concluida', 'Cancelada']
const PRIORITY_OPTIONS = ['Baixa', 'Media', 'Alta', 'Urgente']

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'Pendente',
  priority: 'Media',
  dueDate: '',
  assigneeId: '',
  teamId: '',
}

// Envia uma requisição à API e transforma respostas de erro em mensagens para a tela.
async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new Error(`Não foi possível conectar ao servidor da aplicação em ${API_BASE_URL}. Confira se o backend está rodando.`)
  }

  const body = response.status === 204
    ? null
    : await response.json().catch(() => null)

  if (!response.ok) {
    const detail = body?.detail || body?.message || body?.error
    const message = detail || `Não foi possível concluir a solicitação (erro HTTP ${response.status}).`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return body
}

// Converte o JSON da entidade Java para os nomes usados pelos componentes React.
function toTaskView(task) {
  return {
    id: task.id,
    title: task.titulo,
    description: task.descricao || '',
    status: task.status,
    priority: task.prioridade,
    dueDate: task.dataPrazo ? task.dataPrazo.slice(0, 10) : '',
    dataConclusao: task.dataConclusao || null,
    creatorId: task.criador?.id ? String(task.criador.id) : '',
    assigneeId: task.encarregado?.id ? String(task.encarregado.id) : '',
    teamId: task.equipe?.id ? String(task.equipe.id) : '',
    assignee: task.encarregado?.nome || '',
    team: task.equipe?.nomeEquipe || '',
  }
}

// Converte uma data ISO em uma data curta no padrão brasileiro.
function formatDueDate(value) {
  if (!value) return 'Sem prazo'

  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

// Apresenta uma tarefa como card, tanto na lista quanto no quadro Kanban.
function TaskCard({
  task,
  onEdit,
  onDelete,
  compact = false,
  onToggleComments,
  commentsOpen,
  comments = [],
  commentsLoading,
  commentDraft = '',
  onCommentDraftChange,
  onCommentSubmit,
}) {
  return (
    <article className={`task-card task-card-${task.priority.toLowerCase()} ${task.status === 'Concluida' ? 'task-card-concluida' : ''} ${compact ? 'task-card-compact' : ''}`}>
      <div className="task-card-topline">
        <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
          <span className="priority-dot" />
          {task.priority}
        </span>
        <div className="task-card-actions">
          <button type="button" aria-label={`Editar tarefa ${task.title}`} onClick={() => onEdit(task)}>
            <i className="bi bi-pencil" />
          </button>
          <button type="button" aria-label={`Excluir tarefa ${task.title}`} onClick={() => onDelete(task)}>
            <i className="bi bi-trash3" />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>
      {task.description && <p className="task-card-description">{task.description}</p>}

      <div className="task-card-meta">
        <span><i className="bi bi-calendar3" /> {formatDueDate(task.dueDate)}</span>
        {task.team && <span><i className="bi bi-people" /> {task.team}</span>}
      </div>

      <div className="task-card-bottom">
        <span className="task-assignee">
          <span className="assignee-avatar">{task.assignee ? task.assignee.charAt(0) : '?'}</span>
          {task.assignee || 'Sem encarregado'}
        </span>
        {!compact && <span className={`status-label status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>}
      </div>

      <button type="button" className="task-comment-toggle" onClick={() => onToggleComments(task)}>
        <i className="bi bi-chat-left-text" />
        {commentsOpen ? 'Fechar comentários' : `Comentários${comments.length ? ` (${comments.length})` : ''}`}
      </button>

      {commentsOpen && (
        <section className="task-comments" aria-label={`Comentários da tarefa ${task.title}`}>
          {commentsLoading ? (
            <p className="task-comments-empty">Carregando comentários...</p>
          ) : comments.length ? (
            <div className="task-comments-list">
              {comments.map(comment => (
                <article className="task-comment" key={comment.id}>
                  <p>{comment.conteudo}</p>
                  <small>{comment.autorNome || 'Usuário de teste'} · {new Date(comment.dataCriacao).toLocaleString('pt-BR')}</small>
                </article>
              ))}
            </div>
          ) : (
            <p className="task-comments-empty">Ainda não há comentários nesta tarefa.</p>
          )}
          <form className="task-comment-form" onSubmit={event => onCommentSubmit(event, task)}>
            <input
              value={commentDraft}
              maxLength={1000}
              onChange={event => onCommentDraftChange(task.id, event.target.value)}
              placeholder="Escreva um comentário"
              aria-label="Novo comentário"
            />
            <button type="submit" disabled={!commentDraft.trim()} aria-label="Enviar comentário">
              <i className="bi bi-send" />
            </button>
          </form>
        </section>
      )}
    </article>
  )
}

export default function Tarefas() {
  // Os estados começam vazios e são preenchidos com respostas da API.
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryToken, setRetryToken] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos os status')
  const [priorityFilter, setPriorityFilter] = useState('Todas as prioridades')
  const [view, setView] = useState('list')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [commentsByTask, setCommentsByTask] = useState({})
  const [commentDrafts, setCommentDrafts] = useState({})
  const [openCommentTaskId, setOpenCommentTaskId] = useState(null)
  const [commentsLoadingTaskId, setCommentsLoadingTaskId] = useState(null)

  // Carrega tarefas e opções de pessoas/equipes do backend ao abrir a página.
  useEffect(() => {
    let active = true

    async function loadPageData() {
      setLoading(true)
      setErrorMessage('')

      try {
        const [taskData, employeeData, teamData] = await Promise.all([
          apiRequest('/api/tarefas'),
          apiRequest('/api/funcionarios'),
          apiRequest('/api/equipes'),
        ])

        if (!active) return
        setTasks(taskData.map(toTaskView))
        setEmployees(employeeData)
        setTeams(teamData)
      } catch (error) {
        if (!active) return
        setErrorMessage(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPageData()
    return () => { active = false }
  }, [retryToken])

  // Temporariamente usa Isa como a conta conectada até existir autenticação real.
  const currentUser = employees.find(employee => employee.nome?.trim().toLocaleLowerCase('pt-BR') === 'isa')
    || employees.find(employee => employee.nome?.trim().toLocaleLowerCase('pt-BR').startsWith('isa'))

  // Calcula os indicadores com base em todas as tarefas, sem aplicar os filtros da lista.
  const stats = useMemo(() => ([
    { label: 'Total de tarefas', value: tasks.length, icon: 'bi-list-task', tone: 'blue' },
    { label: 'Pendentes', value: tasks.filter(task => task.status === 'Pendente').length, icon: 'bi-hourglass', tone: 'amber' },
    { label: 'Em andamento', value: tasks.filter(task => task.status === 'Em andamento').length, icon: 'bi-arrow-repeat', tone: 'violet' },
    { label: 'Concluídas', value: tasks.filter(task => task.status === 'Concluida').length, icon: 'bi-check2-circle', tone: 'green' },
  ]), [tasks])

  // Aplica busca, status e prioridade à visualização atual.
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')

    return tasks.filter(task => {
      const matchesSearch = !query || [task.title, task.description, task.assignee, task.team]
        .some(value => value?.toLocaleLowerCase('pt-BR').includes(query))
      const matchesStatus = statusFilter === 'Todos os status' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'Todas as prioridades' || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, search, statusFilter, priorityFilter])

  // Busca comentários apenas para uma tarefa que já foi salva e tem um ID.
  async function handleToggleComments(task) {
    if (openCommentTaskId === task.id) {
      setOpenCommentTaskId(null)
      return
    }

    setOpenCommentTaskId(task.id)
    setCommentsLoadingTaskId(task.id)
    try {
      const comments = await apiRequest(`/api/tarefas/${task.id}/comentarios`)
      setCommentsByTask(current => ({ ...current, [task.id]: comments }))
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setCommentsLoadingTaskId(null)
    }
  }

  // Envia comentário usando o ID de uma tarefa já persistida.
  async function handleCommentSubmit(event, task) {
    event.preventDefault()
    const conteudo = (commentDrafts[task.id] || '').trim()
    if (!conteudo) return

    setErrorMessage('')
    try {
      const comment = await apiRequest(`/api/tarefas/${task.id}/comentarios`, {
        method: 'POST',
        body: JSON.stringify({ conteudo, autorId: null }),
      })
      setCommentsByTask(current => ({
        ...current,
        [task.id]: [...(current[task.id] || []), comment],
      }))
      setCommentDrafts(current => ({ ...current, [task.id]: '' }))
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function changeCommentDraft(taskId, value) {
    setCommentDrafts(current => ({ ...current, [taskId]: value }))
  }

  function taskCardCommentProps(task) {
    return {
      onToggleComments: handleToggleComments,
      commentsOpen: openCommentTaskId === task.id,
      comments: commentsByTask[task.id] || [],
      commentsLoading: commentsLoadingTaskId === task.id,
      commentDraft: commentDrafts[task.id] || '',
      onCommentDraftChange: changeCommentDraft,
      onCommentSubmit: handleCommentSubmit,
    }
  }

  // Prepara o formulário vazio ou preenche os campos com os dados da tarefa selecionada.
  function openForm(task = null) {
    setEditingId(task?.id ?? null)
    setForm(task
      ? { ...EMPTY_FORM, ...task }
      : {
          ...EMPTY_FORM,
          assigneeId: String(employees[0]?.id_funcionario ?? employees[0]?.id ?? ''),
          teamId: String(teams[0]?.id_equipe ?? teams[0]?.id ?? ''),
        })
    setModalOpen(true)
  }

  // Envia a tarefa para a API e atualiza a tela após a confirmação.
  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    const creatorId = editingId === null
      ? currentUser?.id_funcionario ?? currentUser?.id ?? null
      : form.creatorId || currentUser?.id_funcionario || currentUser?.id || null

    const payload = {
      titulo: form.title.trim(),
      descricao: form.description.trim() || null,
      status: form.status,
      prioridade: form.priority,
      dataPrazo: form.dueDate ? `${form.dueDate}T12:00:00` : null,
      dataConclusao: form.dataConclusao || null,
      criadorId: creatorId ? Number(creatorId) : null,
      encarregadoId: form.assigneeId ? Number(form.assigneeId) : null,
      idEquipe: form.teamId ? Number(form.teamId) : null,
    }

    try {
      const savedTask = await apiRequest(
        editingId === null ? '/api/tarefas' : `/api/tarefas/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          body: JSON.stringify(payload),
        },
      )
      const savedTaskView = toTaskView(savedTask)

      setTasks(current => editingId === null
        ? [savedTaskView, ...current]
        : current.map(task => task.id === editingId ? savedTaskView : task))
      setModalOpen(false)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  // Exclui no backend e remove o card somente após receber confirmação da API.
  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa “${task.title}”?`)) return

    setErrorMessage('')
    try {
      await apiRequest(`/api/tarefas/${task.id}`, { method: 'DELETE' })
      setTasks(current => current.filter(item => item.id !== task.id))
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <section className="tasks-page">
      <div className="tasks-heading-row">
        <div>
          <span className="tasks-eyebrow">GESTÃO DE ATIVIDADES</span>
          <h2 className="page-title">Tarefas</h2>
          <p className="page-subtitle">Organize o trabalho da equipe e acompanhe cada entrega.</p>
        </div>
        <div className="tasks-heading-actions">
          <button type="button" className="tasks-create-button" onClick={() => openForm()}>
            <i className="bi bi-plus-lg" />
            <span>Nova tarefa</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="tasks-feedback error" role="alert">
          <i className="bi bi-exclamation-circle-fill" />
          <span>{errorMessage}</span>
          <button type="button" className="tasks-retry-button" onClick={() => setRetryToken(value => value + 1)}>Tentar novamente</button>
          <button type="button" onClick={() => setErrorMessage('')} aria-label="Fechar mensagem"><i className="bi bi-x-lg" /></button>
        </div>
      )}
      <div className="tasks-stats-grid">
        {stats.map(stat => (
          <article className="tasks-stat-card" key={stat.label}>
            <div className={`tasks-stat-icon ${stat.tone}`}><i className={`bi ${stat.icon}`} /></div>
            <div className="tasks-stat-copy">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="tasks-toolbar">
        <label className="tasks-search">
          <i className="bi bi-search" />
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Buscar por tarefa, pessoa ou equipe"
            aria-label="Buscar tarefas"
          />
        </label>

        <div className="tasks-filters">
          <label className="visually-hidden" htmlFor="tasks-status-filter">Filtrar por status</label>
          <select id="tasks-status-filter" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
            <option>Todos os status</option>
            {STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}
          </select>

          <label className="visually-hidden" htmlFor="tasks-priority-filter">Filtrar por prioridade</label>
          <select id="tasks-priority-filter" value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)}>
            <option>Todas as prioridades</option>
            {PRIORITY_OPTIONS.map(priority => <option key={priority}>{priority}</option>)}
          </select>
        </div>

        <div className="tasks-view-switch" role="group" aria-label="Modo de visualização">
          <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="Visualização em lista">
            <i className="bi bi-list-ul" />
          </button>
          <button type="button" className={view === 'board' ? 'active' : ''} onClick={() => setView('board')} aria-label="Visualização Kanban">
            <i className="bi bi-kanban" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="tasks-loading-state"><span className="tasks-spinner" />Carregando tarefas...</div>
      ) : tasks.length === 0 && !errorMessage ? (
        <div className="tasks-empty-state">
          <span><i className="bi bi-list-check" /></span>
          <h3>Ainda não há tarefas cadastradas</h3>
          <p>Crie uma tarefa para ela aparecer nesta lista.</p>
        </div>
      ) : filteredTasks.length === 0 && tasks.length > 0 ? (
        <div className="tasks-empty-state">
          <span><i className="bi bi-search" /></span>
          <h3>Nenhuma tarefa encontrada</h3>
          <p>Tente mudar a busca ou os filtros selecionados.</p>
        </div>
      ) : view === 'list' ? (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={openForm} onDelete={handleDelete} {...taskCardCommentProps(task)} />
          ))}
        </div>
      ) : (
        <div className="tasks-board">
          {STATUS_OPTIONS.map(status => {
            const columnTasks = filteredTasks.filter(task => task.status === status)
            return (
              <section className="tasks-board-column" key={status}>
                <div className="tasks-board-heading">
                  <div><span className={`board-status-dot status-dot-${status.toLowerCase().replace(' ', '-')}`} />{status}</div>
                  <span>{columnTasks.length}</span>
                </div>
                <div className="tasks-board-cards">
                  {columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} compact onEdit={openForm} onDelete={handleDelete} {...taskCardCommentProps(task)} />
                  ))}
                  {columnTasks.length === 0 && <p className="tasks-board-empty">Nenhuma tarefa</p>}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <div className="tasks-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setModalOpen(false)}>
          <section className="tasks-modal" role="dialog" aria-modal="true" aria-labelledby="tasks-modal-title">
            <div className="tasks-modal-heading">
              <div>
                <span className="tasks-eyebrow">DETALHES DA ATIVIDADE</span>
                <h2 id="tasks-modal-title">{editingId === null ? 'Criar tarefa' : 'Editar tarefa'}</h2>
              </div>
              <button type="button" className="tasks-modal-close" onClick={() => setModalOpen(false)} aria-label="Fechar">
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="tasks-form-field">
                <span>Título <b>*</b></span>
                <input autoFocus required maxLength={50} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Ex.: Revisar planejamento do mês" />
              </label>

              <label className="tasks-form-field">
                <span>Descrição</span>
                <textarea rows="3" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Adicione contexto ou próximos passos" />
              </label>

              <div className="tasks-form-grid">
                <label className="tasks-form-field">
                  <span>Status</span>
                  <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}>
                    {STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="tasks-form-field">
                  <span>Prioridade</span>
                  <select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}>
                    {PRIORITY_OPTIONS.map(priority => <option key={priority}>{priority}</option>)}
                  </select>
                </label>
                <label className="tasks-form-field">
                  <span>Prazo</span>
                  <input type="date" value={form.dueDate} onChange={event => setForm({ ...form, dueDate: event.target.value })} />
                </label>
                <label className="tasks-form-field">
                  <span>Encarregado</span>
                  <select value={form.assigneeId} onChange={event => setForm({ ...form, assigneeId: event.target.value })}>
                    <option value="">Sem encarregado</option>
                    {employees.map(employee => (
                      <option key={employee.id_funcionario ?? employee.id} value={employee.id_funcionario ?? employee.id}>
                        {employee.nome || `Funcionário ${employee.id_funcionario ?? employee.id}`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="tasks-form-field">
                <span>Equipe</span>
                <select value={form.teamId} onChange={event => setForm({ ...form, teamId: event.target.value })}>
                  <option value="">Sem equipe</option>
                  {teams.map(team => (
                    <option key={team.id_equipe ?? team.id} value={team.id_equipe ?? team.id}>
                      {team.nomeEquipe}
                    </option>
                  ))}
                </select>
              </label>

              <div className="tasks-modal-footer">
                <button type="button" className="tasks-cancel-button" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="tasks-create-button">
                  <i className={`bi ${editingId === null ? 'bi-plus-lg' : 'bi-check-lg'}`} />
                  {editingId === null ? 'Criar tarefa' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}

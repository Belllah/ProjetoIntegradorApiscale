import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Perfil.css'

const initialProfile = {
  name: 'Isabella',
  initials: 'IS',
//  photoUrl: '',
  role: 'Analista de Operações',
  department: 'Operações & Processos • Apiscale',
  location: 'Indaiatuba, SP',
  email: 'isabella@gmail.com',
  bio: 'Acompanhando metas mensais, indicadores e entregas em equipe com consistência diária no Apiscale.',
  level: 'Nível 4 · Aprendiz',
  streakDays: 7,
  completedGoals: 18,
  activeTeams: 2,
  points: '1.250',
  skills: ['Gestão de Metas', 'Operações & Processos', 'Indicadores', 'Trabalho em Equipe', 'Organização'],
  milestones: [
    {
      id: 1,
      period: 'Esta semana',
      title: '7 dias de ofensiva mantidos',
      description: 'Atualizou metas e avançou nas entregas sem quebrar a sequência diária.',
      badge: 'Ofensiva',
    },
    {
      id: 2,
      period: 'Outubro',
      title: '1.250 pontos acumulados',
      description: 'Participação ativa nas metas da equipe Operações & Processos.',
      badge: 'Pontuação',
    },
    {
      id: 3,
      period: 'Etapa atual',
      title: 'Evolução no Nível 4 · Aprendiz',
      description: 'Focada na conclusão de metas e fortalecimento do mascote da jornada.',
      badge: 'Trajetória',
    },
  ],
}

export default function Perfil() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(initialProfile)
  const [draft, setDraft] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [notice, setNotice] = useState(null)

  // Estados da alteração de senha
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const showNotice = (text) => {
    setNotice(text)
    setTimeout(() => setNotice(null), 3000)
  }

  const handleEdit = () => {
    setDraft(profile)
    setIsEditing(true)
    setNotice(null)
  }

  const handleCancel = () => {
    setDraft(profile)
    setIsEditing(false)
  }
  
  // tira a foto de perfil
  const handleChange = (e) => {
    const { name, value } = e.target
    setDraft((prev) => ({ ...prev, [name]: value }))
  }
  // tira a foto de perfil

/*   const handleChange = (e) => {
    const { name, value } = e.target
    setDraft((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((prev) => ({ ...prev, photoUrl: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  } */

  const handleRemovePhoto = () => {
    setDraft((prev) => ({ ...prev, photoUrl: '' }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    const cleanName = draft.name.trim() || profile.name
    const parts = cleanName.split(/\s+/)
    const computedInitials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : cleanName.slice(0, 2).toUpperCase()

    setProfile({
      ...draft,
      name: cleanName,
      initials: computedInitials,
    })
    setIsEditing(false)
    showNotice('Informações do perfil atualizadas com sucesso.')
  }

  const handlePasswordInput = (e) => {
    const { name, value } = e.target
    setPasswords((prev) => ({ ...prev, [name]: value }))
    if (passwordError) setPasswordError('')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordError('Preencha todos os campos de senha.')
      return
    }
    if (passwords.next.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('A confirmação da nova senha não confere.')
      return
    }

    setPasswords({ current: '', next: '', confirm: '' })
    setIsChangingPassword(false)
    setPasswordError('')
    showNotice('Senha alterada com sucesso.')
  }

  const handleLogout = () => {
    // Limpe tokens/storage aqui quando conectar a autenticação
    navigate('/sair')
  }

  // const activePhoto = isEditing ? draft.photoUrl : profile.photoUrl
  const activeInitials = isEditing ? draft.initials : profile.initials

  return (
    <section className="profile-page" aria-label="Meu perfil">
      {notice && (
        <div className="profile-alert" role="status">
          <i className="bi bi-check-circle-fill" />
          <span>{notice}</span>
        </div>
      )}

      {/* Cartão Principal (Foto/Iniciais + Nome + Botão Editar no topo) */}
      <div className="profile-hero-card">
        <div className="profile-identity">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-lg">
              {/* {activePhoto ? (
                <img src={activePhoto} alt={`Foto de ${profile.name}`} className="profile-avatar-img" />
              ) : ( */}
                <span>{activeInitials}</span>
              {/* )} */}
            </div>

            {/* {isEditing && (
              <label className="profile-avatar-edit-badge" title="Alterar foto de perfil">
                <i className="bi bi-camera-fill" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
              </label>
            )} */}
          </div>

          <div className="profile-identity-info">
            <div className="profile-badge-row">
              <span className="profile-pill primary">
                <i className="bi bi-lightning-charge-fill" /> {profile.level}
              </span>
              <span className="profile-pill soft">
                <i className="bi bi-fire" /> {profile.streakDays} dias de ofensiva
              </span>
            </div>

            <h2>{profile.name}</h2>
            <p className="profile-role">{profile.role}</p>
            <p className="profile-meta">
              <span><i className="bi bi-building" /> {profile.department}</span>
              <span><i className="bi bi-geo-alt" /> {profile.location}</span>
            </p>

            {/* {isEditing && draft.photoUrl && (
              <button type="button" className="btn-remove-photo" onClick={handleRemovePhoto}>
                Remover foto atual
              </button>
            )} */}
          </div>
        </div>

        <div className="profile-hero-actions">
          {!isEditing ? (
            <button type="button" className="btn-profile-primary" onClick={handleEdit}>
              <i className="bi bi-pencil-square" />
              <span>Editar perfil</span>
            </button>
          ) : (
            <div className="edit-action-group">
              <button type="button" className="btn-profile-ghost" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" form="profile-form" className="btn-profile-primary">
                <i className="bi bi-check2" />
                <span>Salvar alterações</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-trophy-fill" />
          </div>
          <div>
            <strong>{profile.points}</strong>
            <span>Pontos acumulados</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-check2-circle" />
          </div>
          <div>
            <strong>{profile.completedGoals}</strong>
            <span>Metas concluídas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people-fill" />
          </div>
          <div>
            <strong>{profile.activeTeams}</strong>
            <span>Equipes ativas</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal em Duas Colunas */}
      <div className="profile-grid">
        {/* Coluna Esquerda: Informações + Segurança & Conta */}
        <div className="profile-main-stack">
          <div className="profile-card">
            <div className="card-header-row">
              <div>
                <h3>Informações profissionais</h3>
                <p>Dados exibidos na plataforma e no contexto das suas equipes.</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Nome completo</span>
                  <span className="info-value">{profile.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cargo / Atuação</span>
                  <span className="info-value">{profile.role}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Área / Organização</span>
                  <span className="info-value">{profile.department}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">E-mail</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Localização</span>
                  <span className="info-value">{profile.location}</span>
                </div>
                <div className="info-bio">
                  <span className="info-label">Sobre a trajetória</span>
                  <p>{profile.bio}</p>
                </div>
              </div>
            ) : (
              <form id="profile-form" className="profile-form" onSubmit={handleSave}>
                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="name">Nome completo</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={draft.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="location">Localização</label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={draft.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="role">Cargo / Atuação</label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={draft.role}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">E-mail</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={draft.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="department">Área / Organização</label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    value={draft.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="bio">Sobre a trajetória</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={draft.bio}
                    onChange={handleChange}
                  />
                </div>
              </form>
            )}
          </div>

          {/* Card de Segurança, Senha e Deslogar */}
          <div className="profile-card">
            <div className="card-header-row card-header-split">
              <div>
                <h3>Segurança e acesso</h3>
                <p>Gerencie sua senha de acesso ou encerre sua sessão.</p>
              </div>

              {!isChangingPassword && (
                <button
                  type="button"
                  className="btn-profile-ghost"
                  onClick={() => {
                    setIsChangingPassword(true)
                    setPasswordError('')
                  }}
                >
                  <i className="bi bi-key" />
                  <span>Alterar senha</span>
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <div className="security-summary">
                <div className="info-item">
                  <span className="info-label">Senha da conta</span>
                  <span className="info-value">••••••••••••</span>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handlePasswordSubmit}>
                <div className="form-field">
                  <label htmlFor="current">Senha atual</label>
                  <input
                    id="current"
                    name="current"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Digite sua senha atual"
                    value={passwords.current}
                    onChange={handlePasswordInput}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="next">Nova senha</label>
                    <input
                      id="next"
                      name="next"
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Mínimo de 6 caracteres"
                      value={passwords.next}
                      onChange={handlePasswordInput}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="confirm">Confirmar nova senha</label>
                    <input
                      id="confirm"
                      name="confirm"
                      type={showPasswords ? 'text' : 'password'}
                      placeholder="Repita a nova senha"
                      value={passwords.confirm}
                      onChange={handlePasswordInput}
                    />
                  </div>
                </div>

                <label className="password-toggle-check">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                  />
                  <span>Mostrar senhas</span>
                </label>

                {passwordError && (
                  <p className="password-error" role="alert">
                    <i className="bi bi-exclamation-circle" /> {passwordError}
                  </p>
                )}

                <div className="password-form-actions">
                  <button
                    type="button"
                    className="btn-profile-ghost"
                    onClick={() => {
                      setIsChangingPassword(false)
                      setPasswords({ current: '', next: '', confirm: '' })
                      setPasswordError('')
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-profile-primary">
                    Atualizar senha
                  </button>
                </div>
              </form>
            )}

            <div className="logout-divider">
              <div>
                <strong>Encerrar sessão</strong>
                <p>Desconectar sua conta deste dispositivo.</p>
              </div>
              <button type="button" className="btn-logout" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right" />
                <span>Deslogar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Trajetória & Competências */}
        <div className="profile-side-stack">
          <div className="profile-card">
            <div className="card-header-row">
              <div>
                <h3>Trajetória e marcos</h3>
                <p>Evolução recente dentro da plataforma.</p>
              </div>
            </div>

            <div className="timeline-list">
              {profile.milestones.map((item) => (
                <article key={item.id} className="timeline-item">
                  <div className="timeline-top">
                    <span className="timeline-period">{item.period}</span>
                    <span className="timeline-tag">{item.badge}</span>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header-row">
              <div>
                <h3>Competências e focos</h3>
                <p>Áreas em destaque no seu perfil.</p>
              </div>
            </div>

            <div className="skills-wrap">
              {profile.skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
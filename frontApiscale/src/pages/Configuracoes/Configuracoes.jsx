import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './Configuracoes.css'

export default function Configuracoes() {
  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/funcionarios`
  const navigate = useNavigate()
  const { user, setUser } = useUser()

  const [email, setEmail] = useState('')

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  })

  const [preferences, setPreferences] = useState({
    notificacoesTarefas: true,
    lembretesOfensiva: true,
    evolucaoMascote: true,
    resumoSemanal: false,
  })

  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (!user) return
    setEmail(user.email || '')
    setPreferences({
      notificacoesTarefas: user.notificacoesTarefas ?? true,
      lembretesOfensiva: user.lembretesOfensiva ?? true,
      evolucaoMascote: user.evolucaoMascote ?? true,
      resumoSemanal: user.resumoSemanal ?? false,
    })
  }, [user])

  async function salvarNoBackend(dadosAtualizados, mensagemSucesso) {
    if (!user?.id) {
      showStatus('danger', 'Usuário não identificado.')
      return false
    }

    try {
      const payload = {
        ...user,
        ...dadosAtualizados,
      }

      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar alterações')
      }

      const data = await response.json().catch(() => null)
      setUser(data || payload)
      showStatus('success', mensagemSucesso)
      return true
    } catch (error) {
      showStatus('danger', 'Erro ao atualizar os dados no servidor.')
      return false
    }
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  function handleToggle(key) {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function showStatus(type, text) {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4000)
  }

  async function handleSaveEmail(e) {
    e.preventDefault()
    await salvarNoBackend({ email }, 'E-mail de acesso atualizado com sucesso!')
  }

  async function handleSavePassword(e) {
    e.preventDefault()

    if (!passwordData.senhaAtual || !passwordData.novaSenha) {
      showStatus('danger', 'Preencha a senha atual e a nova senha.')
      return
    }


    if (passwordData.novaSenha.length < 6) {
      showStatus('danger', 'A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      showStatus('danger', 'A confirmação de senha não confere.')
      return
    }

    const sucesso = await salvarNoBackend(
      { senha: passwordData.novaSenha },
      'Senha alterada com sucesso!'
    )

    if (sucesso) {
      setPasswordData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' })
    }
  }

  async function handleSavePreferences() {
    await salvarNoBackend(preferences, 'Preferências salvas com sucesso!')
  }

  return (
    <section className="config-page">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
        <div>
          <h2 className="page-title">Configurações</h2>
          <p className="page-subtitle">
            Gerencie seu acesso, notificações e privacidade da conta.
          </p>
        </div>

        <span className="config-badge">
          <i className="bi bi-shield-check" /> Conta ativa
        </span>
      </div>

      {feedback && (
        <div
          className={`alert alert-${feedback.type} config-alert d-flex align-items-center gap-2`}
          role="alert"
        >
          <i
            className={`bi ${feedback.type === 'success'
                ? 'bi-check-circle-fill'
                : 'bi-exclamation-triangle-fill'
              }`}
          />
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="row g-3 justify-content-center">
        <div className="col-xl-7 d-flex flex-column gap-3">
          <article className="panel">
            <div className="panel-header-row">
              <div>
                <h3 className="panel-title mb-1">Acesso à Conta</h3>
                <p className="small muted mb-0">
                  E-mail utilizado para login e recebimento de avisos importantes.
                </p>
              </div>
              <span className="stat-icon">
                <i className="bi bi-envelope-at" />
              </span>
            </div>

            <form onSubmit={handleSaveEmail} className="row g-3 mt-1">
              <div className="col-12">
                <label className="form-label config-label">E-mail de login</label>
                <input
                  type="email"
                  className="form-control config-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-12 d-flex justify-content-end mt-3">
                <button type="submit" className="primary-button">
                  <i className="bi bi-check2 me-1" /> Atualizar e-mail
                </button>
              </div>
            </form>
          </article>

          <article className="panel">
            <div className="panel-header-row">
              <div>
                <h3 className="panel-title mb-1">Alterar Senha</h3>
                <p className="small muted mb-0">
                  Mantenha sua conta protegida com uma senha forte.
                </p>
              </div>
              <span className="stat-icon">
                <i className="bi bi-key" />
              </span>
            </div>

            <form onSubmit={handleSavePassword} className="row g-3 mt-1">
              <div className="col-12">
                <label className="form-label config-label">Senha atual</label>
                <input
                  type="password"
                  name="senhaAtual"
                  placeholder="Digite sua senha atual"
                  className="form-control config-input"
                  value={passwordData.senhaAtual}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label config-label">Nova senha</label>
                <input
                  type="password"
                  name="novaSenha"
                  placeholder="Mínimo de 6 caracteres"
                  className="form-control config-input"
                  value={passwordData.novaSenha}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label config-label">Confirmar nova senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  placeholder="Repita a nova senha"
                  className="form-control config-input"
                  value={passwordData.confirmarSenha}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="col-12 d-flex justify-content-end mt-3">
                <button type="submit" className="secondary-button">
                  <i className="bi bi-lock me-1" /> Salvar nova senha
                </button>
              </div>
            </form>
          </article>
        </div>

        <div className="col-xl-7 d-flex flex-column gap-3">
          <article className="panel">
            <h3 className="panel-title mb-2">Privacidade e Sessão</h3>
            <div className="danger-box">
              <div>
                <strong>Encerrar sessão</strong>
                <small>Desconectar sua conta deste navegador com segurança.</small>
              </div>
              <button
                type="button"
                className="danger-outline-button"
                onClick={() => {
                  localStorage.removeItem('apiscale_funcionario_id')
                  navigate('/sair')
                }}
              >
                <i className="bi bi-box-arrow-right me-1" /> Sair
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
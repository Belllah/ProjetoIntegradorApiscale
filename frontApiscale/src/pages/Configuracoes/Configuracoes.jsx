import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './Configuracoes.css'

const PREFS_STORAGE_KEY = 'apiscale-preferences'

export default function Configuracoes() {
  const { isDark, setDarkTheme } = useTheme()

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY))
      return {
        notificacoesTarefas: saved?.notificacoesTarefas ?? true,
        lembretesOfensiva: saved?.lembretesOfensiva ?? true,
        evolucaoMascote: saved?.evolucaoMascote ?? true,
        temaEscuro: isDark,
      }
    } catch {
      return {
        notificacoesTarefas: true,
        lembretesOfensiva: true,
        evolucaoMascote: true,
        temaEscuro: isDark,
      }
    }
  })

  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      temaEscuro: isDark,
    }))
  }, [isDark])


  function handleToggle(key) {
    if (key === 'temaEscuro') {
      const nextValue = !preferences.temaEscuro
      setDarkTheme(nextValue)
      setPreferences(prev => ({ ...prev, temaEscuro: nextValue }))
    } else {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  function showStatus(type, text) {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4000)
  }
  
  function handleSavePreferences() {
    setDarkTheme(preferences.temaEscuro)
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences))
    showStatus('success', 'Preferências salvas com sucesso!')
  }

  return (
    <section className="config-page">
      <div className="row justify-content-center">
        <div className="col-12 col-md-9 col-lg-7 col-xl-5 d-flex flex-column gap-3">
          {feedback && (
            <div
              className={`alert alert-${feedback.type} config-alert d-flex align-items-center gap-2 mb-0`}
              role="alert"
            >
              <i
                className={`bi ${
                  feedback.type === 'success'
                    ? 'bi-check-circle-fill'
                    : 'bi-exclamation-triangle-fill'
                }`}
              />
              <span>{feedback.text}</span>
            </div>
          )}

          <article className="panel">
            <div className="panel-header-row">
              <div>
                <h3 className="panel-title mb-1">Preferências</h3>
                <p className="small muted mb-0">
                  Defina avisos da plataforma e aparência da interface.
                </p>
              </div>
              <span className="stat-icon">
                <i className="bi bi-sliders" />
              </span>
            </div>

            <div className="toggle-list mt-3">
              <div className="toggle-item">
                <div>
                  <strong>Alertas de tarefas</strong>
                  <small>Avisar quando uma nova tarefa for atribuída ou vencer em breve.</small>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input config-switch"
                    type="checkbox"
                    checked={preferences.notificacoesTarefas}
                    onChange={() => handleToggle('notificacoesTarefas')}
                  />
                </div>
              </div>

              <div className="toggle-item">
                <div>
                  <strong>Lembrete de ofensiva</strong>
                  <small>Receber lembrete diário para manter sua sequência ativa.</small>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input config-switch"
                    type="checkbox"
                    checked={preferences.lembretesOfensiva}
                    onChange={() => handleToggle('lembretesOfensiva')}
                  />
                </div>
              </div>

              <div className="toggle-item">
                <div>
                  <strong>Evolução do mascote</strong>
                  <small>Notificar quando seu dragão ganhar XP ou evoluir.</small>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input config-switch"
                    type="checkbox"
                    checked={preferences.evolucaoMascote}
                    onChange={() => handleToggle('evolucaoMascote')}
                  />
                </div>
              </div>

              <div className="toggle-item">
                <div>
                  <strong>Tema escuro</strong>
                  <small>Alterna a interface entre modo claro e modo escuro.</small>
                </div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input config-switch"
                    type="checkbox"
                    checked={preferences.temaEscuro}
                    onChange={() => handleToggle('temaEscuro')}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="primary-button w-100"
                onClick={handleSavePreferences}
              >
                Salvar preferências
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
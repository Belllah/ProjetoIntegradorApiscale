
import './Mascote.css'

export default function Mascote() {
  const mascote = {
    nome: 'Auron',
    especie: 'Dragão Glacial',
    nivel: 4,
    raridade: 'Filhote',
    experiencia: 650,
    experienciaMaxima: 1000,
    progresso: 65,
  }

  return (
    <section className="mascote-page">

      {/* Cabeçalho da página */}
      <div className="mascote-heading">
        <div>
          <span className="mascote-kicker">SUA JORNADA</span>
          <h2 className="page-title">Meu Mascote</h2>
          <p className="page-subtitle">
            Conheça seu companheiro e acompanhe sua evolução.
          </p>
        </div>
      </div>

      {/* Palco principal do dragão */}
      <article className="dragon-stage">

        {/* Vídeo de fundo */}
        <video
          className="dragon-video"
          src="assets/videos/DragonAnimationTwo.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-label="Animação do dragão Auron"
        />

        {/* Camada de iluminação */}
        <div className="dragon-overlay"></div>

        {/* Informações superiores */}
        <div className="dragon-floating-info">

          {/* Painel esquerdo */}
          <div className="dragon-glass-card dragon-identification">
            <span className="glass-label">
              <i className="bi bi-stars"></i>
              SEU COMPANHEIRO
            </span>

            <h1>{mascote.nome}</h1>
            <p>{mascote.especie}</p>

            <span className="dragon-rarity">
              {mascote.raridade}
            </span>
          </div>

          {/* Painel direito */}
          <div className="dragon-glass-card dragon-level-card">
            <span className="glass-label">
              <i className="bi bi-lightning-charge-fill"></i>
              DESENVOLVIMENTO
            </span>

            <div className="dragon-level-number">
              <strong>{String(mascote.nivel).padStart(2, '0')}</strong>
              <span>NÍVEL</span>
            </div>

            <div className="dragon-mini-xp">
              <div>
                <span>Experiência</span>
                <strong>{mascote.progresso}%</strong>
              </div>

              <div className="dragon-mini-progress">
                <div
                  style={{ width: `${mascote.progresso}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

        {/* Mensagem inferior */}
        <div className="dragon-stage-footer">
          <span className="dragon-stage-status">
            EM DEMONSTRAÇÃO
          </span>
        </div>

      </article>

      {/* Progresso de evolução */}
      <article className="dragon-evolution-card">

        <div className="evolution-heading">
          <div>
            <span className="mascote-kicker">PRÓXIMA CONQUISTA</span>
            <h3>Evolução do companheiro</h3>
          </div>

          <span className="evolution-percentage">
            {mascote.progresso}%
          </span>
        </div>

        <div className="evolution-details">
          <span>
            {mascote.experiencia} / {mascote.experienciaMaxima} XP
          </span>

          <span>Próximo estágio: Jovem dragão</span>
        </div>

        <div className="dragon-evolution-progress">
          <div
            style={{ width: `${mascote.progresso}%` }}
          ></div>
        </div>

        <p>
          <i className="bi bi-info-circle"></i>
          Conclua suas tarefas e alcance novas metas para
          desbloquear a próxima evolução do seu mascote.
        </p>

      </article>

      {/* Atributos e conquistas */}
      <div className="dragon-details-grid">

        <article className="dragon-detail-card">
          <span className="detail-icon">
            <i className="bi bi-gem"></i>
          </span>
          <div>
            <small>RARIDADE</small>
            <strong>Em desenvolvimento</strong>
          </div>
        </article>

        <article className="dragon-detail-card">
          <span className="detail-icon teal">
            <i className="bi bi-trophy-fill"></i>
          </span>
          <div>
            <small>HISTÓRICO DE EVOLUÇÕES</small>
            <strong>Em desenvolvimento</strong>
          </div>
        </article>

        <article className="dragon-detail-card">
          <span className="detail-icon purple">
            <i className="bi bi-award"></i>
          </span>
          <div>
            <small>ESPÉCIE</small>
            <strong>Em desenvolvimento</strong>
          </div>
        </article>

      </div>

    </section>
  )
}

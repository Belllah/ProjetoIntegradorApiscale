//import { useLocation } from 'react-router-dom'
import './Header.css'
import { useUser } from '../../context/UserContext'
import { useTheme } from '../../context/ThemeContext'
import { Link, useLocation } from 'react-router-dom'//mudando aqui é pra usar a rota quando clica na foto

const titles = {
  '/': ['Dashboard', 'Acompanhe sua evolução e suas conquistas.'],
  '/mascote': ['Meu mascote', 'Cuide do seu dragão e acompanhe cada etapa da evolução.'],
  '/equipes': ['Equipes', 'Acompanhe o desenvolvimento coletivo.'],
  '/perfil': ['Meu perfil', 'Suas informações e trajetória profissional.'],
  '/tarefas': ['Tarefas', 'Organize suas metas e acompanhe suas entregas.'],
  '/configuracoes': ['Configurações', 'Personalize sua experiência no Apiscale.'],
}
export default function Header({ onMenuClick }) {
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] ?? titles['/']
  const { user, initials } = useUser() //puxa o perfil do banco
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="top-header">
      <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Abrir menu"><i className="bi bi-list" /></button>
      <div className="header-heading"><span className="header-eyebrow">APISCALE</span><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="header-actions">
        <button
          className="header-icon theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
          title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
        >
          <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon'}`} />
        </button>

        {/* <button className="user-avatar" aria-label="Perfil do usuário">IS</button> */}
        {/* <Link to="/perfil" className="user-avatar" aria-label="Perfil do usuário">IS</Link> */}{/* troca o botao do perfil pra link com rota */}

        <Link to="/perfil"className="user-avatar"aria-label="Perfil do usuário"title={user?.nome ? `Perfil de ${user.nome}` : 'Meu perfil'}>{initials}</Link> {/* Agora além de rota, a foto vai ser do usuário do banco */}
        
      </div>
    </header>
  )
}
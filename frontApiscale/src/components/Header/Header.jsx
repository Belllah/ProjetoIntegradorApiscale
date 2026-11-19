import { useLocation } from 'react-router-dom'
import './Header.css'

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
  return (
    <header className="top-header">
      <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Abrir menu"><i className="bi bi-list" /></button>
      <div className="header-heading"><span className="header-eyebrow">APISCALE</span><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="header-actions">
        <button className="header-icon" aria-label="Notificações"><i className="bi bi-moon" /></button>
        <button className="user-avatar" aria-label="Perfil do usuário">IS</button>
      </div>
    </header>
  )
}
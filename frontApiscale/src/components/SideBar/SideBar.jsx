import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const links = [
  { to: '/', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  { to: '/mascote', icon: 'bi-egg-fill', label: 'Mascote' },
  { to: '/equipes', icon: 'bi-people-fill', label: 'Equipes' },
  { to: '/perfil', icon: 'bi-person-circle', label: 'Perfil' },
  { to: '/tarefas', icon: 'bi-list-check', label: 'Tarefas' },
  { to: '/configuracoes', icon: 'bi-gear-fill', label: 'Configurações' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <button className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Fechar menu" />
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <NavLink to="/" className="sidebar-brand" onClick={onClose} aria-label="Apiscale - início">
          <img src="/assets/images/logocortada.png" alt="Apiscale" />
        </NavLink>
        <nav className="sidebar-nav" aria-label="Menu principal">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title={link.label}>
              <i className={`bi ${link.icon}`} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom"><span className="sidebar-status-dot" /> Apiscale</div>
      </aside>
    </>
  )
}
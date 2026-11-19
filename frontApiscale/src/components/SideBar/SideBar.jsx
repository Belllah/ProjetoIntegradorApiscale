import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const links = [
  { to: '/', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  { to: '/mascote', icon: 'bi-egg-fill', label: 'Mascote' },
  { to: '/equipes', icon: 'bi-people-fill', label: 'Equipes' },
    { to: '/tarefas', icon: 'bi-list-check', label: 'Tarefas' },
  { to: '/perfil', icon: 'bi-person-circle', label: 'Perfil' },
  { to: '/configuracoes', icon: 'bi-gear-fill', label: 'Configurações' },
  { to: '/sair', icon: 'bi-box-arrow-in-right', label: 'Sair' },
]

export default function Sidebar({ expanded, onToggle, onClose }) {
  return (
    <>
      <button className={`sidebar-backdrop ${expanded ? 'visible' : ''}`} onClick={onClose} aria-label="Fechar menu" tabIndex={expanded ? 0 : -1}/>

      <aside className={`sidebar ${expanded ? 'sidebar-expanded' : ''}`}>
        <button
          className="sidebar-brand"
          onClick={onToggle}
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
          aria-expanded={expanded}
          title={expanded ? 'Recolher menu' : 'Expandir menu'}
        >
          <img
            src={ expanded ? "/assets/images/logo.png" : "/assets/images/logocortada.png"}
            alt="Logo do Sistema Apiscale"
          />
        </button>
         <nav className="sidebar-nav" aria-label="Menu principal">

          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              data-label={link.label}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              title={!expanded ? link.label : undefined}
            >
              <i className={`bi ${link.icon}`} />

              <span>{link.label}</span>
            </NavLink>
          ))}

        </nav>
      </aside>
    </>
  )
}
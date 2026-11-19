
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import './Layout.css'
import Sidebar from '../SideBar/SideBar.jsx'
import Header from '../Header/Header.jsx'


export default function Layout() {

  // Controla a expansão do menu
  const [menuExpanded, setMenuExpanded] = useState(false)

  // Abre ou recolhe a Sidebar
  const toggleMenu = () => {
    setMenuExpanded(value => !value)
  }

  // Fecha o menu somente em telas mobile
  const closeMobileMenu = () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      setMenuExpanded(false)
    }
  }

  return (
    <div className={`app-shell ${menuExpanded ? 'menu-expanded' : ''}`}>

      {/* Menu lateral */}
      <Sidebar
        expanded={menuExpanded}
        onToggle={toggleMenu}
        onClose={closeMobileMenu}
      />

      {/* Conteúdo principal */}
      <div className="app-main">

        <Header onMenuClick={toggleMenu} />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

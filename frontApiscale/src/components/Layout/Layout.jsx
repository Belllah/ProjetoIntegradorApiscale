import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar.jsx'
import Header from '../Header/Header.jsx'
import './Layout.css'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-main">
        <Header onMenuClick={() => setMenuOpen(value => !value)} />
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  )
}
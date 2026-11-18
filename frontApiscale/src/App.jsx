import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Mascote from './pages/Mascote/Mascote.jsx'
import Equipes from './pages/Equipes/Equipe.jsx'
import Tarefas from './pages/Tarefas/Tarefas.jsx'
import Perfil from './pages/Perfil/Perfil.jsx'
import Configuracoes from './pages/Configuracoes/Configuracoes.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/mascote" element={<Mascote />}/>
          <Route path="/equipes" element={<Equipes />}/>
          <Route path="/tarefas" element={<Tarefas />}/>
          <Route path="/perfil" element={<Perfil />}/>
          <Route path="/configuracoes" element={<Configuracoes />}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

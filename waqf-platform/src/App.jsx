import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Diwan from './pages/Diwan'
import Investisseurs from './pages/Investisseurs'
import Diaspora from './pages/Diaspora'
import Etrangers from './pages/Etrangers'
import Toast from './components/Toast'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/diwan" element={<Diwan />} />
        <Route path="/investisseurs" element={<Investisseurs />} />
        <Route path="/diaspora" element={<Diaspora />} />
        <Route path="/etrangers" element={<Etrangers />} />
      </Routes>
      <Toast />
    </>
  )
}

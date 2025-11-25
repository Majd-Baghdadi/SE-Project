import './App.css'
import { BrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <NavBar />
        <main style={{ padding: '1rem', flex: 1 }}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

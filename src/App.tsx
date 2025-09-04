import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FurnitureList from './pages/FurnitureList'
import FurnitureDetail from './pages/FurnitureDetail'
import ContactList from './pages/ContactList'
import ContactDetail from './pages/ContactDetail'

function App() {
  return (
    <Router>
      <div className="mobile-container">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/furniture" element={<FurnitureList />} />
            <Route path="/furniture/:id" element={<FurnitureDetail />} />
            <Route path="/contacts" element={<ContactList />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App

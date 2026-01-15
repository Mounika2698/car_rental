import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        {/* Producted routes */}
        <Route path="/Dashboard" element={
          <ProtectedRoutes><Dashboard /> </ProtectedRoutes>
        } />
      </Routes>
    </Router>
  )
}

export default App;

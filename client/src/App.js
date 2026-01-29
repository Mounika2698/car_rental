import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/book/:carId" element={<Booking />} />
        {/* Producted routes */}
        <Route path="/Dashboard" element={
          <ProtectedRoutes><Dashboard /> </ProtectedRoutes>
        } />
      </Routes>
    </Router>
  )
}

export default App;

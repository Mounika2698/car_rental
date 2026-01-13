import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Producted routes */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
        <Route path="/" element={
          <ProtectedRoutes><Home /> </ProtectedRoutes>
        } />
      </Routes>
    </Router>
  )
}

export default App;

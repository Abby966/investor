import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './auth/Login';
import Signup from './auth/Signup';

function PrivateRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <h1 className="text-center mt-20 text-3xl font-bold">Dashboard Placeholder</h1>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

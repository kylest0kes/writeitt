import './App.scss';
import Header from './Components/Header/Header';
import { AuthProvider } from './Contexts/AuthContext';
import { UserProvider } from './Contexts/UserContext';
import TheRoutes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div>
            <Header />
            <TheRoutes />
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>

  );
}

export default App;

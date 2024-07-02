import './App.scss';
import Header from './Components/Header/Header';
import LeftSideMenu from './Components/LeftSideMenu/LeftSideMenu';
import { AuthProvider } from './Contexts/AuthContext';
import { UserProvider } from './Contexts/UserContext';
import TheRoutes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="app-container">
              <Header />
              <div className="content-wrapper">
                <LeftSideMenu />
                <div className="main-content">
                  <TheRoutes />
                </div>
              </div>
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>

  );
}

export default App;

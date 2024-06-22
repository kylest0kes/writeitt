import './App.scss';
import Header from './Components/Header/Header';
import { AuthProvider } from './Contexts/AuthContext';
import { UserProvider } from './Contexts/UserContext';
import TheRoutes from './Routes';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div>
          <Header />
          <TheRoutes />
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;

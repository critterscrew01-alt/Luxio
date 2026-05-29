import { Switch, Route, useLocation } from 'wouter';
import { createContext, useContext, useState } from 'react';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ApplyWL from './pages/ApplyWL';
import CheckRole from './pages/CheckRole';
import Mint from './pages/Mint';
import { Navbar } from './components/Navbar';

// ─── Global user context ──────────────────────────────────────────────────────
type UserCtx = { xUsername: string; setXUsername: (v: string) => void };
export const UserContext = createContext<UserCtx>({ xUsername: '', setXUsername: () => {} });
export const useUser = () => useContext(UserContext);

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const FontLoader = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Bangers&display=swap"
      rel="stylesheet"
    />
  </>
);

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { xUsername } = useUser();
  const [, navigate] = useLocation();
  if (!xUsername) {
    navigate('/');
    return null;
  }
  return <Component />;
}

export default function App() {
  const [location] = useLocation();

  // Restore username from localStorage so refresh doesn't reset auth
  const [xUsername, setXUsernameState] = useState(() => {
    try {
      return localStorage.getItem('x_username') || '';
    } catch {
      return '';
    }
  });

  const setXUsername = (v: string) => {
    setXUsernameState(v);
    try {
      if (v) localStorage.setItem('x_username', v);
      else localStorage.removeItem('x_username');
    } catch {}
  };

  const showNav = xUsername && location !== '/';

  return (
    <UserContext.Provider value={{ xUsername, setXUsername }}>
      <FontLoader />
      {showNav && <Navbar />}
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/home">
          {() => <ProtectedRoute component={Home} />}
        </Route>
        <Route path="/gallery">
          {() => <ProtectedRoute component={Gallery} />}
        </Route>
        <Route path="/apply">
          {() => <ProtectedRoute component={ApplyWL} />}
        </Route>
        <Route path="/check-role">
          {() => <ProtectedRoute component={CheckRole} />}
        </Route>
        <Route path="/mint">
          {() => <ProtectedRoute component={Mint} />}
        </Route>
        <Route>
          {() => { window.location.href = '/'; return null; }}
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}

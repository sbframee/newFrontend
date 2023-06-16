import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainAdmin from "./pages/MainAdmin/MainAdmin";
import UserView from "./pages/MainAdmin/UserView";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route exact path="/" element={ <LoginPage /> } />
        <Route path="/admin" element={<MainAdmin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

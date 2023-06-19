import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainAdmin from "./pages/MainAdmin/MainAdmin";
import UserView from "./pages/MainAdmin/UserView";
import Items from "./pages/Master/Items";
export const server = "http://localhost:9000";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route exact path="/" element={ <LoginPage /> } />
        <Route path="/admin" element={<MainAdmin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserView />} />
        <Route path= "/admin/listOrder" element={<Items />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainAdmin from "./pages/MainAdmin/MainAdmin";
import UserView from "./pages/MainAdmin/UserView";
import Orders from "./pages/Master/Orders";
import Customers from "./pages/Master/Customers";
import Groups from "./pages/Master/Groups";
import Items from "./pages/Master/Items";
import Item_Groups from "./pages/Master/Item_Groups";
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
        <Route path= "/admin/orderList" element={<Orders />} />
        <Route path= "/admin/customerList" element={<Customers />} />
        <Route path= "/admin/ItemList" element={<Items />} />
        <Route path= "/admin/item_groupList" element={<Item_Groups />} />
        <Route path= "/admin/groupList" element={<Groups />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import React, { useMemo, useState } from "react";
import "./style.css";
import NavLink from "./Navlink";
import {
  AutoAwesomeMosaicOutlined as MasterIcon,
  AssessmentOutlined as ReportsIcon,
  FlashOn as QuickAccessIcon,
  SettingsOutlined as SettingsIcon,
  UpgradeOutlined,
} from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useLocation } from "react-router-dom";
let titleData = [
  { value: "itemCategory", name: "Item Category" },
  { value: "credentials", name: "Organization Data" },
  { value: "item", name: "Item" },
  { value: "admin", name: "DASHBOARD" },
];
const Sidebar = ({ setIsItemAvilableOpen }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const updateMinLevel = async () => {
    if (loading) return;
    setLoading(true);
    const response = await axios({
      method: "get",
      url: "MinLevelUpdate",

      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.result.user_type);
    setLoading(false);
  };
  document.title = useMemo(() => {
    let title = titleData.find((a) => location.pathname.includes(a.value));

    return title.name || "BT";
  }, [location]);
  return (
    <div
      className="left-panel"
      style={{ position: "relative", zIndex: "9000000" }}
    >
      <div className="nav" style={{ height: "100vh",marginTop:"80px" }}>
        <NavLink
          title={"Master"}
          icon={<MasterIcon sx={{ fontSize: 50 }} />}
          isActive={true}
          menuList={[
            {
              name: "Customers",
              link: "/admin/customerList",
            },
            {
              name: "Items",
              link: "/admin/itemList",
            },
            {
              name: "Users",
              link: "/admin/userList",
            },
            {
              name: "User_Groups",
              link: "/admin/user_group",
            },
            {
              name: "User_Role",
              link: "/admin/userRole",
            },
            {
              name: "Supplier",
              link: "/admin/supplier",
            },
            {
              name: "Supplier_Group",
              link: "/admin/supplier_group",
            },
            {
              name: "Orders",
              link: "/admin/orderList",
            },
            {
              name: "Groups",
              link: "/admin/groupList",
            },
            {
              name: "Item_Groups",
              link: "/admin/item_groupList",
            },
            
          ]}
        />
      </div>
    </div>
  );
};

export default Sidebar;

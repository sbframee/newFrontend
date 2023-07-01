import React, { useMemo } from "react";
import "./style.css";
import NavLink from "./Navlink";
import {
  AutoAwesomeMosaicOutlined as MasterIcon,
} from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useLocation } from "react-router-dom";
import PaidIcon from '@mui/icons-material/Paid';
let titleData = [
  { value: "itemCategory", name: "Item Category" },
  { value: "credentials", name: "Organization Data" },
  { value: "item", name: "Item" },
  { value: "admin", name: "DASHBOARD" },
];
const Sidebar = () => {
  const location = useLocation();
  
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
              name: "User Group",
              link: "/admin/user_group",
            },
            {
              name: "User Role",
              link: "/admin/userRole",
            },
            {
              name: "Supplier",
              link: "/admin/supplier",
            },
            {
              name: "Supplier Group",
              link: "/admin/supplier_group",
            },
            {
              name: "Orders",
              link: "/admin/orderList",
            },
            {
              name: "Customer Group",
              link: "/admin/groupList",
            },
            {
              name: "Item Group",
              link: "/admin/item_groupList",
            },
            
          ]}
        />
        <NavLink
          title={"Report"}
          icon={<AssessmentIcon sx={{ fontSize: 50 }} />}
          isActive={false}
          menuList={[
            {
              name: "Customers",
              link: "/admin/customerReport",
            },
            {
              name: "Items",
              link: "/report/itemReport",
            },
            {
              name: "Supplier",
              link: "/admin/supplierReport",
            }, 
          ]}
        />
        <NavLink
          title={"Receipt"}
          icon={<PaidIcon sx={{ fontSize: 50 }} />}
          isActive={false}
          menuList={[
            {
              name: "Customers",
              link: "/admin/customerReceipt",
            }, 
          ]}
        />
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { Box, styled, Tab, Tabs } from "@mui/material";
import "./style.css";

const Navbar = ({ filterItems, orderList }) => {
  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      "&.Mui-selected": {
        color: "#4ac959",
        borderBottom: `2px solid #4ac959`,
      },
    })
  );

  const handleTabChange = (event, newValue) => {
    filterItems(newValue);
  };

  return (
    
    <div className="layout">
      <Box>
        <Tabs
          variant="scrollable"
          aria-label="scrollable force styled tabs  example"
          indicatorColor="#000"
          onChange={handleTabChange}
        >
          {orderList.map((curElem) => (
            <StyledTab key={curElem} label={curElem} value={curElem} />
          ))}
        </Tabs>
      </Box>
    </div>
  );
};

export default Navbar;

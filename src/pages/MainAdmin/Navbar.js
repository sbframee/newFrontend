import React from "react";
import { Box, styled, Tab, Tabs } from "@mui/material";

const Navbar = ({ filterItems, orderList }) => {
  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      color: "white",
      "&.Mui-selected": {
        color: "white",
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
          indicatorColor="0000"
          onChange={handleTabChange}
          style={{ background: "#4AC959", color: "white" }}
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

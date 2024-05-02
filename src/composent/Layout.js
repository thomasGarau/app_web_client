import React from "react";
import Header from "./Header";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';



function Layout({ children }) {

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <div style={{height: "100%"}}>{children}</div>
      </LocalizationProvider>
  );
}

export default Layout;
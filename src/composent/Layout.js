import React from "react";
import Header from "./Header";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function Layout({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Header />
      <div>{children}</div>
    </LocalizationProvider>
  );
}

export default Layout;
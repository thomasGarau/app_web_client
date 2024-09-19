import { Typography } from "@mui/material";

const PageContainer = ({ title, children }) => (
    <div className='background'>
      <div className='base-container'>
        <Typography sx={{ fontSize: { xs: "2em", sm: "3em", md: "4em" }, margin: "0px" }}>{title}</Typography>
        {children}
      </div>
    </div>
  );
  
  export default PageContainer;
  
import { 
  Box
} from "@chakra-ui/react";

import {
  FaHome,  
} from 'react-icons/fa';

import { 
  LuSettings,
  LuSearch
 } from "react-icons/lu";

const SideBar = () => {

  return (
    <Box className="sidebar-box">
      <div className="logo">
        <a href="/">Dataox</a>
      </div>

      <div className="icons">
        <div>
          <a href="/dashboard"><FaHome /></a>
        </div>
        <div>
          <a href="/search"><LuSearch /></a>
        </div>
        <div>
          <a href="/settings"><LuSettings /></a>
        </div>
      </div>
    </Box>
  )
}

export default SideBar
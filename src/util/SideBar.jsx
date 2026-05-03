import { 
  Box
} from "@chakra-ui/react";

import { 
  FaRetweet,
  FaBookOpenReader,
  FaRegFileLines,
  FaUser 
} from "react-icons/fa6";

const SideBar = () => {

  return (
    <Box className="sidebar-box">
      <div className="logo">
        <a href="/">Data<span className="dataxo">XO</span></a>
      </div>

      <div className="icons">
        <div>
          <a href="/dashboard"><FaUser /></a>
        </div>
        <div>
          <a href="/converter"><FaRetweet /></a>
        </div>
        <div>
          <a href="/tune"><FaBookOpenReader /></a>
        </div>
        <div>
          <a href="/tune"><FaRegFileLines /></a>
        </div>
      </div>
    </Box>
  )
}

export default SideBar
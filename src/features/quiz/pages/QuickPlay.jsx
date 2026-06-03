import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { QuizContext } from "../../../util/Contexts";
import { FaHome } from "react-icons/fa";
import Navbar from "../../../util/Navbar";
import SoloPlay from "../components/SoloPlay"; 
import Sidebar from "../../../util/Sidebar";

const QuickPlay = () => {
  const { 
    isLoading,
  } = useContext(QuizContext);

  const textStyle = {
    fontSize: '1.2rem'
  }

  return isLoading ? (<Box className="question-page" sx={{
    minH: '100vh',
    bgColor: '#fff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDir: 'column'
  }}>
    <Box>
      <Text 
        sx={textStyle}>Please wait 
        <span className="loadingOne">.</span> 
        <span className="loadingTwo">.</span>
        <span className="loadingThree">.</span>
      </Text>
    </Box>
  </Box>) : (
    <Box sx={{
      minH: '100vh',
      bgColor: '#fff',
      color: '#000'
    }}>
      <Box>
        <Sidebar />

          <Box className="main" sx={{
            maxW: '600px',
            m: '0 auto'
          }}>
            <Navbar />
            <SoloPlay />
        </Box>
      </Box>
    </Box>
  )
}

export default QuickPlay
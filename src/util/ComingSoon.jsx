import { 
    Box
} from "@chakra-ui/react";

import { 
    FaRocket 
} from "react-icons/fa6";

const ComingSoon = () => {
  return (
    <Box className="coming-soon">
        <div className="rocket"><FaRocket /></div>
        <div className="contianer-tune">
            <h1>Coming Soon!</h1>
            <p>Exciting new features are on the way. Stay tuned!</p>
        </div>
    </Box>
  )
}

export default ComingSoon
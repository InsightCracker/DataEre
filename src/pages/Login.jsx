import { 
  Box,
  Text,
  Input,
  useToast 
} from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../Helpers/Contexts";

const Login = () => {
  const { 
    name, 
    setName
  } = useContext(QuizContext);
  const toast = useToast();

  const flexStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    bgColor: '#e5e5e5',
    color: 'blue.800',
    margin: '10px auto',
    p: '7px'
  }

  const navigate = useNavigate();

  const login = () => {
    name !== '' && navigate('/dashboard');
  }

  const emptyToast = () => {
    name === '' && toast({
      title: '',
      description: 'Enter Name',
      status: 'error',
      duration: '2000',
      position: 'bottom-left'
    }); 
 }

  return (
    <Box className="login-page" id="login">
      <Box className="login-card">
          <h2>DATAXO</h2>

          <p>Enter your Name:</p>

          <div className="form">
            <Input 
              sx={{
                mb: '.5rem',
                color: '#fff'
              }}
              value={name}
              variant={'filled'}
              placeholder={'InsightCracker'}
              onChange={(e) => setName(e.target.value)}
              type={'text'} 
            />

            <Box className="btn-primary" onClick={() => {
              emptyToast()
              login()
            }} sx={flexStyle}>
              <Text>Welcome</Text>
            </Box>
          </div>
      </Box>
    </Box>
  )
}

export default Login
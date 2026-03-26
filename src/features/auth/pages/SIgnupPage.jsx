import '../styles/auth.css'

import { 
  Box,
  Text,
  Input,
  InputGroup,
  useToast,
  InputLeftElement,
  InputRightElement,
  IconButton
} from "@chakra-ui/react";

import { 
  ViewIcon, 
  ViewOffIcon 
} from "@chakra-ui/icons";

import { 
  LuMail,
  LuLock
} from "react-icons/lu"

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../../util/Contexts";

const SignupPage = () => {
  const [show, setShow] = useState(false);
  const togglePassword = () => setShow(!show);

  const { 
    email, 
    setEmail,
    password,
    setPassword
  } = useContext(QuizContext);

  const toast = useToast();

  const flexStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    color: 'blue.800',
    margin: '10px auto',
    p: '7px'
  }

  const navigate = useNavigate();

  const login = () => {
    email !== '' && navigate('/users/profile');
  }

  const emptyToast = () => {
    email === '' && toast({
      title: '',
      description: 'Enter Details',
      status: 'error',
      duration: '2000',
      position: 'bottom-left'
    }); 
 }

  return (
    <Box className="login-page" id="login">

      <Text className="logo">Data<span className="dataxo">Ere</span></Text>

      <Box className="login-card">
          <h2>Create your free account and grow your data skills.</h2>
          <div className="form">
            <div>
              <p>E-mail address:</p>

                <div className="input">
                  <InputGroup>
                    <InputLeftElement>
                      <LuMail />
                    </InputLeftElement>
                    <Input 
                      sx={{
                        mb: '.5rem',
                      }}
                      value={email}
                      variant={'outline'}
                      onChange={(e) => setEmail(e.target.value)}
                      type={'email'} 
                      borderColor={"#a8a8a8"}
                      borderWidth={"2px"}
                    />
                  </InputGroup>
                </div>
            </div>

            <div>
              <p>Password</p>

              <div className="input">
                <InputGroup>
                  <InputLeftElement>
                    <LuLock />
                  </InputLeftElement>

                  <Input 
                    sx={{
                      mb: '.5rem',
                    }}
                    value={password}
                    variant={'outline'}
                    type={show ? "text" : "password"} 
                    onChange={(e) => setPassword(e.target.value)}
                    borderColor={"#a8a8a8"}
                    borderWidth={"2px"}
                  />

                   <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      onClick={togglePassword}
                      icon={show ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label="Toggle password visibility"
                    />
                  </InputRightElement>
                </InputGroup>
              </div>
            </div>

            <Box className="btn-primary" onClick={() => {
              emptyToast()
              login()
            }} sx={flexStyle}>
              <Text>Get Started</Text>
            </Box>
          </div>
      </Box>

      <Box className='login-card mini'>
        <p>Already have an account? <span><a href="/users/login">Sign in.</a></span></p>
      </Box>
    </Box>
  )
}

export default SignupPage
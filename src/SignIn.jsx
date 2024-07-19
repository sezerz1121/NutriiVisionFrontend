import React, { useState, useEffect,useRef,memo} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion,useAnimation,useInView} from 'framer-motion';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function SignIn() {
  const navigate = useNavigate();
  const RegisterNav =()=>
  {
      navigate('/register');
  }
  const one = useRef(null);
  const two = useRef(null);
  const three = useRef(null);
  const four = useRef(null);
  const five = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, 20, 0, -20, 0],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0,
      },
    });
  }, [controls]);
    //animation above
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const handleChange=(e)=>
        
        {
            e.preventDefault();
            const{name,value}= e.target;
            if(name==='email')
            {
                setEmail(value);
            }
            else
            {
                setPassword(value);
            }
        }
        const handleGoogleLoginError = () => {
            console.log('Login Failed');
        };
        const handleGoogleLoginSuccess = async (credentialResponse) => {
            const token = credentialResponse.credential;
            const decoded = jwtDecode(token);
            
            try {
              const registerResponse = await axios.post(`${import.meta.env.VITE_APIURL}/users/register`, {
                email: decoded.email,
                password:decoded.name

              });
              if (registerResponse.data.message === "user registered succesfully") {
                
        
                
                const signInResponse = await axios.post(`${import.meta.env.VITE_APIURL}/users/SignIn`, { 
                  email: decoded.email,
                  password:decoded.name
                });
        
                
                if (signInResponse.data.message === "user logged in successfully") {
                  localStorage.setItem("accessToken", signInResponse.data.data.accessToken);
                  localStorage.setItem("refreshToken", signInResponse.data.data.refreshToken);
                  navigate("/home"); 
                } else {
                  console.log("User does not exist");
                }
                
              } 
            } catch (error) {
              console.error("Error:",error );
              if (error.response.data.message === "Username or Email already exist") {
                
                
                const signInResponse = await axios.post(`${import.meta.env.VITE_APIURL}/users/SignIn`, { // Corrected the URL to signin
                  
                  email: decoded.email,
                  password:decoded.name
                });
        
                if (signInResponse.data.message === "user logged in successfully") {
                  
                  localStorage.setItem("accessToken", signInResponse.data.data.accessToken);
                  localStorage.setItem("refreshToken", signInResponse.data.data.refreshToken);
                  navigate("/home"); 
                } else {
                  console.log("Sign in failed")
                }
              }
            }
          };

          const handleSubmit = async () => {
            try {

        
                
                const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/signin`, { email, password });
                  localStorage.setItem("accessToken", response.data.data.accessToken);
                  localStorage.setItem("refreshToken", response.data.data.refreshToken);
        
                
                
                navigate('/home');
                
            } catch (error) {
                console.error('Error :', error);
                
            }
        };


        useEffect(() => {
          const fetchData = async () => {
            try {
              const token = localStorage.getItem("accessToken");
              console.log()
              if (!token) {
                console.error("Token not found in localStorage");
                return;
              }
      
              const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/redirect`,
                {}, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
      
              console.log(response);
      
              // Set redirectTo state if user is logged in
              if (response.data.data=="user exist") {
                navigate('/home');
                  // Replace '/dashboard' with the desired route
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          };
      
          fetchData();
        }, [navigate]);

    
  return (
<>
    <div className='Page'>
    
        <img className='PizzaImage' src='/Images/Pizza.png'/>
        <motion.img  animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={one} drag dragConstraints={one} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:0}} className='NoodlesImage' src='/Images/Noodles.png' />
        <motion.img   animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={two} drag dragConstraints={two} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:3}} className='SandwichImage' src='/Images/Sandwich.png'/>
        <motion.img   animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={three} drag dragConstraints={three} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:1}} className='ColaImage' src='/Images/Cola.png'/>
        <motion.img   animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={four} drag dragConstraints={four} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:1.5}} className='PavImage' src='/Images/Pav.png'/>
        <motion.img   animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={five} drag dragConstraints={five} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:2}} className='AlooImage' src='/Images/Aloo.png'/>
        <div className='Form'>
            <div className='LOGO'>
                <img src='/Images/LOGO.png'/>
                <div>NutriiVision</div>
            </div>
            <input className='InputField' name='email' type='email'  onChange={handleChange}  placeholder='Email' value={email}/>
            <input className='InputField' name='password' type='password'  onChange={handleChange}  placeholder='Password' value={password}/>
            <div className='Button' onClick={handleSubmit}><p>Sign in</p></div>
            <div className='UnderOR'>
            <div className='UnderLine'></div>
            <div> <p>OR</p></div>
            <div className='UnderLine'></div>
            </div>
            <div className='GoogleSignIn'>
            <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
            </div>
            <div className='PageRedirection'><p>New Here? <span className='blue' onClick={RegisterNav}>Create an Account with Email</span></p></div>
        </div>


    </div>
</>
  )
}

export default SignIn

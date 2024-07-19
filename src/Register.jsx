import React, { useState, useEffect,useRef,memo} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion,useAnimation,useInView} from 'framer-motion';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import SignIn from './SignIn';

function Register() {
    const navigate = useNavigate();
    const SignInNav =()=>
    {
        navigate('/');
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
    const[cpassword,setCPassword]=useState("");
    const handleChange=(e)=>
        
        {
            e.preventDefault();
            const{name,value}= e.target;
            if(name==='email')
            {
                setEmail(value);
            }
            else if (name==='password')
            {
                setPassword(value);
            }
            else  
            {
                    setCPassword(value);
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
              if (password !== cpassword) {

              }
      
              
              const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/register`, { email, password });
              console.log('User created:', response.data);
      
              
              
              navigate('/');
              
          } catch (error) {
              console.error('Error creating User:', error);
              
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
                <p>NutriiVision</p>
            </div>
            <input className='InputField' name='email' type='email'  onChange={handleChange}  placeholder='Email' value={email}/>
            <input className='InputField' name='password' type='password'  onChange={handleChange}  placeholder='Password' value={password}/>
            <input className='InputField' name='confirm' type='password'  onChange={handleChange}  placeholder='Confirm Password' value={cpassword}/>
            <div className='Button' onClick={handleSubmit}><p>Register</p></div>
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
            <div className='PageRedirection'><p>Already have an account? <span className='blue' onClick={SignInNav}> Sign in here</span></p></div>
        </div>


    </div>
</>
  )
}

export default Register
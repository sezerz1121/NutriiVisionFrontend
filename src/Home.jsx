import React, { useState, useEffect, useRef, memo } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import DragAndDropFileBox from './component/DragAndDropFileBox.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Dropdown from "./component/Dropdown.jsx";
import axios from 'axios';

function Home() {
  const three = useRef(null);
  const navigate = useNavigate();
  const [userId, setUser] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formattedText, setFormattedText] = useState("");
  const [isActiveProfile, setIsActiveProfile] = useState(false);

  const animationSequence = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -50, 0],
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        y: { duration: 0.4, ease: 'easeInOut' },
        rotate: { duration: 0.6, ease: 'easeInOut' }
      }
    }
  };

  const handleFileDrop = (file) => {
    setImageFile(file);
  };

  const handleProfile = () => {
    setIsActiveProfile(!isActiveProfile);
  }

  const handleClick = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      if (imageFile && userId) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('imageScan', imageFile);

        const response = await axios.post(`${import.meta.env.VITE_APIURL}/scanner/scan`, formData);

        console.log('response:', response.data);

        if (response.data.message === true) {
          setImageFile(null);
        }

        if (response.data.data) {
          formatReceivedText(response.data.data); // Format the received text
        }
      } else {
        console.error('No image or user ID available for scanning.');
      }
    } catch (error) {
      console.error('Error scanning image:', error);
    }
  };

useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('Token not found in localStorage');
          navigate('/');
          return;
        }

        const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/redirect`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);

        if (response.data.data === 'user exist') {
          setUser(response.data.message.userId);
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.data.data === 'user does not exist') {
          setUser(response.data.message.userId);
          navigate('/');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Function to format the received text
  const formatReceivedText = (text) => {
    // Replace **bold** with <strong>bold</strong>
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
    setFormattedText(formatted);
  };

  return (
    <div className='Homepage'>
      <div className='navbar'>
        <div className='Logodiv'>
          <div className='LOGO'>
            <img src='/Images/LOGO.png' alt='Logo' />
            <p>NutriiVision</p>
          </div>
        </div>
        <div className='menu' onClick={handleProfile}> 
          <RxHamburgerMenu />
        </div>
      </div>
      <div className='Imagesubmit'>
        <DragAndDropFileBox onFilesDrop={handleFileDrop} />
        <div className='Scanbutton' onClick={handleClick}>
          Scan
          <motion.img
            variants={animationSequence}
            initial='initial'
            animate={isAnimating ? 'animate' : 'initial'}
            className='Buttonsandwitch'
            src='/Images/Buttonsandwitch.png'
            alt='Button'
          />
        </div>
      </div>
      { 
        formattedText === "" ? null : (
          <motion.div
            className='Text-box'
            dangerouslySetInnerHTML={{ __html: formattedText }} // Render HTML content safely
            initial={{ opacity: 0, y: -20 }}  // Initial animation state
            animate={{ opacity: 1, y: 0 }}    // Animation state
            transition={{ duration: 0.5 }}   // Animation transition duration
            style={{ fontSize: '16px' }}     // Example style
          />
        )
      }
      <div>
        { isActiveProfile ? <Dropdown userId={userId} /> : "" }
      </div>
    </div>
  );
}

export default memo(Home);

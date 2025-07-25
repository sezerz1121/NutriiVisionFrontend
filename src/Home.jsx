import React, { useState, useEffect, useRef, memo } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import DragAndDropFileBox from './component/DragAndDropFileBox.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Dropdown from './component/Dropdown.jsx';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [userId, setUser] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formattedText, setFormattedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveProfile, setIsActiveProfile] = useState(false);

  const animationSequence = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -50, 0],
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        y: { duration: 0.4, ease: 'easeInOut' },
        rotate: { duration: 0.6, ease: 'easeInOut' },
      },
    },
  };

  const handleFileDrop = (file) => {
    setImageFile(file);
    setFormattedText('');
  };

  const handleProfile = () => {
    setIsActiveProfile(!isActiveProfile);
  };

  const handleClick = async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    if (!imageFile || !userId) {
      console.error('No image or user ID available for scanning.');
      return;
    }

    try {
      setIsLoading(true); // Start loading

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('imageScan', imageFile);

      const response = await axios.post(`${import.meta.env.VITE_APIURL}/scanner/scan`, formData);
      console.log('response:', response.data);

      if (response.data.message === true) {
        setImageFile(null);
      }

     if (response.data.data) {
        let raw = response.data.data;

        // Clean raw input: Remove triple backticks and leading 'json' if present
        raw = raw
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        console.log("cleaned raw", raw);

        try {
          const parsed = JSON.parse(raw);
          console.log("parsed", parsed);
          formatReceivedText(parsed);
        } catch (err) {
          console.error("Error parsing JSON:", err);
          setFormattedText('<b>Worng format </b> error not able to fix format');
        }
      }

    } catch (error) {
      console.error('Error scanning image:', error);
    } finally {
      setIsLoading(false); // End loading
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

        const response = await axios.post(
          `${import.meta.env.VITE_APIURL}/users/redirect`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.data === 'user exist') {
          setUser(response.data.message.userId);
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.data?.data === 'user does not exist') {
          navigate('/');
        }
      }
    };

    fetchData();
  }, [navigate]);

const formatReceivedText = (json) => {
  try {
    const {
      food = 'Unknown',
      nutrition_per_serving = 'N/A',
      recipes = [],
      youtube_videos = [],
      note = ''
    } = json;

    const html = `
      <div class="Text-box">
        <b>This looks like:</b> ${food}<br><br>
        <b>Nutritional Information (per serving):</b><br>${nutrition_per_serving.replace(/\n/g, '<br>')}<br><br>
        <b>Recipe Suggestions:</b>
        <ul>
          ${recipes.map((r) => {
            // If it's a URL, make it a link. If not, show as plain text.
            const isURL = /^https?:\/\//.test(r.trim());
            return `<li>${isURL ? `<a target="_blank" href="${r}">${r}</a>` : r}</li>`;
          }).join('')}
        </ul>
        <b>YouTube Videos:</b>
        <ul>
          ${youtube_videos.map((v) => `<li><a target="_blank" href="${v.link}">${v.title}</a></li>`).join('')}
        </ul>
        ${note}
      </div>
    `;

    setFormattedText(html);
  } catch (err) {
    console.error('Error formatting response JSON:', err);
    setFormattedText('<b>Worng format </b> error not able to fix format');
  }
};



  return (
    <div className="Homepage">
      <div className="navbar">
        <div className="Logodiv">
          <div className="LOGO">
            <img src="/Images/LOGO.png" alt="Logo" />
            <p>NutriiVision</p>
          </div>
        </div>
        <div className="menu" onClick={handleProfile}>
          <RxHamburgerMenu />
        </div>
      </div>

      <div className="Imagesubmit">
        <DragAndDropFileBox onFilesDrop={handleFileDrop} />
        <div className="Scanbutton" onClick={handleClick}>
          Scan
          <motion.img
            variants={animationSequence}
            initial="initial"
            animate={isAnimating ? 'animate' : 'initial'}
            className="Buttonsandwitch"
            src="/Images/Buttonsandwitch.png"
            alt="Button"
          />
        </div>
      </div>

      {isLoading && (
        <div
          className="Text-box"
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            marginTop: '20px',
          }}
        >
          Scanning... Please wait.
        </div>
      )}

      {!isLoading && formattedText !== '' && (
        <motion.div
          className="Text-box"
          dangerouslySetInnerHTML={{ __html: formattedText }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '16px' }}
        />
      )}

      {isActiveProfile && <Dropdown userId={userId} />}
    </div>
  );
}

export default memo(Home);

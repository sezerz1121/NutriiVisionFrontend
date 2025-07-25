import React, { useState, useEffect, useMemo } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from './component/Dropdown';
import Card from './component/Card';

const History = () => {
  const navigate = useNavigate();
  const [userId, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [isActiveProfile, setIsActiveProfile] = useState(false);
  const [food, setFood] = useState('');

  const handleProfile = () => {
    setIsActiveProfile(!isActiveProfile);
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const responseHistory = await axios.post(
          `${import.meta.env.VITE_APIURL}/users/getHistory`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setHistory(responseHistory.data.message);

        if (response.data.data === 'user exist') {
          setUser(response.data.message.userId);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response?.data?.data === 'user does not exist') {
          navigate('/');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const onFoodValue = (value) => {
    setFood(value);
  };

  const filteredHistory = useMemo(() => {
    if (!food) return [...history].reverse();

    return [...history].reverse().filter(item => {
      try {
        const match = item.text.match(/```json\s*([\s\S]*?)\s*```/);
        if (!match) return false;

        const parsed = JSON.parse(match[1]);
        const foodName = parsed?.food?.toLowerCase() || '';

        return foodName.includes(food.toLowerCase());
      } catch (err) {
        return false;
      }
    });
  }, [food, history]);

const generatePdf = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('Token not found in localStorage');
    navigate('/');
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APIURL}/users/getPdf`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

      const pdfUrl = response.data?.data?.pdfUrl;
      console.log(pdfUrl)
    window.open(pdfUrl, "_blank");
  } catch (err) {
    console.error("Failed to generate PDF", err?.response?.data || err.message);
    alert("Something went wrong while generating the report.");
  }
};


  return (
    <>
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

      {isActiveProfile && <Dropdown userId={userId} />}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search food name..."
          onChange={(e) => onFoodValue(e.target.value)}
          value={food}
        />

        <div className='PDF' onClick={generatePdf}>
          AI PDF of your last 7 days food scans
        </div>
      </div>

      <div className="HistoryGird">
        {filteredHistory.map((item) => (
          <Card key={item._id} data={item} />
        ))}
      </div>
    </>
  );
};

export default History;

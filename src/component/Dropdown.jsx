import React from 'react'
import { MdOutlineLogout } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { FaHome } from "react-icons/fa";

import { Link, useNavigate  } from "react-router-dom";
import { VscHistory } from "react-icons/vsc";
import axios from 'axios';
function Dropdown(props) {
    const navigate = useNavigate();
    const HandleLogOut = async() => {

        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`${import.meta.env.VITE_APIURL}/users/signout`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        localStorage.removeItem('accessToken');
        navigate("/");
        
        
      };
      const HandleHistory= ()=>
      {
        navigate('/history')
      }
      const HandleHome= ()=>
      {
        navigate('/home')
      }

  return (
    <>
        <div className='DropDown'>
           <div className='DropDownHistory' onClick={HandleHome}><div className='DropDownHistoryicon'><FaHome /></div><p>Home</p></div>
            <div className='DropDownHistory' onClick={HandleHistory}><div className='DropDownHistoryicon'><FaHistory /></div><p>History</p></div>
            <div className='DropDownHistory' onClick={HandleLogOut}><div className='DropDownHistoryicon'><PiSignOutBold /></div><p>SignOut</p></div>

        </div>
    </>
  )
}

export default Dropdown ;
import React, { useState, useEffect,useRef,memo} from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { motion,useAnimation,useInView} from 'framer-motion';

function DragAndDropFileBox({ onFilesDrop }) {
  const [highlight, setHighlight] = useState(false);
  const [file, setFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setHighlight(true);
  };

  const handleDragLeave = () => {
    setHighlight(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setHighlight(false);
    const files = Array.from(e.dataTransfer.files);
    handleFile(files[0]);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFile(files[0]);
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    if (onFilesDrop) {
      onFilesDrop(selectedFile); // Passing the File object to the parent component
    }
  };

  const handleFileClick = () => {
    document.getElementById('file-input').click();
  };
  const one = useRef(null);
  const four = useRef(null);
  const three = useRef(null);
  return (
    <div 
      
      className={`file-drop-box ${highlight ? 'highlight' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileClick}
    >
      {file ? (
        <div className="uploaded-file">
        <img src={URL.createObjectURL(file)} alt="Uploaded" />
          <p>{file.name}</p>
        </div>
      ) : (
        <div className="uploaded-file">
          <IoCloudUploadOutline className="icon-cloud" />
          <p className='DragDrop'>Drag & Drop or </p>
          <label htmlFor="file-input">
            <span className="browse-link">Click here to browse</span>
          </label>
        </div>
      )}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
     <motion.img  animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={one} drag dragConstraints={one} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:0}} className='NoodlesImage1' src='/Images/Noodles.png' />
     <motion.img   animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={three} drag dragConstraints={three} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:1}} className='ColaImage1' src='/Images/Cola.png'/>
     <motion.img   animate={{ y: [0, 20, 0, -20, 0], rotate: [0, 2, 0, -2, 0], }} ref={four} drag dragConstraints={four} transition={{duration: 5,repeat: Infinity,ease: "easeInOut", delay:1.5}} className='PavImage1' src='/Images/Pav.png'/>
    </div>
  );
}

export default DragAndDropFileBox;

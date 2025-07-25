import React, { useState, useEffect } from 'react';

const Card = (props) => {
  const foodData = props.data;
  console.log(foodData)
  const [formattedText, setFormattedText] = useState('');

  // Function to format received JSON into a readable HTML string
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
        <strong>This looks like:</strong> ${food} <br/>
       
      `;
      setFormattedText(html);
    } catch (err) {
      console.error('Error formatting response JSON:', err);
      setFormattedText('<b>Worng format </b> error not able to fix format');
    }
  };

  // On mount or when foodData changes, process the raw JSON
  useEffect(() => {
    if (foodData?.text) {
      let raw = foodData.text;
      
      // Clean raw input: Remove triple backticks and leading 'json' if present
      raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const parsed = JSON.parse(raw);
        formatReceivedText(parsed);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        setFormattedText('<b>Worng format </b> error not able to fix format');
      }
    }
  }, [foodData]);

  return (
    <div className="Card">
      <img src={foodData.image} alt="food" />
      <div className="card-text" dangerouslySetInnerHTML={{ __html: formattedText }} />
    </div>
  );
};

export default Card;

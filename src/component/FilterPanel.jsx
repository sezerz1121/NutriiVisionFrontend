// FilterPanel.jsx
import React from 'react';

const FilterPanel = ({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-xl font-bold mb-2">Filters</h3>
      
      <div className="mb-4">
        <label className="font-semibold">Category:</label>
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="w-full mt-1">
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold">Price Range:</label>
        <input type="range" min={0} max={1000} step={10}
          value={priceRange} onChange={(e) => onPriceChange(Number(e.target.value))} />
        <div>Up to ₹{priceRange}</div>
      </div>
    </div>
  );
};

export default FilterPanel;

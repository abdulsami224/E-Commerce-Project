import { useState, useEffect, useRef } from 'react';

const PriceRangeSlider = ({ min, max, value, onChange }) => {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);
  const debounceRef = useRef(null);

  // sync when parent resets
  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value[0], value[1]]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(val);
    debounce([val, localMax]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(val);
    debounce([localMin, val]);
  };

  // debounce so API not called on every slider move
  const debounce = (vals) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(vals);
    }, 400);
  };

  // calculate fill percentage for track
  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  return (  
  <div className="flex items-center gap-3 w-full">

    {/* Left price */}
    <span className="text-xs font-semibold text-primary-500 whitespace-nowrap flex-shrink-0">
      Rs. {localMin.toLocaleString()}
    </span>

    {/* Slider track — takes full width */}
    <div className="relative flex-1 h-5 flex items-center">
      <div className="absolute w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div
        className="absolute h-1.5 bg-primary-500 rounded-full"
        style={{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={localMin}
        onChange={handleMinChange}
        className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-primary-500
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-webkit-slider-thumb]:transition-transform"
        style={{ zIndex: localMin > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={localMax}
        onChange={handleMaxChange}
        className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-primary-500
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-webkit-slider-thumb]:transition-transform"
        style={{ zIndex: 4 }}
      />
    </div>

    {/* Right price */}
    <span className="text-xs font-semibold text-primary-500 whitespace-nowrap flex-shrink-0">
      Rs. {localMax.toLocaleString()}
    </span>

  </div>
  );
};

export default PriceRangeSlider;
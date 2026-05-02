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
    <div className="flex flex-col gap-3 w-full">

      {/* Price display */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Price Range
        </span>
        <span className="text-xs font-semibold text-primary-500">
          Rs. {localMin.toLocaleString()} — Rs. {localMax.toLocaleString()}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-5 flex items-center">

        {/* Gray background track */}
        <div className="absolute w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />

        {/* Red filled track between thumbs */}
        <div
          className="absolute h-1.5 bg-primary-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        />

        {/* Min thumb */}
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

        {/* Max thumb */}
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

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>Rs. {min.toLocaleString()}</span>
        <span>Rs. {max.toLocaleString()}</span>
      </div>

    </div>
  );
};

export default PriceRangeSlider;
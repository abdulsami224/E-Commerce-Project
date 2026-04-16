import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return (
    <div className="w-full h-72 md:h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <p className="text-gray-400 text-sm">No image</p>
    </div>
  );

  if (images.length === 1) return (
    <img src={images[0].url} alt="product" className="w-full h-72 md:h-full object-cover" />
  );

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-72 md:h-full overflow-hidden">

      {/* Images */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img.url}   
            alt={`product-${i + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            style={{ minWidth: '100%' }}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white dark:hover:bg-gray-900 transition"
      >
        <ChevronLeft size={16} className="text-gray-700 dark:text-white" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white dark:hover:bg-gray-900 transition"
      >
        <ChevronRight size={16} className="text-gray-700 dark:text-white" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-2 bg-red-500'       // active dot — wider pill shape
                : 'w-2 h-2 bg-white/60 hover:bg-white/90'  // inactive dot
            }`}
          />
        ))}
      </div>

      {/* Image counter */}
      <span className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
        {current + 1} / {images.length}
      </span>

    </div>
  );
};

export default ImageSlider;
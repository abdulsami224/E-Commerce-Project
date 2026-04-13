import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const CategorySelect = ({ value, onChange, categories }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState('');

  const handleSelectChange = (e) => {
    if (e.target.value === '__add_new__') {
      setShowCustom(true);
      setCustomInput('');
      setError('');
    } else {
      setShowCustom(false);
      onChange(e.target.value);
    }
  };

  const handleCustomConfirm = () => {
    const trimmed = customInput.trim().toLowerCase(); 

    if (!trimmed) {
      setError('Category name cannot be empty');
      return;
    }

    if (categories.includes(trimmed)) {
      setError(`"${trimmed}" already exists. Select it from the list.`);
      return;
    }

    onChange(trimmed);       
    setShowCustom(false);
    setCustomInput('');
    setError('');
  };

  const handleCancel = () => {
    setShowCustom(false);
    setCustomInput('');
    setError('');
    onChange('');
  };

  const inputClass = "px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-sm w-full";

  return (
    <div className="flex flex-col gap-2">

      {!showCustom ? (
        // Normal select dropdown
        <div className="relative">
          <select
            value={value || ''}
            onChange={handleSelectChange}
            className={`${inputClass} appearance-none pr-10 cursor-pointer`}
          >
            <option value="" disabled>Select Category</option>

            {/* Existing categories from DB */}
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}

            {/* Divider + Add new option */}
            <option disabled>──────────────</option>
            <option value="__add_new__">+ Add New Category</option>
          </select>

          {/* Arrow icon */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : (
        // Custom category input
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Type new category name..."
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomConfirm()}
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleCustomConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition flex items-center gap-1 text-sm font-medium whitespace-nowrap"
            >
              <Plus size={14} /> Add
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 rounded-xl transition"
            >
              <X size={14} />
            </button>
          </div>

          {/* Live preview — shows lowercase */}
          {customInput && !error && (
            <p className="text-xs text-gray-400 px-1">
              Will be saved as: <span className="text-red-400 font-medium">"{customInput.trim().toLowerCase()}"</span>
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-500 px-1">{error}</p>
          )}
        </div>
      )}

      {/* Show selected value as badge */}
      {value && !showCustom && (
        <p className="text-xs text-gray-400 px-1">
          Selected: <span className="text-red-400 font-medium">"{value}"</span>
        </p>
      )}
    </div>
  );
};

export default CategorySelect;
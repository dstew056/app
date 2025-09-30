import React, { useState } from 'react';
import './styles.css'

function AutocompleteInput(props) {
  const options = props.options;
  const setValue = props.setValue
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setValue(value);

    // Filter suggestions based on the input
    const filteredSuggestions = options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Handle a suggestion being clicked
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setValue(suggestion);
    setIsFocused(false);
    setSuggestions([]); // Hide dropdown after selection
  };

  const handleFocus = () =>{
    const filteredSuggestions = options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    setIsFocused(true);
  }

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => {setIsFocused(false);}, 100)}
      />
      {/* Conditionally render the dropdown */}
      {isFocused && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;
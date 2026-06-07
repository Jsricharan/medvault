import React, { useState, useRef, useEffect } from 'react';
import countryCodes from '../utils/countryCodes';

function CountryCodePicker({ value, onChange }) {

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Find selected country
  const selectedCountry = countryCodes.find(
    c => c.code === value
  ) || countryCodes[0];

  // Filter countries based on search
  const filteredCountries = countryCodes.filter(c =>
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.code.includes(search)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current &&
          !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', minWidth: '130px' }}>

      {/* Selected Value Button */}
      <button
        type="button"
        className="btn btn-outline-secondary d-flex
                   align-items-center gap-2 w-100"
        style={{ height: '38px' }}
        onClick={() => setIsOpen(!isOpen)}>

        {/* Flag Image */}
        <img
          src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
          alt={selectedCountry.country}
          width="20"
          height="15"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        {/* Code */}
        <span className="fw-semibold">
          {selectedCountry.code}
        </span>

        {/* Arrow */}
        <span className="ms-auto">▼</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 9999,
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            width: '280px',
            maxHeight: '300px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>

          {/* Search Box */}
          <div style={{ padding: '8px' }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Country List */}
          <div style={{ overflowY: 'auto', maxHeight: '240px' }}>
            {filteredCountries.length === 0 ? (
              <div className="text-center text-muted py-3">
                No countries found
              </div>
            ) : (
              filteredCountries.map((c, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(c.code)}
                  className="d-flex align-items-center gap-2 px-3 py-2"
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      c.code === value ? '#e8f4fd' : 'white',
                    borderLeft:
                      c.code === value
                        ? '3px solid #0d6efd'
                        : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (c.code !== value) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (c.code !== value) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}>

                  {/* Flag */}
                  <img
                    src={`https://flagcdn.com/w20/${c.iso}.png`}
                    alt={c.country}
                    width="22"
                    height="16"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />

                  {/* Country Name */}
                  <span className="small flex-grow-1">
                    {c.country}
                  </span>

                  {/* Code */}
                  <span className="small text-muted fw-semibold">
                    {c.code}
                  </span>

                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default CountryCodePicker;
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import { getApiUrl } from './config';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
const CollectionDropdown = ({ label = '', value, onChange }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    axios
      .get(`${getApiUrl()}/collections`)
      .then((res) => {
        if (!isMounted) return;
        setCollections(res.data || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError('Failed to load collections');

        console.error(err);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    if (!loading && !error && collections.length > 0 && !value && typeof onChange === 'function') {
      onChange(collections[0]);
    }
  }, [loading, error, collections, value, onChange]);

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredCollections = normalizedQuery
    ? collections.filter((name) => name.toLowerCase().includes(normalizedQuery))
    : collections;


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    if (typeof onChange === 'function') onChange(name);
    setIsOpen(false);
  };

  const renderDropIcon = (isOpen) => {
    return isOpen ? <ArrowDropUp /> : <ArrowDropDown />;
  };

  return (
    <div className='col-md-12' >
      <div className='row input-bar' ref={dropdownRef}>
        {label && <label>{label}: </label>}
        <div
          className='select'
          onClick={() => !loading && !error && setIsOpen((o) => !o)}
          style={{ position: 'relative', cursor: loading || error ? 'not-allowed' : 'pointer', userSelect: 'none' }}
        >
            <div style={{ padding: '6px 8px', position: 'relative' }}>
              {loading ? 'Loading...' : value || 'Select a collection'}
              <IconButton
                style={{
                  position: 'absolute',
                  right: -30,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#888',
                  fontSize: 35,
                  zIndex: 1100
                }}
              >
                {renderDropIcon(isOpen)}
              </IconButton>
            </div>

          {isOpen && !loading && !error && (
            <div className='dropdown-menu' style={{ position: 'absolute', top: '100%', left: 0, right: 0, border: '1px solid #ccc', background: 'white', zIndex: 1000 }}
            >
              <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                <input
                  autoFocus
                  type='text'
                  placeholder='Search collections...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: 6, boxSizing: 'border-box' }}
                />
                
              </div>
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {filteredCollections.length === 0 ? (
                  <div style={{ padding: 8, color: '#666' }}>No matches</div>
                ) : (
                  filteredCollections.map((name) => (
                    <div
                      key={name}
                      onClick={() => handleSelect(name)}
                      style={{ padding: '8px 10px', cursor: 'pointer', background: name === value ? '#f0f7ff' : 'white' }}
                    >
                      {name}  
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
        </div>
        {error && (
          <div className='error' >
            {error}
          </div>
        )}
        
      </div>
      <div className='row d-flex align-items-center'>
       
      </div>
    </div>
  );
};

export default CollectionDropdown;
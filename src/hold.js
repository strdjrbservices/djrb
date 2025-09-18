import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Input from './inputbar';
import Logo from './logo.png'; // Ensure you have a logo.png in the src folder
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography, Container, Grid, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add, Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { getApiUrl } from './config';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});
  
  
  
  useEffect(() => {
    if (!selectedCollection) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`${getApiUrl()}/${selectedCollection}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, [selectedCollection]);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({ ...record });
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${getApiUrl()}/${selectedCollection}/${recordId}`);
        // Refresh data
        const response = await axios.get(`${getApiUrl()}/${selectedCollection}`);
        setData(response.data);
      } catch (err) {
        console.error('Error deleting record:', err);
        alert('Error deleting record');
      }
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving data:', formData);
      console.log('Selected collection:', selectedCollection);
      console.log('Editing record:', editingRecord);

      // Remove _id from formData before sending to avoid MongoDB errors
      const dataToSave = { ...formData };
      delete dataToSave._id;

      console.log('Data to save:', dataToSave);

      // Check if we have any data to save
      if (Object.keys(dataToSave).length === 0) {
        alert('Please fill in at least one field');
        return;
      }

      if (editingRecord) {
        console.log('Updating record with ID:', editingRecord._id);
        // Update existing record
        const response = await axios.put(`${getApiUrl()}/${selectedCollection}/${editingRecord._id}`, dataToSave);
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new record');
        // Add new record
        const response = await axios.post(`${getApiUrl()}/${selectedCollection}`, dataToSave);
        console.log('Create response:', response.data);
      }
      // Refresh data
      const response = await axios.get(`${getApiUrl()}/${selectedCollection}`);
      setData(response.data);
      setEditingRecord(null);
      setShowAddModal(false);
      setFormData({});
      alert('Record saved successfully!');
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      alert(`Error saving record: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const handleAddNew = () => {
    if (data.length > 0) {
      const sampleRecord = data[0];
      const newRecord = {};
      Object.keys(sampleRecord).forEach(key => {
        if (key !== '_id') {
          // Set default date for date fields
          if (key.toLowerCase().includes('date')) {
            newRecord[key] = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          } else {
            newRecord[key] = '';
          }
        }
      });
      setFormData(newRecord);
      setShowAddModal(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Container maxWidth="xl" sx={{ border:'none', background: 'none', boxShadow: 'none', marginTop: 2 }}>
        <Paper sx={{ padding: 3,  background: 'none', border:'none', marginBottom: 3 }}>
          <Grid container  alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <Box display="flex" justifyContent="center">
                <img src={Logo} alt="Logo" style={{ maxHeight: '60px', maxWidth: '100%' }} />
              </Box>
            </Grid>
            <Grid  item xs={12} sm={6} md={4}>
              <Typography variant="h4" component="h1" className='heading-title' sx={{marginLeft:'380px',marginRight:'auto', textAlign: 'center', fontWeight: 'bold',
                color: '#333', textShadow: '1px 1px 2px rgba(0,0,0,0.1)',  letterSpacing: '1px',fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }  

              }}>
                CLIENT'S INSTRUCTION
              </Typography> 
            </Grid>
          </Grid>
        </Paper>
        <Input
                value={selectedCollection}
                onChange={setSelectedCollection}
              />

        <Box sx={{ padding: 2 }}>
          {selectedCollection && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total Records: {data.length}
              </Typography>
              <Button
                className='add-new-button'
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddNew}
              >
                Add New Update
              </Button>
            </Box>
          )}
          
          {data.length > 0 && (
            <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  {Object.keys(data[0]).filter(key => key !== '_id').map((key, index) => (
                    <th key={index} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>
                      {key.toUpperCase()}
                    </th>
                  ))}
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((doc, docIndex) => (
                  <tr key={doc._id || docIndex} style={{ backgroundColor: docIndex % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    {Object.entries(doc).filter(([key]) => key !== '_id').map(([key, value], valueIndex) => (
                      <td key={valueIndex} style={{ padding: '8px', border: '1px solid #ddd' }}>
                        <pre style={{ 
                          margin: 0, 
                          whiteSpace: 'pre-wrap', 
                          wordWrap: 'break-word',
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </pre>
                      </td>
                    ))}
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(doc)}
                        size="small"
                        sx={{ margin: '0 2px' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(doc._id)}
                        size="small"
                        sx={{ margin: '0 2px' }}
                      >
                        <Delete />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </Box>
          )}
        </Box>
      </Container>

      {/* Edit/Add Modal */}
      <Dialog
        open={editingRecord || showAddModal}
        onClose={() => {
          setEditingRecord(null);
          setShowAddModal(false);
          setFormData({});
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {editingRecord ? 'Edit Record' : 'Add New Record'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
            {Object.keys(formData).map((field) => {
              const isDateField = field.toLowerCase().includes('date');
              const isCommentField = field.toLowerCase().includes('comment') || 
                                   field.toLowerCase().includes('remark') || 
                                   field.toLowerCase().includes('note') ||
                                   field.toLowerCase().includes('description');
              
              if (isCommentField) {
                return (
                  <TextField
                    key={field}
                    label={field.toUpperCase()}
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    multiline
                    rows={4}
                    error={!formData[field]}
                    helperText={!formData[field] ? 'This field is required' : 'Enter detailed comments or remarks'}
                  />
                );
              }
              
              return (
                <TextField
                  key={field}
                  label={field.toUpperCase()}
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  size="small"
                  type={isDateField ? 'date' : 'text'}
                  InputLabelProps={isDateField ? { shrink: true } : {}}
                  error={!formData[field]}
                  helperText={!formData[field] ? 'This field is required' : ''}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditingRecord(null);
              setShowAddModal(false);
              setFormData({});
            }}
            startIcon={<Cancel />}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            startIcon={<Save />}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;

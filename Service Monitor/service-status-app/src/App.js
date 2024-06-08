import React, { useState, useEffect } from 'react';
import ServiceList from './components/ServiceList';
import { Container, Typography } from '@mui/material';
import './App.css';

const App = () => {
  const [serviceStatus, setServiceStatus] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/status');
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const mappedStatus = data.map((service) => ({
        ...service,
        status: service.status === 'active' ? 'online' : 'offline',
      }));

      setServiceStatus(mappedStatus);
    } catch (error) {
      console.error('Error fetching service status:', error.message);
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Fetch data every minute
    const intervalId = setInterval(fetchData, 60000);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <Container maxWidth="lg" className="App">
      <Typography variant="h3" component="div" gutterBottom>
        <img
          src="https://phone.do/wp-content/uploads/2023/02/logo.png"
          alt="Company Logo"
          width="48"
          height="52"
          style={{ marginRight: '10px' }}
        />
        Service Status Monitor
      </Typography>
      <ServiceList services={serviceStatus} />
    </Container>
  );
};

export default App;

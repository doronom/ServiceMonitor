import React, { useEffect, useState } from 'react';
import Service from './Service';
import './ServiceList.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
  
    const fetchServicesData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/status?name=${searchName}&status=${filterStatus}`);
        const data = await response.json();
  
        setServices(data);
      } catch (error) {
        console.error('Error fetching services data:', error.message);
      }
    };
  
    useEffect(() => {
      fetchServicesData();
    }, [searchName, filterStatus]);
  
    return (
      <div className="service-list">
        {/* Add search and filter UI elements */}
        <div>
          <label>Service Name: </label>
          <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        <div>
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
  
        <table>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Last Offline Time</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <Service key={service.url} {...service} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ServiceList;

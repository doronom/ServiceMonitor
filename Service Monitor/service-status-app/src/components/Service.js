import React from 'react';

const Service = ({ serviceName, status, duration, lastOfflineTime }) => {
  return (
    <tr>
      <td>{serviceName}</td>
      <td>
        <span
          className={`badge ${status === 'active' ? 'badge-online' : 'badge-offline'}`}
        >
          {status}
        </span>
      </td>
      <td>{duration}</td>
      <td>{lastOfflineTime || 'N/A'}</td>
    </tr>
  );
};

export default Service;

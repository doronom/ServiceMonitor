const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { differenceInMinutes, format } = require('date-fns');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = process.env.PORT || 3000;
const slackWebhookURL = "YOUR SLACK WEBHOOK URL";
const prisma = new PrismaClient();

// Helper function to get the duration the service has been online
const getDuration = (lastOfflineTime, status) => {
  if (status === 'active') {
    const now = new Date();
    const minutes = differenceInMinutes(now, new Date(lastOfflineTime));
    const duration = Math.floor(minutes);

    return duration; // Return the duration as an integer
  } else {
    return null; // Return null for 'N/A' or handle it according to your use case
  }
};

// Helper function to get the last offline time
const getLastOfflineTime = (status) => {
  if (status === 'inactive') {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  } else {
    return 'N/A';
  }
};

// Helper function to extract and format the service name
const extractServiceName = (url) => {
  const matches = url.match(/\/\/(.+?)\./);
  if (matches) {
    // Capitalize the first letter and trim unwanted part
    const formattedName = matches[1].split('-')[0].charAt(0).toUpperCase() + matches[1].split('-')[0].slice(1);
    return formattedName;
  } else {
    return url;
  }
};

// Enable CORS for the '/status' route only
app.get('/status', cors({ origin: '*' }), async (req, res) => {
  try {
    const { name, status } = req.query;
    const endpoints = [
      'https://admin.phone.do/health',
      'https://business.phone.do/health',
      'https://partner.phone.do/health',
      'https://billing.phone.do/health',
      'https://calendar.phone.do/health',
      'https://control-room.phone.do/health',
      'https://core.phone.do/health',
      'https://dashboard.phone.do/health',
      'https://external-plugins.phone.do/health',
      'https://feed.phone.do/health',
      'https://general-data.phone.do/health',
      'https://history.phone.do/health',
      'https://interviews-317011.uc.r.appspot.com/health',
      'https://messaging.phone.do/health',
      'https://outbound.phone.do/health',
      'https://payment-gateway-api.phone.do/health',
      'https://security.phone.do/health',
      'https://shopify-app.phone.do/health',
      'https://support.phone.do/health',
      //'https://waving.phone.do/health',
  ];

  const checkHealth = async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        return 'active';
      } else {
        // Send a Slack notification
        await axios.post(slackWebhookURL, {
          text: `❗ Service ${endpoint} is offline!`,
        });
        return 'inactive';
      }
    } catch (error) { 
      // Send a Slack notification with the detailed error message
      await axios.post(slackWebhookURL, {
        text: `❗ Error checking ${endpoint}: ${error.message}`,
      });
  
      return 'inactive'; // Map 'error' status to 'inactive'
    }
  };

    const statusData = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const status = await checkHealth(endpoint);
          const serviceName = extractServiceName(endpoint);
    
          const lastRecord = await prisma.monitor.findFirst({
            where: {
              serviceName,
            },
            orderBy: {
              id: 'desc',
            },
          });
    
          const lastOfflineTime = getLastOfflineTime(status);
          const duration = getDuration(lastOfflineTime, status);
    
          if (lastRecord && lastRecord.status !== status) {
            // If the status has changed, update the existing record
            await prisma.monitor.update({
              where: {
                id: lastRecord.id,
              },
              data: {
                status,
                duration: duration !== null ? duration : null,
                lastOfflineTime: lastOfflineTime !== 'N/A' ? new Date(lastOfflineTime) : null,
              },
            });
          } else if (!lastRecord || status === 'active') {
            // If there is no previous record or the service is active, create a new record
            await prisma.monitor.create({
              data: {
                serviceName,
                status,
                duration: duration !== null ? duration : null,
                lastOfflineTime: lastOfflineTime !== 'N/A' ? new Date(lastOfflineTime) : null,
              },
            });
          }

          return {
            url: endpoint,
            status: lastRecord ? lastRecord.status : 'N/A',
            serviceName: lastRecord ? lastRecord.serviceName : 'N/A',
            duration: lastRecord ? lastRecord.duration : 'N/A',
            lastOfflineTime: lastRecord ? lastRecord.lastOfflineTime : null,
          };
        } catch (error) {
          console.error(`Error processing ${endpoint}: ${error.message}`);
          return {
            url: endpoint,
            status: 'error',
            serviceName: 'N/A',
            duration: 'N/A',
            lastOfflineTime: null,
          };
        }
      })
    );

      // Filter out records that failed or don't match the filters
      const filteredData = statusData
      .filter((record) => record.status !== 'error' && record !== null)
      .filter((record) => {
        if (name && !record.serviceName.toLowerCase().includes(name.toLowerCase())) {
          return false;
        }

        if (status && record.status.toLowerCase() !== status.toLowerCase()) {
          return false;
        }

        return true;
      });

    // Sort the status data by service name
    filteredData.sort((a, b) => a.url.localeCompare(b.url));

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching and storing service status:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
  console.error('Error starting the server:', error.message);
});

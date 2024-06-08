Service Status Monitor - Backend
Overview
This is the backend server for the Service Status Monitor application. It checks the health status of various services, logs the status changes, and sends notifications when services go offline.

Technologies Used
Node.js
Express.js
Axios
Prisma (ORM)
Date-fns (Date utility library)
Slack Webhooks
CORS
Prerequisites
Node.js (version 14.x or later)
PostgreSQL (or any other database supported by Prisma)
Prisma CLI
Slack Webhook URL
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/service-status-monitor.git
cd service-status-monitor/backend
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add the following environment variables:

env
Copy code
DATABASE_URL=your_database_url
PORT=3000
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
Set up Prisma:

bash
npx prisma migrate dev --name init
Running the Server
To start the server, run:

bash
npm start
The server will start on the port specified in the .env file (default is 3000).

API Endpoints
GET /status
Fetches the status of the monitored services.

Query Parameters
name (optional): Filter by service name (partial match).
status (optional): Filter by status (active or inactive).
Response
Returns a JSON array of service status data.

Example Response
[
  {
    "url": "https://admin.phone.do/health",
    "status": "active",
    "serviceName": "Admin",
    "duration": 45,
    "lastOfflineTime": "2023-06-05 12:34:56"
  },
  ...
]

Helper Functions
getDuration
Calculates the duration a service has been online based on the last offline time.

getLastOfflineTime
Gets the formatted last offline time if the service is inactive.

extractServiceName
Extracts and formats the service name from a URL.

Error Handling
Errors during health checks or database operations are logged to the console and sent to Slack via webhook.

CORS
CORS is enabled for the /status route, allowing cross-origin requests from any origin.

License
This project is licensed under the MIT License.

Service Status Monitor - Frontend
Overview
This is the frontend application for the Service Status Monitor. It displays the health status of various services and allows filtering by service name and status.

Technologies Used
React
Material-UI
Fetch API
Prerequisites
Node.js (version 14.x or later)
npm or yarn

Installation
Clone the repository:
git clone https://github.com/yourusername/service-status-monitor.git
cd service-status-monitor/frontend

Install dependencies:
npm install

Running the Application
To start the application, run:
npm start

The application will start on http://localhost:3000.

Components
App
The main component that fetches service status data and renders the ServiceList component.

ServiceList
Fetches and displays a list of services. Allows filtering by service name and status.

Service
Displays individual service details, including name, status, duration, and last offline time.

Fetching Data
Data is fetched from the backend server every minute and when filters are applied.

Filtering
Users can filter the displayed services by name and status using input fields and a dropdown menu.

Styles
Custom CSS for styling the application
Material-UI for UI components
Error Handling
Errors during data fetching are logged to the console.

License
This project is licensed under the MIT License.

Additional Notes
Ensure the backend server is running and accessible at http://localhost:3000 or update the fetch URL in the frontend if the backend server URL is different.
Customize the Slack Webhook URL and database connection details in the .env file as per your requirements.


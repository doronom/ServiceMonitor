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


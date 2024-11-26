# Flight Search Application

This repository contains a Flight Search Application that uses the [Amadeus API](https://developers.amadeus.com/) to retrieve flight data. Follow the instructions below to set up and run the project locally using Docker.

---

## Features
- Search for flights using the Amadeus API
- Simple and intuitive user interface
- Fully containerized with Docker

---

## Prerequisites

1. [Docker](https://www.docker.com/) must be installed on your system.
2. You need Amadeus API credentials (Client ID and Client Secret). You can obtain these by creating an account and a project on the [Amadeus Developer Portal](https://developers.amadeus.com/).

---

## Setup Instructions

### Step 1: Clone the Repository
Clone the project to your local machine:
```bash
git clone https://github.com/demian-ae/flightsearchapp
cd flightsearchapp
```

### Step 2: Create the `.env` File
Create a `.env` file in the root of the project and add your Amadeus API credentials:
```env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```
Replace `your_client_id` and `your_client_secret` with your actual Amadeus API credentials.

### Step 3: Start the Application
Use Docker Compose to Run and build the necessary images:
```bash
docker-compose up --build
```

The application will start and be accessible at:
```
http://localhost:8080
```

---

## Usage
1. Open your browser and navigate to `http://localhost:8080`.
2. Use the search form to find flights by providing the required inputs.

---

## Troubleshooting
- Ensure that Docker is installed and running on your system.
- Verify that your `.env` file contains the correct Amadeus API credentials.
- Check for errors in the terminal output when running `docker-compose up`.


---

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.


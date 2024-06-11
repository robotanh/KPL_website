
---

# Firebase Realtime Dashboard

## Overview

This web app is designed to display real-time data from a Firebase Realtime Database. It features a dashboard that visualizes sensor data through graphs and displays operational status signals based on the data.

## Features

- **Real-Time Data Visualization**: Displays live sensor data using line charts.
- **Operational Status Indicator**: Shows a visual signal indicating whether a specific condition is met (e.g., RUN or STOP).
- **Firebase Integration**: Utilizes Firebase Realtime Database for live data fetching.

## Prerequisites

- Node.js and npm installed on your machine.
- Firebase account with a Realtime Database set up.

## Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/robotanh/KPL_website
   cd KPL_website
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Firebase Configuration**:
   - Create a `firebaseConfig.json` file in the `public` directory with your Firebase configuration:
     ```json
     {
       "firebase": {
         "apiKey": "YOUR_API_KEY",
         "authDomain": "YOUR_AUTH_DOMAIN",
         "databaseURL": "YOUR_DATABASE_URL",
         "projectId": "YOUR_PROJECT_ID",
         "storageBucket": "YOUR_STORAGE_BUCKET",
         "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
         "appId": "YOUR_APP_ID",
         "measurementId": "YOUR_MEASUREMENT_ID"
       },
       "path": [
         "path/to/your/data"
       ]
     }
     ```
   - Replace the placeholders with your actual Firebase project credentials and database paths.

4. **Run the application**:
   ```sh
   npm run dev
   ```

5. **Open in your browser**:
   - Navigate to `http://localhost:5173` to see the app in action.

## File Structure

- **`src/Home.jsx`**: Main application component that includes the dashboard layout, fetching and visualizing sensor data from Firebase.
- **`src/App.css`**: Global styles for the application.

## Usage

- **Dashboard**: The dashboard displays live sensor data in graphs.
- **Signal Indicator**: Shows `RUN` or `STOP` based on the value of `so_lit_da_bom_rt`.

## Customization

- **Adding More Sensors**: Update the `firebaseConfig.json` with additional paths to include more data streams.
- **Styling**: Customize the CSS in `App.css` or the component-specific CSS files to change the look and feel of the dashboard.

## Troubleshooting

- **Data Not Showing**: Ensure that the Firebase configuration is correct and the database paths exist.
- **App Not Loading**: Check the console for errors and ensure all dependencies are installed correctly.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Chart.js](https://www.chartjs.org/)

---


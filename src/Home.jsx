import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { initializeApp } from 'firebase/app';
import { ResponsiveContainer } from 'recharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

function Home() {
  const [config, setConfig] = useState(null);
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    fetch('/firebaseConfig.json') // Assuming you have a firebaseConfig.json file for Firebase configuration
      .then((response) => response.json())
      .then((data) => setConfig(data))
      .catch((error) => console.error('Error loading configuration:', error));
  }, []);

  useEffect(() => {
    if (config) {
      const app = initializeApp(config.firebase);
      const database = getDatabase(app);

      config.path.forEach(path => {
        const dataRef = ref(database, path);

        onValue(dataRef, (snapshot) => {
          const rawData = snapshot.val();
          console.log(`Raw data from path ${path}:`, rawData);

          const parsedData = parseSensorData(rawData);
          console.log(`Parsed data from path ${path}:`, parsedData);

          setSensorData((prevData) => ({
            ...prevData,
            [path]: [...(prevData[path] || []), { x: new Date(), y: parsedData }],
          }));
        });
      });
    }
  }, [config]);

  const parseSensorData = (message) => {
    const so_lit_da_bom_rt = parseFloat(message.substring(10, 19).trim());
    const tien_dang_ban_rt = parseFloat(message.substring(34, 43).trim());

    return { so_lit_da_bom_rt, tien_dang_ban_rt };
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'h:mm a',
          },
          color: 'rgba(255, 255, 255, 0.7)', // Set the color of the x-axis text
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Set the color of the x-axis ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Set the color of the x-axis grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: 'Đơn Vị',
          color: 'rgba(255, 255, 255, 0.7)', // Set the color of the y-axis text
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Set the color of the y-axis ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Set the color of the y-axis grid lines
        },
      },
    },
    plugins: {
      tooltip: {
        titleColor: 'rgba(255, 255, 255, 0.9)', // Set the color of the tooltip title
        bodyColor: 'rgba(255, 255, 255, 0.9)', // Set the color of the tooltip body text
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set the background color of the tooltip
        padding: 10, // Add padding to the tooltip
        borderColor: 'rgba(255, 255, 255, 0.5)', // Set the border color of the tooltip
        borderWidth: 1, // Set the border width of the tooltip
      },
    },
  };

  useEffect(() => {
    console.log('Updated sensor data:', sensorData);
  }, [sensorData]);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>300</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CATEGORIES</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>12</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>33</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ALERTS</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <Line
            data={{
              datasets: [
                {
                  label: "Số Lít Đã Bơm (Lít)",
                  data: (sensorData[config?.path[0]] || []).map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint.y.so_lit_da_bom_rt,
                  })),
                  borderColor: 'rgba(240, 192, 64, 1)',  // Gold color
                  borderWidth: 2,  // Slightly thicker border for better visibility
                  backgroundColor: 'rgba(240, 192, 64, 0.2)',  // Gold with transparency for the fill
                  pointBackgroundColor: 'rgba(240, 192, 64, 1)',  // Gold color for data points
                  pointBorderColor: '#fff',  // White border for data points for better contrast
                  pointHoverBackgroundColor: '#fff',  // White background on hover
                  pointHoverBorderColor: 'rgba(240, 192, 64, 1)',  // Gold border on hover
                  fill: true,  // Enable fill for the area under the line
                }
              ],
            }}
            options={{
              ...options,
              scales: {
                ...options.scales,
                y: {
                  ...options.scales.y,
                  title: {
                    ...options.scales.y.title,
                    text: 'Lít',
                  },
                },
              },
            }}
          />
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <Line
            data={{
              datasets: [
                
                {
                  label: "Tiền Đang Bán (đồng)",
                  data: (sensorData[config?.path[0]] || []).map((dataPoint) => ({
                    x: dataPoint.x,
                    y: dataPoint.y.tien_dang_ban_rt,
                  })),
                  borderColor: 'rgba(240, 192, 64, 1)',  // Gold color
                  borderWidth: 2,  // Slightly thicker border for better visibility
                  backgroundColor: 'rgba(240, 192, 64, 0.2)',  // Gold with transparency for the fill
                  pointBackgroundColor: 'rgba(240, 192, 64, 1)',  // Gold color for data points
                  pointBorderColor: '#fff',  // White border for data points for better contrast
                  pointHoverBackgroundColor: '#fff',  // White background on hover
                  pointHoverBorderColor: 'rgba(240, 192, 64, 1)',  // Gold border on hover
                  fill: true,  // Enable fill for the area under the line
                },
              ],
            }}
            options={{
              ...options,
              scales: {
                ...options.scales,
                y: {
                  ...options.scales.y,
                  title: {
                    ...options.scales.y.title,
                    text: 'Đồng',
                  },
                },
              },
            }}
          />
        </ResponsiveContainer>

       
      </div>
    </main>
  );
}

export default Home;

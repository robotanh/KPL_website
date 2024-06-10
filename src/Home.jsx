import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { initializeApp } from 'firebase/app';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Home() {
  const [config, setConfig] = useState(null);
  const [sensorData, setSensorData] = useState({});
  const [signal, setSignal] = useState('STOP'); // Initial value is 'STOP'

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
            [path]: [...(prevData[path] || []), { x: new Date(), ...parsedData }],
          }));

            // Update signal based on parsedData
          if (parsedData.so_lit_da_bom_rt === 0) {
            setSignal('STOP');
          } else {
            setSignal('RUN');}
        });
      });
    }
  }, [config]);
  useEffect(() => {

  }, []);

  const parseSensorData = (message) => {
    const so_lit_da_bom_rt = parseFloat(message.substring(10, 19).trim());
    const tien_dang_ban_rt = parseFloat(message.substring(34, 43).trim());

    return { so_lit_da_bom_rt, tien_dang_ban_rt };
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
          <h3>{signal}</h3>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500}
                    height={300}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    data={sensorData[config?.path[0]]}>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis yAxisId="so_lit_da_bom_rt" label={{ value: 'Lít', angle: -90, position: 'insideLeft' }} />
            <Tooltip
          formatter={(value, name, props) => [`${value} Lít`, new Date(props.payload.x).toLocaleString()]} // Displaying the value and date
        />
            <Legend />
            <Line
              yAxisId="so_lit_da_bom_rt"
              type="monotone"
              dataKey="so_lit_da_bom_rt"
              name="Số lít đã bơm"
              stroke="rgba(240, 192, 64, 1)"
              fill="rgba(240, 192, 64, 0.2)"
              dot={{ fill: 'rgba(240, 192, 64, 1)' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500}
                      height={300}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      data={sensorData[config?.path[0]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis yAxisId="tien_dang_ban_rt" label={{ value: 'Đồng', angle: -90, position: 'insideLeft' }} />
            <Tooltip
          formatter={(value, name, props) => [`${value} Lít`, new Date(props.payload.x).toLocaleString()]} // Displaying the value and date
        />
            <Legend />
            <Line
              yAxisId="tien_dang_ban_rt"
              type="monotone"
              dataKey="tien_dang_ban_rt"
              name="Tiền Đang Bán"
              stroke="rgba(240, 192, 64, 1)"
              fill="rgba(240, 192, 64, 0.2)"
              dot={{ fill: 'rgba(240, 192, 64, 1)' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;

import React, { useState, useEffect, useContext } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FaGasPump } from "react-icons/fa6";
import { PiIdentificationCard, PiMoneyWavy } from "react-icons/pi";
import { SiRainmeter } from "react-icons/si";
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

function RT_Dashboard({ theme }) {
  const [config, setConfig] = useState(null);
  const [sensorData, setSensorData] = useState({});
  const [latestData, setLatestData] = useState({});

  useEffect(() => {
    fetch('/firebaseConfig.json')
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
            [path]: [...(prevData[path] || []), { x: new Date().getTime(), ...parsedData }],
          }));

          setLatestData((prevData) => ({
            ...prevData,
            [path]: parsedData
          }));
        });
      });
    }
  }, [config]);

  const parseSensorData = (message) => {
    const so_lit_da_bom_rt = parseFloat(message.substring(10, 19).trim());
    const tien_dang_ban_rt = parseFloat(message.substring(34, 43).trim());
    const id_voi = message.charCodeAt(3);

    return { so_lit_da_bom_rt, tien_dang_ban_rt, id_voi };
  };

  useEffect(() => {
    console.log('Updated sensor data:', sensorData);
  }, [sensorData]);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      {config && config.path.map((path, index) => (
        <div key={index}>
          <div className='main-cards'>
            <div className={`card ${theme === 'dark' ? 'dark' : 'bright'}`}>
              <div className='card-inner'>
                <PiMoneyWavy className='card_icon' />
              </div>
              <h3>Tiền: {latestData[path]?.tien_dang_ban_rt || 0}</h3>
            </div>
            <div className={`card ${theme === 'dark' ? 'dark' : 'bright'}`}>
              <div className='card-inner'>
                <h3>Lít xăng</h3>
                <SiRainmeter className='card_icon' />
              </div>
              <h3>{latestData[path]?.so_lit_da_bom_rt || 0}</h3>
            </div>
            <div className={`card ${theme === 'dark' ? 'dark' : 'bright'}`}>
              <div className='card-inner'>
                <h3>ID Vòi</h3>
                <PiIdentificationCard className='card_icon' />
              </div>
              <h3>{latestData[path]?.id_voi || 0}</h3>
            </div>
            <div className={`card ${theme === 'dark' ? 'dark' : 'bright'}`}>
              <div className='card-inner'>
                <h3>Trạng Thái</h3>
                <FaGasPump className='card_icon' />
              </div>
              <h3>{latestData[path]?.so_lit_da_bom_rt === 0 ? 'STOP' : 'RUN'}</h3>
            </div>
          </div>

          <div className='charts'>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sensorData[path] || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                  label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis yAxisId="left" label={{ value: 'Lít', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value, name, props) => [`${value} Lít`, new Date(props.payload.x).toLocaleString()]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="so_lit_da_bom_rt"
                  name="Số lít đã bơm"
                  stroke={theme === 'dark' ? "rgba(240, 192, 64, 1)" : "rgba(64, 120, 192, 1)"}
                  fill={theme === 'dark' ? "rgba(240, 192, 64, 0.2)" : "rgba(64, 120, 192, 0.2)"}
                  dot={{ fill: theme === 'dark' ? 'rgba(240, 192, 64, 1)' : 'rgba(64, 120, 192, 1)' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sensorData[path] || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                  label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis yAxisId="left" label={{ value: 'Đồng', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value, name, props) => [`${value} Đồng`, new Date(props.payload.x).toLocaleString()]}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tien_dang_ban_rt"
                  name="Tiền Đang Bán"
                  stroke={theme === 'dark' ? "rgba(240, 64, 64, 1)" : "rgba(64, 192, 64, 1)"}
                  fill={theme === 'dark' ? "rgba(240, 64, 64, 0.2)" : "rgba(64, 192, 64, 0.2)"}
                  dot={{ fill: theme === 'dark' ? 'rgba(240, 64, 64, 1)' : 'rgba(64, 192, 64, 1)' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </main>
  );
}

export default RT_Dashboard;

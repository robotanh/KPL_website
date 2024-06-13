import React, { useState, useEffect } from 'react';
import '../styles/Hist_data.css'; 

function Hist_data() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [warning, setWarning] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = (id_voi = '', start_time = '', end_time = '') => {
        setLoading(true);
        setError(null);

        let query = `?id_voi=${id_voi}&start_time=${start_time}&end_time=${end_time}`;
        fetch(`/app/hist_data${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = () => {
        let startTimeFormatted = '';
        let endTimeFormatted = '';

        if (startDate && startTime) {
            startTimeFormatted = `${startDate.split('/').reverse().join('-')}T${startTime}`;
        } else if (startTime) {
            setWarning('Please specify the date more specifically for the start time.');
            return;
        }

        if (endDate && endTime) {
            endTimeFormatted = `${endDate.split('/').reverse().join('-')}T${endTime}`;
        } else if (endTime) {
            setWarning('Please specify the date more specifically for the end time.');
            return;
        }

        setWarning('');
        fetchData(search, startTimeFormatted, endTimeFormatted);
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        };
        return new Date(dateString).toLocaleString('en-GB', options).replace(',', '');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Historical Data Page</h1>
            <div>
                <label>ID Voi:</label>
                <input 
                    type="text" 
                    value={search} 
                    onChange={handleSearchChange} 
                    placeholder="Search by ID Voi" 
                />
                <div>
                    <label>Start Date (dd/mm/yyyy):</label>
                    <input 
                        type="text" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        placeholder="dd/mm/yyyy" 
                    />
                </div>
                <div>
                    <label>Start Time (hh:mm:ss):</label>
                    <input 
                        type="text" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        placeholder="hh:mm:ss" 
                    />
                </div>
                <div>
                    <label>End Date (dd/mm/yyyy):</label>
                    <input 
                        type="text" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        placeholder="dd/mm/yyyy" 
                    />
                </div>
                <div>
                    <label>End Time (hh:mm:ss):</label>
                    <input 
                        type="text" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        placeholder="hh:mm:ss" 
                    />
                </div>
                {warning && <div style={{color: 'red'}}>{warning}</div>}
                <button onClick={handleSearch}>Search</button>
            </div>
            <table className="hist-table">
                <thead>
                    <tr>
                        <th>ID Voi</th>
                        <th>Mã Lần Bơm</th>
                        <th>Thời Gian</th>
                        <th>Giá Bán</th>
                        <th>Tổng Đã Bơm</th>
                        <th>Tiền Bán</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id_voi + row.thoi_gian}>
                            <td>{row.id_voi}</td>
                            <td>{row.ma_lan_bom}</td>
                            <td>{formatDate(row.thoi_gian)}</td>
                            <td>{row.gia_ban}</td>
                            <td>{row.tong_da_bom}</td>
                            <td>{row.tien_ban}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Hist_data;

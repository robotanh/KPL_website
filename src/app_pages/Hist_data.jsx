// Hist_data.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Hist_data.css'; 
import InputField from '../login_logout_components/InputField'
import SubmitButton from '../login_logout_components/SubmitButton';

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
    const [offset, setOffset] = useState(0);
    const [exportFormat, setExportFormat] = useState('csv');
    const limit = 50;  // Number of records to fetch per page

    useEffect(() => {
        fetchData(search, startDate, startTime, endDate, endTime, offset); // Fetch data with current criteria when offset changes
    }, [offset]);  // Fetch data when offset changes

    const fetchData = (id_voi = '', start_date = '', start_time = '', end_date = '', end_time = '', offset = 0) => {
        setLoading(true);
        setError(null);

        let startTimeFormatted = '';
        let endTimeFormatted = '';

        if (start_date && start_time) {
            startTimeFormatted = `${start_date.split('/').reverse().join('-')}T${start_time}`;
        } else if (start_time) {
            setWarning('Please specify the date more specifically for the start time.');
            return;
        }

        if (end_date && end_time) {
            endTimeFormatted = `${end_date.split('/').reverse().join('-')}T${end_time}`;
        } else if (end_time) {
            setWarning('Please specify the date more specifically for the end time.');
            return;
        }

        let query = `?id_voi=${id_voi}&start_time=${startTimeFormatted}&end_time=${endTimeFormatted}&limit=${limit}&offset=${offset}`;
        fetch(`/api/hist_data${query}`)
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
        setOffset(0);  // Reset to first page on new search
        fetchData(search, startDate, startTime, endDate, endTime, 0);
    };

    const handleExport = () => {
        let startTimeFormatted = '';
        let endTimeFormatted = '';

        if (startDate && startTime) {
            startTimeFormatted = `${startDate.split('/').reverse().join('-')}T${startTime}`;
        }

        if (endDate && endTime) {
            endTimeFormatted = `${endDate.split('/').reverse().join('-')}T${endTime}`;
        }

        let query = `?id_voi=${search}&start_time=${startTimeFormatted}&end_time=${endTimeFormatted}&format=${exportFormat}`;
        fetch(`/api/export${query}`)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Network response was not ok');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `data.${exportFormat}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(error => {
                setError(error);
            });
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

    const handleNext = () => {
        setOffset(offset + limit);
    };

    const handlePrevious = () => {
        if (offset > 0) {
            setOffset(offset - limit);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div id='root'>
            <div className='Hist_data_page'>
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
                <div>
                    <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                        <option value="csv">Export as CSV</option>
                        <option value="xlsx">Export as XLSX</option>
                    </select>
                    <button onClick={handleExport}>Export</button>
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
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={offset === 0}>Previous</button>
                    <button onClick={handleNext} disabled={data.length < limit}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default Hist_data;

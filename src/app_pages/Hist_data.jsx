import React, { useState, useEffect } from 'react';
import '../styles/Hist_data.css'; 

function Hist_data() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/app/hist_data')
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
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Historical Data Page</h1>
            <table className="hist-table">
                <thead>
                    <tr>
                        <th>ID</th>
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
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.id_voi}</td>
                            <td>{row.ma_lan_bom}</td>
                            <td>{new Date(row.thoi_gian).toLocaleString()}</td>
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

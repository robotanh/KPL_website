import React from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillGearFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import SubmitButton from './login_logout_components/SubmitButton';
import Logout from './login_logout_components/Logout';
import UserStore from './login_logout_components/store/UserStore';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await Logout();
    if (!UserStore.isLoggedIn) {
      navigate('/');
    }
  };

  return (
    <aside id="sidebar" className={`${openSidebarToggle ? 'sidebar-responsive' : ''} ${document.body.className}`}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> SHOP
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>X</span>
      </div>

      <ul className="sidebar-list">
        {/* DASHBOARD */}
        <li className="sidebar-list-item">
          <Link to="/app/dashboard">
            <BsGrid1X2Fill className="icon" /> Bảng điều khiển
          </Link>
        </li>

        {/* HISTORICAL DATA */}
        <li className="sidebar-list-item">
          <Link to="/app/hist_data">
            <BsFillArchiveFill className="icon" /> Truy xuất dữ liệu
          </Link>
        </li>

        <li className="sidebar-list-item">
          <a href="#">
            <BsFillGrid3X3GapFill className="icon" /> Hướng dẫn sử dụng
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="#">
            <BsPeopleFill className="icon" /> Hỗ trợ khách hàng
          </a>
        </li>
        <li className="sidebar-list-item">
          <Link to="/app/settings">
            <BsFillGearFill className="icon" /> Cài đặt
          </Link>
        </li>
      </ul>

      {/* LOGOUT BUTTON */}
      <div className="logout-btn">
        <SubmitButton
          className="log-out-btn"
          text="Log out"
          disabled={false}
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
}

export default Sidebar;

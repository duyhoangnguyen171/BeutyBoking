import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Clock, 
  Mail, 
  Image, 
  FolderOpen, 
  Newspaper,
  ChevronLeft,
  Menu,
  LogOut,
  User
} from "lucide-react";
import "../../asset/styles/sidebar.css";

// Utility function để decode JWT token
const decodeToken = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  } catch (err) {
    console.error("Invalid token format", err);
    return null;
  }
};

// Hook custom để quản lý authentication
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setRole(null);
      return;
    }

    const payload = decodeToken(token);
    if (!payload) {
      setUser(null);
      setRole(null);
      return;
    }

    // Kiểm tra token expiry
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem("token");
      setUser(null);
      setRole(null);
      return;
    }

    const userRole = (
      payload.role ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    )?.toLowerCase();

    setUser({
      name: payload.name || payload.sub || "User",
      email: payload.email || "",
      avatar: payload.avatar || null
    });
    setRole(userRole);
  }, []);

  return { user, role };
};

// Cấu hình menu items dựa trên role
const getMenuItems = (role) => {
  const commonItems = [
    { 
      key: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      path: "/dashboards" 
    },
    { 
      key: "appointments", 
      label: "Lịch hẹn", 
      icon: Calendar, 
      path: "/appointments" 
    },
    { 
      key: "services", 
      label: "Dịch vụ", 
      icon: Settings, 
      path: "/services" 
    },
    { 
      key: "workshifts", 
      label: "Ca làm", 
      icon: Clock, 
      path: "/workshifts" 
    }
  ];

  const adminOnlyItems = [
    { 
      key: "users", 
      label: "Người dùng", 
      icon: Users, 
      path: "/users" 
    },
    { 
      key: "contact", 
      label: "Liên hệ", 
      icon: Mail, 
      path: "/contact" 
    },
    { 
      key: "banners", 
      label: "Banner", 
      icon: Image, 
      path: "/banners" 
    },
    { 
      key: "categories", 
      label: "Danh mục", 
      icon: FolderOpen, 
      path: "/categories" 
    },
    { 
      key: "news", 
      label: "Tin tức", 
      icon: Newspaper, 
      path: "/news" 
    }
  ];

  return role === "admin" 
    ? [...commonItems, ...adminOnlyItems]
    : commonItems;
};

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, role } = useAuth();

  // Memoize menu items để tránh re-render không cần thiết
  const menuItems = useMemo(() => getMenuItems(role), [role]);
  
  // Determine base path
  const basePath = useMemo(() => {
    return role === "admin" ? "/admin" : "/staff";
  }, [role]);

  // Handle sidebar toggle
  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  }, [isOpen, onToggle]);

  // Handle collapse toggle
  const handleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  // Check if current path is active
  const isActiveLink = useCallback((path) => {
    return location.pathname === `${basePath}${path}`;
  }, [location.pathname, basePath]);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!role) {
    return null; // Don't render sidebar if user is not authenticated
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            {!isCollapsed && <h1>Quản Trị {role === "admin" ? "Admin" : "Staff"}</h1>}
          </div>
          
          {/* Collapse button for desktop */}
          <button
            className="sidebar-collapse-btn"
            onClick={handleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft 
              size={16} 
              className={`transform transition-transform ${isCollapsed ? "rotate-180" : ""}`} 
            />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={20} />
              )}
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                {user.email && <div className="user-email">{user.email}</div>}
              </div>
            )}
          </div>
        )}

        {/* Navigation menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.path);
              
              return (
                <li key={item.key} className="nav-item-wrapper">
                  <Link
                    to={`${basePath}${item.path}`}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="nav-icon" />
                    {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    {isActive && <div className="active-indicator" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with logout */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={isCollapsed ? "Đăng xuất" : undefined}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>

        {/* Version info */}
        {!isCollapsed && (
          <div className="sidebar-version">
            <small>v1.0.0</small>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
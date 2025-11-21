import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AssetList from './AssetList';
import AssetForm from './AssetForm';
import StatsPanel from './StatsPanel';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchAssets();
    fetchStats();
    
    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchAssets();
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchAssets = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const response = await axios.get(`${API_URL}/assets`, { params });
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/assets/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [searchTerm, filterStatus]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateAsset = () => {
    setEditingAsset(null);
    setShowForm(true);
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await axios.delete(`${API_URL}/assets/${id}`);
        fetchAssets();
        fetchStats();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete asset');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAsset(null);
    fetchAssets();
    fetchStats();
  };

  if (loading && assets.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="cyber-spinner"></div>
        <p>Loading assets...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="cyber-bg"></div>
      
      <header className="dashboard-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-left">
            <h1 className="glow">🔒 IT ASSET MANAGEMENT</h1>
            <div className="user-info">
              <span className="user-role">{user?.role?.toUpperCase()}</span>
              <span className="user-name">{user?.username}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="cyber-button cyber-button-secondary">
            Sign Out
          </button>
        </motion.div>
      </header>

      <div className="dashboard-content">
        <StatsPanel stats={stats} />

        <div className="assets-section">
          <div className="section-header">
            <h2>Asset Inventory</h2>
            <div className="controls">
              <input
                type="text"
                className="cyber-input search-input"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="cyber-input filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
              <button onClick={handleCreateAsset} className="cyber-button">
                + Add Asset
              </button>
            </div>
          </div>

          <AssetList
            assets={assets}
            onEdit={handleEditAsset}
            onDelete={isAdmin() ? handleDeleteAsset : null}
            isAdmin={isAdmin()}
          />
        </div>
      </div>

      {showForm && (
        <AssetForm
          asset={editingAsset}
          onClose={handleFormClose}
          isAdmin={isAdmin()}
        />
      )}
    </div>
  );
};

export default Dashboard;


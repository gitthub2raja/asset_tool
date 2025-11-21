import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AssetForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AssetForm = ({ asset, onClose, isAdmin }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serial_number: '',
    manufacturer: '',
    model: '',
    status: 'active',
    location: '',
    assigned_to: '',
    purchase_date: '',
    warranty_expiry: '',
    ip_address: '',
    mac_address: '',
    notes: ''
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        type: asset.type || '',
        serial_number: asset.serial_number || '',
        manufacturer: asset.manufacturer || '',
        model: asset.model || '',
        status: asset.status || 'active',
        location: asset.location || '',
        assigned_to: asset.assigned_to || '',
        purchase_date: asset.purchase_date || '',
        warranty_expiry: asset.warranty_expiry || '',
        ip_address: asset.ip_address || '',
        mac_address: asset.mac_address || '',
        notes: asset.notes || ''
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (asset) {
        // Update
        await axios.put(`${API_URL}/assets/${asset.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create
        await axios.post(`${API_URL}/assets`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="form-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="form-modal cyber-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="form-header">
            <h2>{asset ? 'Edit Asset' : 'Create New Asset'}</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="asset-form">
            {error && (
              <div className="error-message">{error}</div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Asset Name *</label>
                <input
                  type="text"
                  name="name"
                  className="cyber-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  name="type"
                  className="cyber-input"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Server">Server</option>
                  <option value="Network Device">Network Device</option>
                  <option value="Printer">Printer</option>
                  <option value="Mobile Device">Mobile Device</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Serial Number</label>
                <input
                  type="text"
                  name="serial_number"
                  className="cyber-input"
                  value={formData.serial_number}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  className="cyber-input"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  className="cyber-input"
                  value={formData.manufacturer}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  name="model"
                  className="cyber-input"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  className="cyber-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Assigned To</label>
                <input
                  type="text"
                  name="assigned_to"
                  className="cyber-input"
                  value={formData.assigned_to}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>IP Address</label>
                <input
                  type="text"
                  name="ip_address"
                  className="cyber-input"
                  value={formData.ip_address}
                  onChange={handleChange}
                  placeholder="192.168.1.1"
                />
              </div>

              <div className="form-group">
                <label>MAC Address</label>
                <input
                  type="text"
                  name="mac_address"
                  className="cyber-input"
                  value={formData.mac_address}
                  onChange={handleChange}
                  placeholder="00:1B:44:11:3A:B7"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  className="cyber-input"
                  value={formData.purchase_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Warranty Expiry</label>
                <input
                  type="date"
                  name="warranty_expiry"
                  className="cyber-input"
                  value={formData.warranty_expiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                className="cyber-input"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cyber-button cyber-button-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cyber-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : asset ? 'Update Asset' : 'Create Asset'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetForm;


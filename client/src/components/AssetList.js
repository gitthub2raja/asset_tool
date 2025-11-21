import React from 'react';
import { motion } from 'framer-motion';
import './AssetList.css';

const AssetList = ({ assets, onEdit, onDelete, isAdmin }) => {
  if (assets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <p>No assets found</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className="asset-list-container">
      <div className="table-wrapper">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Serial Number</th>
              <th>Manufacturer</th>
              <th>Status</th>
              <th>Location</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <motion.tr
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="asset-row"
              >
                <td>
                  <div className="asset-name">
                    <strong>{asset.name}</strong>
                    {asset.model && <span className="asset-model">{asset.model}</span>}
                  </div>
                </td>
                <td>{asset.type}</td>
                <td>
                  <code className="serial-number">{asset.serial_number || 'N/A'}</code>
                </td>
                <td>{asset.manufacturer || 'N/A'}</td>
                <td>
                  <span className={getStatusClass(asset.status)}>
                    {asset.status}
                  </span>
                </td>
                <td>{asset.location || 'N/A'}</td>
                <td>{asset.assigned_to || 'Unassigned'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(asset)}
                      className="action-btn edit-btn"
                      title="Edit Asset"
                    >
                      ✏️
                    </button>
                    {isAdmin && onDelete && (
                      <button
                        onClick={() => onDelete(asset.id)}
                        className="action-btn delete-btn"
                        title="Delete Asset"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetList;


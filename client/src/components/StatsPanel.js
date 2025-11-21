import React from 'react';
import { motion } from 'framer-motion';
import './StatsPanel.css';

const StatsPanel = ({ stats }) => {
  if (!stats) {
    return (
      <div className="stats-panel">
        <div className="cyber-spinner"></div>
      </div>
    );
  }

  const statItems = [
    { label: 'Total Assets', value: stats.total, color: 'var(--cyber-blue)', icon: '📊' },
    { label: 'Active', value: stats.active, color: 'var(--cyber-green)', icon: '✅' },
    { label: 'Inactive', value: stats.inactive, color: '#ccc', icon: '⏸️' },
    { label: 'Maintenance', value: stats.maintenance, color: 'var(--cyber-yellow)', icon: '🔧' },
    { label: 'Retired', value: stats.retired, color: 'var(--cyber-red)', icon: '🗑️' }
  ];

  return (
    <div className="stats-panel">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="stat-card cyber-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsPanel;


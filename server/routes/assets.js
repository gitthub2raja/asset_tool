const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All asset routes require authentication
router.use(authenticateToken);

// Get all assets
router.get('/', (req, res) => {
  const db = getDatabase();
  const { search, status, type } = req.query;
  
  let query = 'SELECT * FROM assets WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR serial_number LIKE ? OR manufacturer LIKE ? OR model LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, assets) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(assets);
  });
});

// Get single asset
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  db.get('SELECT * FROM assets WHERE id = ?', [id], (err, asset) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  });
});

// Create asset (Admin and Technician can create)
router.post('/', [
  body('name').notEmpty().withMessage('Asset name is required'),
  body('type').notEmpty().withMessage('Asset type is required'),
  body('status').isIn(['active', 'inactive', 'maintenance', 'retired']).withMessage('Invalid status')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const {
    name, type, serial_number, manufacturer, model, status,
    location, assigned_to, purchase_date, warranty_expiry,
    ip_address, mac_address, notes
  } = req.body;

  db.run(
    `INSERT INTO assets (
      name, type, serial_number, manufacturer, model, status,
      location, assigned_to, purchase_date, warranty_expiry,
      ip_address, mac_address, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, type, serial_number, manufacturer, model, status,
     location, assigned_to, purchase_date, warranty_expiry,
     ip_address, mac_address, notes],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Serial number already exists' });
        }
        return res.status(500).json({ error: 'Failed to create asset' });
      }

      db.get('SELECT * FROM assets WHERE id = ?', [this.lastID], (err, asset) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve created asset' });
        }
        res.status(201).json(asset);
      });
    }
  );
});

// Update asset (Admin and Technician can update)
router.put('/:id', [
  body('name').notEmpty().withMessage('Asset name is required'),
  body('type').notEmpty().withMessage('Asset type is required'),
  body('status').isIn(['active', 'inactive', 'maintenance', 'retired']).withMessage('Invalid status')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const { id } = req.params;
  const {
    name, type, serial_number, manufacturer, model, status,
    location, assigned_to, purchase_date, warranty_expiry,
    ip_address, mac_address, notes
  } = req.body;

  db.run(
    `UPDATE assets SET
      name = ?, type = ?, serial_number = ?, manufacturer = ?, model = ?, status = ?,
      location = ?, assigned_to = ?, purchase_date = ?, warranty_expiry = ?,
      ip_address = ?, mac_address = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [name, type, serial_number, manufacturer, model, status,
     location, assigned_to, purchase_date, warranty_expiry,
     ip_address, mac_address, notes, id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Serial number already exists' });
        }
        return res.status(500).json({ error: 'Failed to update asset' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      db.get('SELECT * FROM assets WHERE id = ?', [id], (err, asset) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve updated asset' });
        }
        res.json(asset);
      });
    }
  );
});

// Delete asset (Admin only)
router.delete('/:id', requireRole(['admin']), (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  db.run('DELETE FROM assets WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete asset' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  });
});

// Get asset statistics
router.get('/stats/overview', (req, res) => {
  const db = getDatabase();

  db.all(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
      SUM(CASE WHEN status = 'retired' THEN 1 ELSE 0 END) as retired
    FROM assets
  `, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(stats[0] || { total: 0, active: 0, inactive: 0, maintenance: 0, retired: 0 });
  });
});

module.exports = router;


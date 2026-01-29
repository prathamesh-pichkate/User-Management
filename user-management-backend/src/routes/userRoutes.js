const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.js');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  exportToCSV
} = require('../controllers/userController');

// Export route (must be before /:id route)
router.get('/export/csv', exportToCSV);

// CRUD routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', upload.single('profileImage'), createUser);
router.put('/:id', upload.single('profileImage'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
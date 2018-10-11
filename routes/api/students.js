const express = require('express');
const router = express.Router();

// @route   Get api/students/test
// @desc    Test Users route
// @access  Private
router.get('/test', (req, res) => {
  res.json({ msg: 'Students works' });
});

module.exports = router;

const express = require('express');
const router = express.Router();

// @route   Get api/assignments/test
// @desc    Test Users route
// @access  Private
router.get('/test', (req, res) => {
  res.json({ msg: 'Assignments works' });
});

module.exports = router;

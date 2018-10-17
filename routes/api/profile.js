const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');

// Load Profile Model
const Profile = require('../../models/Profile');
//Load User Profile
const User = require('../../models/User');

// @route   Get api/profile/test
// @desc    Test Users route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Profile works' });
});

// @route   Get api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        'name'
      );
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(400).json(errors);
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// @route   Post api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.website) profileFields.website = req.body.website;

    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update Profile

        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        res.json(updatedProfile);
      } else {
        // Create Profile

        //Check if handle exists
        const profileFromHandle = await Profile.findOne({
          handle: profileFields.handle
        });

        if (profileFromHandle) {
          errors.handle = 'That handle already exists';
          return res.status(400).json(errors);
        }

        // Save Profile
        const newProfile = await new Profile(profileFields).save();
        res.json(newProfile);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

module.exports = router;

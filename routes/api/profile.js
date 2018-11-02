const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
//Load UserModel
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

// @route   Get api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', async (req, res) => {
  const errors = {};
  try {
    // Get all profiles from database
    const profiles = await Profile.find().populate('user', 'name');
    if (!profiles) {
      errors.noprofile = 'There are no profiles';
      return res.status(404).json(errors);
    }
    res.json(profiles);
  } catch (error) {
    res.status(404).json({ profile: 'There are no profiles' });
  }
});

// @route   Get api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      handle: req.params.handle
    }).populate('user', 'name');
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (error) {
    res.status(404).json({ profile: 'There is no profile for this user' });
  }
});

// @route   Get api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', 'name');

    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (error) {
    res.status(404).json({ profile: 'There is no profile for this user' });
  }
});

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

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check Validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }
    const profile = await Profile.findOne({ user: req.user.id });
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add to experience array
    profile.experience.unshift(newExp);
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check Validation
    if (!isValid) {
      // return any errors with 400 status
      return res.status(400).json(errors);
    }
    const profile = await Profile.findOne({ user: req.user.id });
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };

    // Add to experience array
    profile.education.unshift(newEdu);
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.remove({ _id: req.params.exp_id });

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } catch (err) {
      res.status(404).json(err);
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.remove({ _id: req.params.edu_id });

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } catch (err) {
      res.status(404).json(err);
    }
  }
);

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ success: true });
    } catch (err) {
      res.status(404).json(err);
    }
  }
);

module.exports = router;

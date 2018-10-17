const validator = require('validator');
const _ = require('lodash');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !_.isEmpty(data.handle) ? data.handle : '';

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (!_.isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if (!_.isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }
  if (!_.isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }
  if (!_.isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }
  if (!_.isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

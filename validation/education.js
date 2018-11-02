const validator = require('validator');
const _ = require('lodash');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !_.isEmpty(data.school) ? data.school : '';
  data.degree = !_.isEmpty(data.degree) ? data.degree : '';
  data.from = !_.isEmpty(data.from) ? data.from : '';
  data.fieldofstudy = !_.isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';

  if (validator.isEmpty(data.school)) {
    errors.title = 'School field is required';
  }

  if (validator.isEmpty(data.degree)) {
    errors.company = 'Degree field is required';
  }
  if (validator.isEmpty(data.from)) {
    errors.from = 'From field is required';
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.from = 'Field of study field is required';
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};

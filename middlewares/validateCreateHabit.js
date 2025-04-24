const { body, validationResult } = require('express-validator');

const validateCreateHabit = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('frequency')
    .notEmpty().withMessage('Frequency is required')
    .isObject().withMessage('Frequency must be an object'),

  body('reminderTime')
    .optional()
    .isObject().withMessage('Reminder time must be an object'),

  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      return res.status(422).json({ errors: extractedErrors });
    }
    next();
  }
];

module.exports = {
  validateCreateHabit
};

const { body, validationResult } = require('express-validator');

const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
const domainRegex = new RegExp(`@(${allowedDomains.join('|').replace(/\./g, '\\.')})$`);

const validateRegister = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .matches(domainRegex).withMessage(`Email domain must be one of: ${allowedDomains.join(', ')}`),

  body('password')
    .isAlphanumeric().withMessage('Password must contain only letters and numbers')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .isLength({ max: 12 }).withMessage('Password must not be more than 12 characters long'),

  body('userName')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required'),

  body('password')
    .notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin,
};

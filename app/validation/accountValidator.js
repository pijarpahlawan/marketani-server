const joi = require('joi')

const schema = joi.object({
  email: joi.string().email().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email is not valid'
  }),
  password: joi
    .string()
    .min(6)
    .max(30)
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).*$/) // at least one lowercase, one uppercase, one number, no whitespace
    .messages({
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must be at most 30 characters long',
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, and one number without whitespace'
    }),
  repeatedPassword: joi.ref('password')
})

module.exports = schema

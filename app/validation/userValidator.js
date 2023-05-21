const joi = require('joi')

const schema = joi.object({
  username: joi
    .string()
    .regex(/^(?!.*\s)[a-z0-9]{3,30}$/)
    .trim()
    .messages({
      'string.empty': 'Username cannot be empty',
      'string.pattern.base':
        'Username must be lowercase, can be alphanumeric, between 3 and 30 characters, and cannot contain whitespace',
      'string.lowercase': 'Username must be lowercase'
    }),
  name: joi.string().min(1).max(30).trim().message({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name must be at most 30 characters long'
  }),
  phone: joi
    .string()
    .max(15)
    .regex(/^(?!.*\s)[0-9]$/)
    .trim()
    .messages({
      'string.empty': 'Phone cannot be empty',
      'string.max': 'Phone must be at most 15 characters long',
      'string.pattern.base': 'Phone must be numeric without whitespace'
    }),
  provinceId: joi.number().integer().min(1).messages({
    'number.base': 'Province ID must be a number',
    'number.integer': 'Province ID must be an integer',
    'number.min': 'Province ID must be at least 1'
  }),
  cityId: joi.number().integer().min(1).messages({
    'number.base': 'City ID must be a number',
    'number.integer': 'City ID must be an integer',
    'number.min': 'City ID must be at least 1'
  }),
  address: joi.string().min(1).max(100).trim().message({
    'string.empty': 'Address cannot be empty',
    'string.min': 'Address must be at least 1 character long',
    'string.max': 'Address must be at most 100 characters long'
  }),
  gender: joi.string().max(1).valid('L', 'P').messages({
    'string.empty': 'Gender cannot be empty',
    'string.max': 'Gender must have a maximum length of 1',
    'any.only': 'Gender must be either "L" or "P"'
  })
})

module.exports = schema

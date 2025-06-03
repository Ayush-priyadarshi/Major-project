const Joi = require('joi');

const listingschema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    // Remove the 'image' field from validation here
    price: Joi.number().min(0).required(),
    country: Joi.string().required(),
    location: Joi.string().required()
  }).required()
});

const reviewSchema = Joi.object({
  comment: Joi.string().min(3).required(),
  likes: Joi.number().integer().min(1).max(5).required()
});

module.exports = { listingschema, reviewSchema };




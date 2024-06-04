const Joi = require('joi');

function validateRequest(request, response, next) {

    const schema = Joi.object({
        title: Joi.string().trim().required(),
        author: Joi.string().trim().required(),
        body: Joi.string().trim().required(),
        category: Joi.string().trim().optional().allow(''),
        is_featured: Joi.boolean().optional().allow('')
    });

    const { error } = schema.validate(request.body, { abortEarly: false });
    
    if (error) {
        const errorDetails = error.details.map(function(detail) {
            const message = detail.message.split('"')[2].trim();

            const key = detail.context.key;

            return { [key]: `The ${key} field ${message}` };
        });

        return response.status(422).json({
            'data': {
                'error': {
                    'title': 'Validation error',
                    'message': errorDetails
                }
            }
        });
    }

    next();
}

module.exports = validateRequest;
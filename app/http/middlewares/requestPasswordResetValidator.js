const Joi = require('joi');

function validateInitiatePasswordResetRequest(request, response, next) {

    const schema = Joi.object({
        username: Joi.string().trim().optional(),
        email: Joi.string().trim().email().optional(),
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

module.exports = validateInitiatePasswordResetRequest;
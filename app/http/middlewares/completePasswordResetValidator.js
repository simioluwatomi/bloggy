const Joi = require('joi');

function validateCompletePasswordResetRequest(request, response, next) {

    const schema = Joi.object({
        token: Joi.string().trim().required().length(6),
        password: Joi.string().trim().required().min(6).max(30),
        password_confirm: Joi.ref('password'),
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

module.exports = validateCompletePasswordResetRequest;
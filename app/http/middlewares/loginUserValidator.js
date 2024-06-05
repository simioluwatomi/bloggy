const Joi = require('joi');

function validateLoginRequest(request, response, next) {

    const schema = Joi.object({
        username_or_email: Joi.string().trim().required(),
        password: Joi.string().trim().required()
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

module.exports = validateLoginRequest;
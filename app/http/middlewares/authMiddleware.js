const jwt = require('jsonwebtoken');

function authenticateUser(request, response, next) {
    const authorizationHeader = request.headers.authorization;

    if (! authorizationHeader) {
        return response.status(401).json({
            'data': {
                'error': {
                    'title': 'Authentication error',
                    'message': 'Authenticate to continue'
                }
            }
        });
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.APP_KEY);
      } catch(error) {
        return response.status(401).json({
            'data': {
                'error': {
                    'title': 'Authentication error',
                    'message': 'Authenticate to continue'
                }
            }
        });
      }

    next();
}

module.exports = authenticateUser;
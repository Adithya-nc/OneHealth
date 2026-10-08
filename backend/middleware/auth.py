from functools import wraps
from flask import request, jsonify, g, current_app

def require_auth(role=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if current_app.config['MOCK_MODE']:
                # Mock a successful authentication for local development without Firebase
                g.user_id = 'mock-user-123'
                g.role = 'patient'
                return f(*args, **kwargs)

            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Missing token'}), 401
            
            token = auth_header.split('Bearer ')[1]
            try:
                import firebase_admin.auth as firebase_auth
                decoded = firebase_auth.verify_id_token(token)
                g.user_id = decoded['uid']
                g.role = decoded.get('role', 'patient')
                if role and g.role != role:
                    return jsonify({'error': 'Forbidden'}), 403
            except Exception as e:
                return jsonify({'error': 'Invalid token', 'details': str(e)}), 401
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

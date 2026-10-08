from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime

bp = Blueprint('records', __name__)

@bp.route('/upload', methods=['POST'])
@require_auth(role='patient')
def upload_record():
    # Mocking upload logic
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    return jsonify({
        "record_id": f"rec-{int(datetime.now().timestamp())}",
        "file_url": "https://storage.googleapis.com/mock-bucket/mock-file.pdf",
        "message": "File uploaded successfully"
    })

@bp.route('/<record_id>', methods=['GET'])
@require_auth()
def get_record(record_id):
    return jsonify({
        "id": record_id,
        "type": "report",
        "date": datetime.now().isoformat(),
        "title": "Sample Blood Report"
    })

from flask import Blueprint, jsonify, request, g
from middleware.auth import require_auth
from datetime import datetime

bp = Blueprint('notifications', __name__)

MOCK_NOTIFICATIONS = [
    {
        "id": "notif-001",
        "type": "medication",
        "title": "Medication Reminder",
        "message": "Amlodipine 5mg is due at 09:00 AM",
        "timestamp": datetime.now().isoformat(),
        "read": False,
        "action": {"label": "View Medications", "href": "/medications"}
    },
    {
        "id": "notif-002",
        "type": "report",
        "title": "AI Analysis Complete",
        "message": "Your CBC report has been analyzed. Review the insights.",
        "timestamp": datetime.now().isoformat(),
        "read": False,
        "action": {"label": "View Report", "href": "/passport"}
    },
    {
        "id": "notif-003",
        "type": "doctor",
        "title": "Doctor Access Request",
        "message": "Dr. Arjun Nair has requested access to your health passport.",
        "timestamp": datetime.now().isoformat(),
        "read": True,
        "action": {"label": "Review Request", "href": "/settings"}
    }
]

@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
@require_auth()
def get_notifications():
    unread_count = len([n for n in MOCK_NOTIFICATIONS if not n.get('read')])
    return jsonify({
        "success": True,
        "unread_count": unread_count,
        "notifications": MOCK_NOTIFICATIONS
    })

@bp.route('/<notif_id>/read', methods=['POST'])
@require_auth()
def mark_notification_read(notif_id):
    for n in MOCK_NOTIFICATIONS:
        if n['id'] == notif_id:
            n['read'] = True
            return jsonify({"success": True, "message": "Marked read"})
    return jsonify({"success": False, "error": "Notification not found"}), 404

@bp.route('/read-all', methods=['POST'])
@require_auth()
def mark_all_read():
    for n in MOCK_NOTIFICATIONS:
        n['read'] = True
    return jsonify({"success": True, "message": "All marked as read"})

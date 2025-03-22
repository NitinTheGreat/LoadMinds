from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime
import pytz
import urllib.parse
import os
import ssl

app = Flask(__name__)
CORS(app)  
# since password contains @ symbol, we need to encode it
password = urllib.parse.quote_plus("Thegre@t1")

#  absolute path to the SSL certificate
current_dir = os.path.dirname(os.path.abspath(__file__))
ssl_cert_path = os.path.join(current_dir, "DigiCertGlobalRootCA.crt.pem")
print(f"SSL certificate path: {ssl_cert_path}")

if not os.path.exists(ssl_cert_path):
    print(f"WARNING: SSL certificate file not found at {ssl_cert_path}")

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f'mysql+pymysql://adminlogin:{password}@taskflow-mysql.mysql.database.azure.com:3306/taskflow'
    f'?ssl_ca={ssl_cert_path}'
)

app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {
        'ssl': {
            'ca': ssl_cert_path,
            'check_hostname': True,
            'verify_mode': ssl.CERT_REQUIRED
        }
    }
}

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ist = pytz.timezone('Asia/Kolkata')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(20), default="medium")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(ist))

    def to_dict(self):
        result = {
            'id': self.id,
            'title': self.title,
            'created_at': self.created_at.isoformat()
        }
        
        try:
            result['description'] = self.description if self.description else ''
        except:
            result['description'] = ''
            
        try:
            result['priority'] = self.priority if self.priority else 'medium'
        except:
            result['priority'] = 'medium'
            
        return result

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400
    
    new_task = Task(title=data['title'])
    try:
        if 'description' in data:
            new_task.description = data['description']
    except:
        pass
        
    try:
        if 'priority' in data:
            new_task.priority = data['priority']
    except:
        pass
    
    db.session.add(new_task)
    
    try:
        db.session.commit()
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({"message": "Task deleted successfully"}), 200

@app.route('/api/debug', methods=['GET'])
def debug_database():
    tasks = Task.query.all()
    return jsonify({
        'task_count': len(tasks),
        'tasks': [task.to_dict() for task in tasks]
    })
# For connection to azure check


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Server is running"}), 200

# Add a connection test endpoint to verify database connectivity
@app.route('/api/test-connection', methods=['GET'])
def test_connection():
    try:
        # Use text() function for raw SQL
        result = db.session.execute(text("SELECT 1"))
        print(f"Test connection result: {result}")
        return jsonify({"status": "ok", "message": "Database connection successful"}), 200
    except Exception as e:
        print(f"Test connection error: {str(e)}")
        return jsonify({"status": "error", "message": f"Database connection failed: {str(e)}"}), 500

if __name__ == '__main__':
    try:
        with app.app_context():
            print("Attempting to connect to database...")
            result = db.session.execute(text("SELECT 1"))
            print(f"Database connection successful! Result: {result}")
            
            # Create tables if they don't exist
            print("Creating tables...")
            db.create_all()
            print("Tables created successfully!")
        
        print("Starting Flask server...")
        app.run(debug=True)
    except Exception as e:
        print(f"Error during startup: {str(e)}")
        # Print more detailed error information
        import traceback
        traceback.print_exc()

print("Flask server with MySQL integration ready!")


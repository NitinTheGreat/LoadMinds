from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MySQL Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:thegreat1@localhost/taskflow'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(20), default="medium")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        result = {
            'id': self.id,
            'title': self.title,
            'created_at': self.created_at.isoformat()
        }
        
        # Safely add description and priority if they exist
        try:
            result['description'] = self.description if self.description else ''
        except:
            result['description'] = ''
            
        try:
            result['priority'] = self.priority if self.priority else 'medium'
        except:
            result['priority'] = 'medium'
            
        return result

# API Routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400
    
    # Create a new task with only the title and created_at fields
    # This will work even if the other columns don't exist yet
    new_task = Task(title=data['title'])
    
    # Try to set description and priority if the columns exist
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

# Create tables and run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)

print("Flask server with MySQL integration ready!")

@app.route('/api/debug', methods=['GET'])
def debug_database():
    tasks = Task.query.all()
    return jsonify({
        'task_count': len(tasks),
        'tasks': [task.to_dict() for task in tasks]
    })
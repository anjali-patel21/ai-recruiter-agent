# app.py
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from db_config import db

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with app
db.init_app(app)

# Register Blueprint inside the function to avoid circular import
def register_blueprints():
    from routes.auth_routes import auth_bp  # Import blueprints here
    from routes.chat import chat_bp  # Import blueprints here
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)

# Register Blueprints after app initialization
register_blueprints()

# Create tables if they don't exist
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return "Helix Recruiter Agent Backend Running!"

if __name__ == '__main__':
    app.run(debug=True)

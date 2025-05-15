from flask import Blueprint, request, jsonify
from services.openai_agent import chat_with_helix, refine_step


chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat_handler():
   
    data = request.get_json()
    user_input = data.get("message")
    user_id = data.get("user_id")
    current_steps = data.get("current_steps")  

    
    if any(kw in user_input.lower() for kw in ["update", "change", "revise", "shorten", "rewrite", "edit"]) and current_steps:
        result = refine_step(user_input, user_id, current_steps)
    else:
        result = chat_with_helix(user_input, user_id, current_steps)


    return jsonify(result)

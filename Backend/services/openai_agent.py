import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat_with_helix(user_message, user_id, current_steps=None):
    # Final prompt with few-shot structure enforcement
    system_prompt = (
        "You are Helix, an AI recruiting assistant for a busy recruiter. "
        "Start by asking natural clarifying questions in a conversational tone to gather role details: tech stack, domain, seniority, location, etc. "
        "Do not generate a sequence until you have enough information. "
        "When ready, create a 3 to 4 step recruiting execution sequence. "
        "Each step must follow this strict format:\n\n"
        "Example format:\n"
        "1. Job Description\n"
        "[Insert full job description here]\n\n"
        "2. LinkedIn Candidate Search\n"
        "[Insert detailed instruction for candidate search here]\n\n"
        "3. Outreach Email Draft\n"
        "[Insert full email here]\n\n"
        "Important:\n"
        "- Number steps clearly (1., 2., 3., 4.)\n"
        "- Include a short step title, then detailed content under it.\n"
        "- Drafts must be complete. Actions must be clearly instructive.\n"
        "- Do NOT just list titles. Do NOT write 'I will' or 'You should'."
    )

    # Build message history
    messages = [{"role": "system", "content": system_prompt}]

    if current_steps:
        formatted = "\n".join([f"{i+1}. {step}" for i, step in enumerate(current_steps)])
        messages.append({
            "role": "system",
            "content": f"Here is the sequence currently being refined:\n{formatted}"
        })

    messages.append({"role": "user", "content": user_message})

    # Send request to OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    reply = response.choices[0].message.content.strip()

    # --- Sequence detection logic starts here ---
    lines = reply.split("\n")
    steps = []
    current_step = ""

    for line in lines:
        stripped = line.strip()
        if stripped.startswith(("1.", "2.", "3.", "4.")):
            if current_step:
                steps.append(current_step.strip())
            current_step = stripped
        else:
            current_step += "\n" + stripped

    if current_step:
        steps.append(current_step.strip())

    # Define condition for valid sequence
    is_actionable = (
        3 <= len(steps) <= 4 and
        all(len(step.split("\n")) > 1 for step in steps) and
        all(not step.strip().endswith("?") for step in steps)
    )

    # If valid sequence → send to workspace
    if is_actionable:
        print("[DEBUG] Generated Sequence Steps:", steps)
        return {
            "type": "sequence",
            "status": "complete",
            "steps": steps,
            "message": "Sequence generated"
        }

    # Else → treat as normal chat response
    print("[DEBUG] Chat Reply:", reply)
    return {
        "type": "chat",
        "content": reply
    }

def refine_step(feedback_message, user_id, current_steps):
    """
    Refines a specific step in the sequence based on user feedback.
    Returns updated steps list.
    """
    system_prompt = (
        "You are Helix, an AI recruiting assistant. A user has given feedback to improve a specific step in a recruiting sequence. "
        "You will revise ONLY the requested step and return it in the same format. "
        "Do NOT rewrite the whole sequence. Just return the updated step (starting with the correct number and title)."
    )

    messages = [{"role": "system", "content": system_prompt}]

    formatted_sequence = "\n".join([f"{i+1}. {step}" for i, step in enumerate(current_steps)])
    messages.append({
        "role": "system",
        "content": f"Here is the current sequence:\n{formatted_sequence}"
    })
    messages.append({"role": "user", "content": feedback_message})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    reply = response.choices[0].message.content.strip()

    # Try to find the updated step number
    if reply.startswith(("1.", "2.", "3.", "4.")):
        step_number = int(reply[0]) - 1
        if 0 <= step_number < len(current_steps):
            current_steps[step_number] = reply
            return {
                "type": "sequence",
                "status": "updated",
                "steps": current_steps,
                "message": f"Step {step_number + 1} updated"
            }

    return {
        "type": "chat",
        "content": "Sorry, I couldn't process that update correctly. Can you rephrase?"
    }


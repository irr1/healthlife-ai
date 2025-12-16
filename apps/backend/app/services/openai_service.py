"""
OpenAI API Integration Service

This module provides integration with OpenAI API for:
- Generating personalized health plans
- AI coach chat functionality
- Health insights and recommendations
"""
from typing import Optional, Dict, Any, List
from openai import OpenAI
import json

from app.core.config import settings

# OpenAI client instance (initialized lazily)
_client: Optional[OpenAI] = None


def get_openai_client() -> OpenAI:
    """Get or create OpenAI client instance"""
    global _client
    if _client is None:
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")

        # Log API key info (first 10 and last 4 characters for security)
        key_preview = f"{api_key[:10]}...{api_key[-4:]}" if len(api_key) > 14 else "***"
        print(f"🔑 Initializing OpenAI client with key: {key_preview}")

        _client = OpenAI(api_key=api_key)
    return _client


def generate_health_plan(
    user_data: Dict[str, Any],
    goals: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate a personalized health plan using OpenAI GPT-4

    Args:
        user_data: User profile data (age, weight, activity level, etc.)
        goals: User's health goals

    Returns:
        Dict containing roadmap with phases, timeline, and tasks
    """
    # Build context from user data
    context = f"""
You are a professional health and fitness coach. Create a personalized 12-week health journey plan.

User Profile:
- Age: {user_data.get('age', 'Not provided')}
- Gender: {user_data.get('gender', 'Not provided')}
- Current Weight: {user_data.get('current_weight', 'Not provided')} kg
- Goal Weight: {user_data.get('goal_weight', 'Not provided')} kg
- Height: {user_data.get('height', 'Not provided')} cm
- Activity Level: {user_data.get('activity_level', 'Not provided')}
- Goals: {goals or user_data.get('goals', 'General health improvement')}

Create a structured plan with:
1. Three phases (Foundation, Progress, Optimization)
2. Each phase should have:
   - Name
   - Duration (in weeks)
   - Specific goals
   - Measurable milestones
3. Total timeline of 12 weeks

Return ONLY a valid JSON object with this exact structure:
{{
    "phases": [
        {{
            "name": "Phase name",
            "duration": "X weeks",
            "goals": ["goal1", "goal2"],
            "milestones": ["milestone1", "milestone2"]
        }}
    ],
    "timeline": {{
        "total_duration": "12 weeks",
        "estimated_completion": "Description"
    }}
}}
"""

    try:
        print("🤖 Attempting to generate health plan with OpenAI...")
        client = get_openai_client()
        print(f"✅ OpenAI client initialized successfully")

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional health and fitness coach. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": context
                }
            ],
            temperature=0.7,
            max_tokens=1000,
            response_format={"type": "json_object"},
            timeout=30.0  # 30 second timeout
        )

        # Parse the response
        roadmap = json.loads(response.choices[0].message.content)
        print(f"✅ Successfully generated AI health plan with {len(roadmap.get('phases', []))} phases")
        return roadmap

    except Exception as e:
        print(f"❌ OpenAI API error: {type(e).__name__}: {e}")
        # Fallback to stub data if OpenAI fails
        return {
            "phases": [
                {
                    "name": "Foundation Phase",
                    "duration": "2 weeks",
                    "goals": ["Establish baseline habits", "Track current metrics"],
                    "milestones": ["Complete daily tracking for 14 days", "First biometric measurements"]
                },
                {
                    "name": "Progress Phase",
                    "duration": "4 weeks",
                    "goals": ["Build sustainable habits", "See measurable progress"],
                    "milestones": ["10% progress toward goal", "Consistent weekly tracking"]
                },
                {
                    "name": "Optimization Phase",
                    "duration": "6 weeks",
                    "goals": ["Fine-tune approach", "Accelerate results"],
                    "milestones": ["50% progress toward goal", "Habit consistency above 80%"]
                }
            ],
            "timeline": {
                "total_duration": "12 weeks",
                "estimated_completion": "Based on current progress rate"
            }
        }


def chat_with_coach(
    message: str,
    user_context: Optional[Dict[str, Any]] = None,
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Chat with AI health coach using OpenAI

    Args:
        message: User's message
        user_context: Optional user data for context
        conversation_history: Previous messages in the conversation

    Returns:
        Dict containing response and suggestions
    """
    # Build system prompt
    system_prompt = """You are an empathetic and knowledgeable health and fitness coach.
Your role is to provide personalized advice, motivation, and guidance.

Guidelines:
- Be supportive and encouraging
- Provide specific, actionable advice
- Ask follow-up questions to understand better
- Reference user's goals and progress when relevant
- Keep responses concise (2-3 paragraphs max)
"""

    # Add user context if available
    if user_context:
        system_prompt += f"\n\nUser Context:\n"
        if user_context.get('goals'):
            system_prompt += f"- Goals: {user_context['goals']}\n"
        if user_context.get('activity_level'):
            system_prompt += f"- Activity Level: {user_context['activity_level']}\n"

    # Build messages
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    if conversation_history:
        messages.extend(conversation_history[-6:])  # Keep last 3 exchanges (6 messages)

    # Add current message
    messages.append({"role": "user", "content": message})

    try:
        print(f"🤖 Processing coach chat message: '{message[:50]}...'")
        client = get_openai_client()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.8,
            max_tokens=500,
            timeout=30.0  # 30 second timeout
        )

        coach_response = response.choices[0].message.content
        print(f"✅ AI coach response generated successfully")

        # Generate suggestions (could be enhanced with another API call)
        suggestions = [
            "How can I improve my routine?",
            "What should I focus on this week?",
            "Can you explain this concept more?"
        ]

        return {
            "response": coach_response,
            "suggestions": suggestions
        }

    except Exception as e:
        print(f"❌ OpenAI chat error: {type(e).__name__}: {e}")
        # Fallback response
        return {
            "response": "I understand your question. As your health coach, I'm here to help you achieve your goals through consistent, sustainable habits. Could you tell me more about what specific aspect you'd like to focus on?",
            "suggestions": [
                "How can I improve my morning routine?",
                "What should I track to measure progress?",
                "Can you help me with meal planning?"
            ]
        }


def generate_daily_insight(user_data: Dict[str, Any]) -> str:
    """
    Generate a personalized daily insight

    Args:
        user_data: User profile and recent activity data

    Returns:
        Daily insight message
    """
    context = f"""
Generate a brief, motivational daily insight for a health and fitness user.

User Info:
- Goals: {user_data.get('goals', 'health improvement')}
- Recent activity: {user_data.get('recent_activity', 'tracking daily tasks')}

Create a short (1-2 sentences), personalized, and actionable insight that:
- Acknowledges their progress
- Provides a specific tip or encouragement
- Is motivating but realistic

Respond with just the insight text, no formatting or extra explanations.
"""

    try:
        print("🤖 Generating daily insight with OpenAI...")
        client = get_openai_client()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive health coach providing daily insights. Be concise and motivating."
                },
                {
                    "role": "user",
                    "content": context
                }
            ],
            temperature=0.9,
            max_tokens=100,
            timeout=15.0  # 15 second timeout (shorter for quick insights)
        )

        insight = response.choices[0].message.content.strip()
        print(f"✅ AI daily insight generated successfully")
        return insight

    except Exception as e:
        print(f"❌ OpenAI daily insight error: {type(e).__name__}: {e}")
        # Fallback insight
        return "Every small step counts! Focus on consistency today, and trust the process. Your dedication is building the foundation for lasting change."

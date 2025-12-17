"""
Plan Generator Module

Generates personalized health roadmaps and weekly tasks using OpenAI GPT-4.
Includes safety rules and user constraint handling.
"""

from typing import Dict, Any, List, Optional
from datetime import date, timedelta
from openai import OpenAI
import json

from app.core.config import settings

# OpenAI client instance (lazy initialization)
_client: Optional[OpenAI] = None


def get_openai_client() -> OpenAI:
    """Get or create OpenAI client instance"""
    global _client
    if _client is None:
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")

        key_preview = f"{api_key[:10]}...{api_key[-4:]}" if len(api_key) > 14 else "***"
        print(f"🔑 Initializing OpenAI client: {key_preview}")

        _client = OpenAI(api_key=api_key)
    return _client


def _apply_safety_rules(user_data: Dict[str, Any]) -> List[str]:
    """
    Apply hard safety rules based on user constraints

    Returns list of safety constraints to include in AI prompt
    """
    constraints = []

    age = user_data.get('age')
    if age:
        if age < 18:
            constraints.append("User is under 18: Only light exercises, no heavy weights")
        elif age > 65:
            constraints.append("User is senior (65+): Focus on low-impact exercises, flexibility, balance")

    # BMI calculation and constraints
    height_cm = user_data.get('height')
    weight_kg = user_data.get('current_weight')
    if height_cm and weight_kg:
        height_m = height_cm / 100
        bmi = weight_kg / (height_m ** 2)

        if bmi < 18.5:
            constraints.append("User is underweight (BMI < 18.5): Focus on strength building, avoid excessive cardio")
        elif bmi > 30:
            constraints.append("User has obesity (BMI > 30): Start with low-impact exercises, gradual progression")

    # Activity level constraints
    activity_level = user_data.get('activity_level')
    if activity_level and activity_level.lower() == 'sedentary':
        constraints.append("User is sedentary: Start very gradually, max 20-30 min sessions initially")

    return constraints


def generate_roadmap(user_data: Dict[str, Any], goal: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate a 12-week personalized health roadmap with 3 phases

    Args:
        user_data: User profile (age, weight, height, activity_level, goals, etc.)
        goal: Specific goal override

    Returns:
        Dict with structure:
        {
            "phases": [
                {
                    "name": str,
                    "duration": str,
                    "goals": [str],
                    "milestones": [str]
                }
            ],
            "timeline": {
                "total_duration": str,
                "estimated_completion": str
            }
        }
    """
    # Apply safety constraints
    safety_rules = _apply_safety_rules(user_data)
    safety_section = "\n".join(f"- {rule}" for rule in safety_rules) if safety_rules else "No special constraints"

    # Build detailed context
    context = f"""
You are a professional certified health and fitness coach creating a personalized 12-week health journey.

User Profile:
- Age: {user_data.get('age', 'Not provided')}
- Gender: {user_data.get('gender', 'Not provided')}
- Current Weight: {user_data.get('current_weight', 'Not provided')} kg
- Goal Weight: {user_data.get('goal_weight', 'Not provided')} kg
- Height: {user_data.get('height', 'Not provided')} cm
- Activity Level: {user_data.get('activity_level', 'Not provided')}
- Primary Goals: {goal or user_data.get('goals', 'General health improvement')}

SAFETY CONSTRAINTS (MUST FOLLOW):
{safety_section}

Create a structured 12-week roadmap with EXACTLY 3 progressive phases:

Phase 1 (Foundation): Weeks 1-4
- Focus on building baseline habits
- Gradual introduction to exercise
- Establishing routines

Phase 2 (Progress): Weeks 5-8
- Increase intensity progressively
- Build on established habits
- Introduce variety

Phase 3 (Optimization): Weeks 9-12
- Fine-tune approach
- Maximize results
- Prepare for long-term sustainability

Return ONLY valid JSON with this EXACT structure:
{{
    "phases": [
        {{
            "name": "Foundation",
            "duration": "4 weeks",
            "goals": ["specific goal 1", "specific goal 2", "specific goal 3"],
            "milestones": ["measurable milestone 1", "measurable milestone 2"]
        }},
        {{
            "name": "Progress",
            "duration": "4 weeks",
            "goals": ["specific goal 1", "specific goal 2", "specific goal 3"],
            "milestones": ["measurable milestone 1", "measurable milestone 2"]
        }},
        {{
            "name": "Optimization",
            "duration": "4 weeks",
            "goals": ["specific goal 1", "specific goal 2", "specific goal 3"],
            "milestones": ["measurable milestone 1", "measurable milestone 2"]
        }}
    ],
    "timeline": {{
        "total_duration": "12 weeks",
        "estimated_completion": "Specific completion description based on user's goal"
    }}
}}
"""

    try:
        print("🤖 Generating roadmap with OpenAI (with safety rules)...")
        client = get_openai_client()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a certified health and fitness coach. Always prioritize user safety. Respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": context
                }
            ],
            temperature=0.7,
            max_tokens=1500,
            response_format={"type": "json_object"},
            timeout=30.0
        )

        roadmap = json.loads(response.choices[0].message.content)
        print(f"✅ Generated roadmap with {len(roadmap.get('phases', []))} phases")
        return roadmap

    except Exception as e:
        print(f"❌ Roadmap generation error: {type(e).__name__}: {e}")
        # Fallback roadmap
        return {
            "phases": [
                {
                    "name": "Foundation",
                    "duration": "4 weeks",
                    "goals": ["Establish daily movement habit", "Track nutrition basics", "Build consistency"],
                    "milestones": ["14 days of activity logged", "Baseline measurements taken"]
                },
                {
                    "name": "Progress",
                    "duration": "4 weeks",
                    "goals": ["Increase activity intensity", "Improve nutrition quality", "Build strength"],
                    "milestones": ["30% progress toward goal", "Improved energy levels"]
                },
                {
                    "name": "Optimization",
                    "duration": "4 weeks",
                    "goals": ["Maximize results", "Fine-tune habits", "Prepare for maintenance"],
                    "milestones": ["70% progress toward goal", "Sustainable routine established"]
                }
            ],
            "timeline": {
                "total_duration": "12 weeks",
                "estimated_completion": "Gradual progress with sustainable habits"
            }
        }


def generate_weekly_tasks(
    user_data: Dict[str, Any],
    phase: Dict[str, Any],
    week_number: int = 1,
    start_date: Optional[date] = None
) -> List[Dict[str, Any]]:
    """
    Generate AI-powered weekly tasks (7 days) for a specific phase

    Args:
        user_data: User profile
        phase: Current phase from roadmap
        week_number: Week number within the phase (1-4)
        start_date: Start date for tasks (default: today)

    Returns:
        List of task dictionaries with structure:
        [
            {
                "title": str,
                "description": str,
                "priority": "low"|"medium"|"high",
                "scheduled_date": date,
                "time_of_day": "morning"|"afternoon"|"evening"|"anytime",
                "duration_minutes": int
            }
        ]
    """
    if start_date is None:
        start_date = date.today()

    # Apply safety constraints
    safety_rules = _apply_safety_rules(user_data)
    safety_section = "\n".join(f"- {rule}" for rule in safety_rules) if safety_rules else "No special constraints"

    context = f"""
You are creating a weekly task plan (7 days) for a user in their health journey.

User Profile:
- Age: {user_data.get('age', 'Not provided')}
- Activity Level: {user_data.get('activity_level', 'Not provided')}
- Goals: {user_data.get('goals', 'General health')}

Current Phase: {phase.get('name', 'Unknown')}
Phase Goals: {', '.join(phase.get('goals', []))}
Week Number: {week_number} of 4

SAFETY CONSTRAINTS (MUST FOLLOW):
{safety_section}

Generate EXACTLY 7 days of tasks (Monday to Sunday). Each day should have 2-4 tasks covering:
- Exercise/Movement (appropriate intensity for week {week_number})
- Nutrition/Hydration
- Recovery/Rest (especially important for rest days)
- Habit tracking

Guidelines:
- Week 1: Lighter intensity, focus on habit formation
- Week 2-3: Gradually increase intensity
- Week 4: Peak week with higher intensity
- Include 1-2 rest/recovery days per week
- Vary activities to prevent boredom
- Tasks should be specific and measurable

Return ONLY valid JSON array with this structure:
[
    {{
        "day": 1,
        "title": "Specific task title",
        "description": "Detailed description with clear instructions",
        "priority": "high" or "medium" or "low",
        "time_of_day": "morning" or "afternoon" or "evening" or "anytime",
        "duration_minutes": integer (5-60)
    }}
]

Generate tasks for all 7 days (day 1-7).
"""

    try:
        print(f"🤖 Generating weekly tasks for week {week_number}...")
        client = get_openai_client()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a certified fitness coach creating safe, progressive weekly plans. Respond with valid JSON array only."
                },
                {
                    "role": "user",
                    "content": context
                }
            ],
            temperature=0.8,
            max_tokens=2000,
            response_format={"type": "json_object"},
            timeout=30.0
        )

        result = json.loads(response.choices[0].message.content)
        tasks_raw = result.get('tasks', result.get('weekly_tasks', []))

        # Convert to proper format with dates
        tasks = []
        for i, task in enumerate(tasks_raw[:7]):  # Ensure max 7 days
            task_date = start_date + timedelta(days=i)
            tasks.append({
                "title": task.get("title", f"Day {i+1} Task"),
                "description": task.get("description", ""),
                "priority": task.get("priority", "medium"),
                "scheduled_date": task_date,
                "time_of_day": task.get("time_of_day", "anytime"),
                "duration_minutes": task.get("duration_minutes", 30)
            })

        print(f"✅ Generated {len(tasks)} weekly tasks")
        return tasks

    except Exception as e:
        print(f"❌ Weekly task generation error: {type(e).__name__}: {e}")
        # Fallback to basic tasks
        return _generate_fallback_week(start_date, week_number)


def _generate_fallback_week(start_date: date, week_number: int) -> List[Dict[str, Any]]:
    """Generate fallback weekly tasks if AI fails"""
    base_tasks = [
        # Monday
        {"title": "Morning Walk", "description": "30-minute brisk walk", "priority": "high", "time_of_day": "morning", "duration_minutes": 30},
        {"title": "Track Meals", "description": "Log all meals and water intake", "priority": "medium", "time_of_day": "anytime", "duration_minutes": 10},
        # Tuesday
        {"title": "Strength Training", "description": "20-minute bodyweight exercises", "priority": "high", "time_of_day": "morning", "duration_minutes": 20},
        {"title": "Meal Prep", "description": "Prepare healthy lunch and snacks", "priority": "medium", "time_of_day": "evening", "duration_minutes": 30},
        # Wednesday
        {"title": "Yoga Session", "description": "Gentle yoga for flexibility", "priority": "medium", "time_of_day": "morning", "duration_minutes": 25},
        {"title": "Hydration Check", "description": "Drink 8 glasses of water", "priority": "high", "time_of_day": "anytime", "duration_minutes": 5},
        # Thursday
        {"title": "Cardio Workout", "description": "30-minute moderate cardio", "priority": "high", "time_of_day": "morning", "duration_minutes": 30},
        {"title": "Healthy Dinner", "description": "Cook balanced dinner with veggies", "priority": "medium", "time_of_day": "evening", "duration_minutes": 25},
        # Friday
        {"title": "Active Recovery", "description": "Light stretching and mobility", "priority": "medium", "time_of_day": "morning", "duration_minutes": 20},
        {"title": "Weekly Review", "description": "Review progress and plan next week", "priority": "medium", "time_of_day": "evening", "duration_minutes": 15},
        # Saturday
        {"title": "Outdoor Activity", "description": "Hiking, cycling, or sports", "priority": "high", "time_of_day": "morning", "duration_minutes": 45},
        {"title": "Meal Planning", "description": "Plan meals for next week", "priority": "medium", "time_of_day": "afternoon", "duration_minutes": 20},
        # Sunday - Rest Day
        {"title": "Gentle Stretching", "description": "Light stretching and relaxation", "priority": "low", "time_of_day": "morning", "duration_minutes": 15},
        {"title": "Self-Care", "description": "Rest, recovery, and reflection", "priority": "low", "time_of_day": "anytime", "duration_minutes": 30},
    ]

    # Create tasks for 7 days
    tasks = []
    for i in range(7):
        day_tasks = base_tasks[i*2:(i+1)*2] if i < 6 else base_tasks[-2:]  # Sunday gets last 2
        for task in day_tasks:
            task_copy = task.copy()
            task_copy["scheduled_date"] = start_date + timedelta(days=i)
            tasks.append(task_copy)

    return tasks

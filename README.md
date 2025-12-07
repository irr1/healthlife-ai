# HealthLife AI

AI-powered personalized health and lifestyle coaching application.

## Architecture

HealthLife AI follows a 5-pillar structure:

1. **Focus (Dashboard)** - Daily tasks and energy tracking
2. **Journey (Plan)** - Strategic roadmap and weekly sprints
3. **AI Coach** - Intelligent chat interface and insights
4. **You (Profile)** - Bio metrics, progress tracking, and habits
5. **Tribe (Community)** - Squads, challenges, and leaderboards

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: SQLAlchemy
- **AI**: OpenAI API, LangChain
- **Task Queue**: Celery

## Project Structure

```
healthlife-ai/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── (dashboard)/
│   │   │   │       ├── focus/      # Dashboard & Today's tasks
│   │   │   │       ├── journey/    # Roadmap & Milestones
│   │   │   │       ├── coach/      # AI Chat Interface
│   │   │   │       ├── you/        # Profile & Progress
│   │   │   │       └── tribe/      # Community & Squads
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── backend/                # FastAPI Backend
│       ├── app/
│       │   ├── core/           # Config & Security
│       │   ├── api/            # API Endpoints
│       │   ├── services/
│       │   │   ├── ai_engine/  # Plan generation & adaptation
│       │   │   ├── recovery/   # Failure recovery logic
│       │   │   └── analytics/  # Progress tracking
│       │   ├── models/         # SQLAlchemy models
│       │   ├── schemas/        # Pydantic schemas
│       │   └── db/             # Database utilities
│       └── requirements.txt
│
├── packages/                   # Shared packages
│   └── shared/
│       ├── types/              # Shared TypeScript types
│       ├── utils/              # Shared utilities
│       └── constants/          # Shared constants
│
├── docker-compose.yml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional)
- PostgreSQL 16+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healthlife-ai
```

2. Install frontend dependencies:
```bash
cd apps/web
npm install
```

3. Install backend dependencies:
```bash
cd apps/backend
pip install -r requirements.txt
# or using Poetry
poetry install
```

4. Set up environment variables:
```bash
# Frontend
cp apps/web/.env.example apps/web/.env.local

# Backend
cp apps/backend/.env.example apps/backend/.env
```

5. Start the databases (with Docker):
```bash
docker-compose up postgres redis -d
```

6. Run migrations:
```bash
cd apps/backend
alembic upgrade head
```

### Development

Start all services:
```bash
npm run dev
```

Or start services individually:

```bash
# Frontend (http://localhost:3000)
npm run dev:web

# Backend (http://localhost:8000)
npm run dev:backend
```

### Using Docker

Start all services with Docker Compose:
```bash
docker-compose up
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Key Features

### Free Tier
- Static plan generation (one-time)
- Basic task names
- Basic analytics (weight, completed tasks)
- General community challenges

### Pro Tier (HealthLife+)
- Dynamic plan adaptation
- Detailed tasks with recipes & videos
- AI Chat & Daily Insights
- Correlation analytics & predictions
- Private squads
- Unlimited plan regenerations

## AI Logic

### Context Window
The AI accumulates hidden parameters:
- Tiredness patterns
- Food preferences
- Exercise preferences
- Time-of-day productivity

### Failure Recovery
When a user returns after 3+ days of inactivity:
- Old tasks are cleared (not shown as failed)
- Plan is recalculated
- Gentle re-onboarding with easy tasks

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

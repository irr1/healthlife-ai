# HealthLife AI - Project Structure

```
healthlife-ai/
│
├── apps/                                # Applications
│   ├── web/                            # Next.js Frontend
│   │   ├── public/                     # Static assets
│   │   ├── src/
│   │   │   ├── app/                    # Next.js App Router
│   │   │   │   ├── layout.tsx         # Root layout
│   │   │   │   └── (dashboard)/       # Dashboard group route
│   │   │   │       ├── layout.tsx     # Dashboard layout
│   │   │   │       ├── focus/         # 🏠 Focus - Today's tasks
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── journey/       # 🗺 Journey - Roadmap & Milestones
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── coach/         # 🧠 AI Coach - Chat & Insights
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── you/           # 📊 You - Profile & Progress
│   │   │   │       │   └── page.tsx
│   │   │   │       └── tribe/         # 🔥 Tribe - Community
│   │   │   │           └── page.tsx
│   │   │   ├── components/            # React components
│   │   │   │   ├── focus/            # Focus page components
│   │   │   │   ├── journey/          # Journey page components
│   │   │   │   ├── coach/            # Coach page components
│   │   │   │   ├── you/              # Profile page components
│   │   │   │   ├── tribe/            # Community page components
│   │   │   │   ├── ui/               # Reusable UI components
│   │   │   │   └── shared/           # Shared components
│   │   │   ├── lib/                   # Utility functions
│   │   │   │   └── utils.ts
│   │   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── types/                 # TypeScript types
│   │   │   └── styles/                # Global styles
│   │   │       └── globals.css
│   │   ├── .env.example
│   │   ├── .eslintrc.json
│   │   ├── Dockerfile
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── backend/                        # FastAPI Backend
│       ├── app/
│       │   ├── main.py                # Application entry point
│       │   ├── core/                  # Core configuration
│       │   │   ├── __init__.py
│       │   │   └── config.py         # Settings & environment
│       │   ├── api/                   # API layer
│       │   │   ├── __init__.py
│       │   │   ├── deps.py           # Shared dependencies
│       │   │   └── v1/               # API version 1
│       │   │       ├── __init__.py
│       │   │       ├── router.py     # Main API router
│       │   │       └── endpoints/    # API endpoints
│       │   │           ├── __init__.py
│       │   │           ├── auth.py   # Authentication
│       │   │           ├── users.py  # User management
│       │   │           ├── plans.py  # Plan generation
│       │   │           ├── tasks.py  # Task management
│       │   │           ├── journey.py # Journey/Roadmap
│       │   │           ├── coach.py   # AI Coach chat
│       │   │           └── analytics.py # Analytics & insights
│       │   ├── services/              # Business logic
│       │   │   ├── __init__.py
│       │   │   ├── ai_engine/        # AI plan generation
│       │   │   │   └── __init__.py
│       │   │   ├── recovery/         # Failure recovery logic
│       │   │   │   └── __init__.py
│       │   │   └── analytics/        # Analytics service
│       │   │       └── __init__.py
│       │   ├── models/                # SQLAlchemy ORM models
│       │   │   └── __init__.py
│       │   ├── schemas/               # Pydantic schemas
│       │   │   └── __init__.py
│       │   └── db/                    # Database utilities
│       │       ├── __init__.py
│       │       └── base.py           # Database session
│       ├── tests/                     # Tests
│       │   ├── api/                  # API tests
│       │   └── services/             # Service tests
│       ├── .env.example
│       ├── Dockerfile
│       ├── pyproject.toml            # Poetry configuration
│       └── requirements.txt          # Python dependencies
│
├── packages/                           # Shared packages
│   └── shared/                        # Shared code between apps
│       ├── types/                    # Shared TypeScript types
│       ├── utils/                    # Shared utilities
│       └── constants/                # Shared constants
│
├── docs/                              # Documentation
│
├── scripts/                           # Utility scripts
│   └── setup.sh                      # Setup script
│
├── .env.example                       # Root environment variables
├── .gitignore                         # Git ignore rules
├── ARCHITECTURE.md                    # Architecture documentation
├── CONTRIBUTING.md                    # Contribution guidelines
├── docker-compose.yml                 # Docker services configuration
├── package.json                       # Root package.json (monorepo)
├── PROJECT_STRUCTURE.md              # This file
└── README.md                          # Project README
```

## Key Directories

### Frontend (`apps/web`)
- **focus/** - Dashboard with today's tasks, energy input, and quick logging
- **journey/** - Visual roadmap, milestones, and weekly review
- **coach/** - AI chat interface and daily insights
- **you/** - Profile, body battery, habit grid, biometrics
- **tribe/** - Squads, challenges, and leaderboard

### Backend (`apps/backend`)
- **api/v1/endpoints/** - RESTful API endpoints
- **services/ai_engine/** - AI plan generation and adaptation logic
- **services/recovery/** - Failure recovery system (3-day return logic)
- **services/analytics/** - Progress tracking and correlation analysis
- **models/** - Database models (User, Plan, Task, etc.)
- **schemas/** - Request/response validation schemas

## Tech Stack Summary

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State)
- TanStack Query (Data fetching)
- Framer Motion (Animations)

**Backend:**
- FastAPI (Python 3.11+)
- PostgreSQL (Database)
- Redis (Cache)
- SQLAlchemy (ORM)
- OpenAI API (AI)
- LangChain (AI framework)

**Infrastructure:**
- Docker & Docker Compose
- Nginx (Production)
- GitHub Actions (CI/CD)

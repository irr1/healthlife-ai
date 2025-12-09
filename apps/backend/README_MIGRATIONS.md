# Database Migrations Guide

This guide explains how to work with Alembic database migrations for HealthLife AI.

## Prerequisites

- PostgreSQL running (via Docker Compose or locally)
- Python dependencies installed (`pip install -r requirements.txt`)

## Starting PostgreSQL

Start PostgreSQL using Docker Compose:

```bash
# From project root
docker-compose up -d postgres
```

Check if PostgreSQL is running:

```bash
docker-compose ps postgres
```

## Creating Your First Migration

### 1. Generate Initial Migration

From the `apps/backend` directory:

```bash
cd apps/backend
alembic revision --autogenerate -m "Initial migration: users, plans, tasks, biometrics"
```

This will create a new migration file in `alembic/versions/` with all tables.

### 2. Review the Migration

Open the generated file in `alembic/versions/` and review the changes.

### 3. Apply the Migration

```bash
alembic upgrade head
```

This will create all tables in the database.

## Common Migration Commands

### Check Current Migration Version

```bash
alembic current
```

### View Migration History

```bash
alembic history
```

### Upgrade to Latest

```bash
alembic upgrade head
```

### Downgrade One Version

```bash
alembic downgrade -1
```

### Downgrade to Specific Version

```bash
alembic downgrade <revision_id>
```

### Create New Migration

After modifying models:

```bash
alembic revision --autogenerate -m "Description of changes"
```

## Database Models

### User Model
- **Fields**: email, password, profile info, health metrics
- **Purpose**: User authentication and profile data

### Plan Model
- **Fields**: user_id, title, roadmap (JSON), current_phase
- **Purpose**: Store AI-generated health journey plans

### Task Model
- **Fields**: plan_id, title, status, scheduled_date, priority
- **Purpose**: Daily tasks and activities for users

### Biometric Model
- **Fields**: user_id, metric_type, value, measurement_date
- **Purpose**: Track weight, body fat, steps, sleep, etc.

## Database Schema Visualization

```
users
  └── plans (1:many)
       └── tasks (1:many)
  └── biometrics (1:many)
```

## Troubleshooting

### "Can't locate revision identified by"

Reset alembic_version table:

```sql
TRUNCATE alembic_version;
```

Then re-run migrations.

### Connection Refused

Make sure PostgreSQL is running:

```bash
docker-compose up -d postgres
```

### Migration Conflicts

If you have conflicts, you can:

1. Downgrade to base: `alembic downgrade base`
2. Delete migrations in `alembic/versions/`
3. Recreate: `alembic revision --autogenerate -m "Fresh start"`
4. Apply: `alembic upgrade head`

## Environment Variables

Make sure these are set in your `.env` file:

```env
DATABASE_URL=postgresql+asyncpg://healthlife:healthlife123@localhost:5432/healthlife_ai
```

## Testing Migrations

After creating migrations, test them:

```bash
# Apply migrations
alembic upgrade head

# Verify tables exist
docker-compose exec postgres psql -U healthlife -d healthlife_ai -c "\dt"

# Rollback and re-apply
alembic downgrade base
alembic upgrade head
```

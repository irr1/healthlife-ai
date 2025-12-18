-- Migration: Add daily_metrics table for Body Battery and analytics
-- Created: 2025-12-18

CREATE TABLE IF NOT EXISTS daily_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,

    -- Energy / Body Battery (0-100)
    energy_level INTEGER CHECK (energy_level >= 0 AND energy_level <= 100),

    -- Sleep tracking
    hours_slept FLOAT CHECK (hours_slept >= 0 AND hours_slept <= 24),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),

    -- Mood and stress
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),

    -- Body metrics
    weight FLOAT CHECK (weight > 0),

    -- Activity summary (calculated from tasks)
    tasks_completed INTEGER DEFAULT 0,
    exercise_minutes INTEGER DEFAULT 0,

    -- Notes
    notes VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),

    -- Constraints
    UNIQUE(user_id, date)  -- One metric per user per day
);

-- Indexes for performance
CREATE INDEX idx_daily_metrics_user_id ON daily_metrics(user_id);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date);

-- Comment
COMMENT ON TABLE daily_metrics IS 'Daily health and performance metrics for Body Battery calculation and analytics';

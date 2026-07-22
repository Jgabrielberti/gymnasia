CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    height SMALLINT,
    age SMALLINT,
    useBiometrics BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE muscle_groups (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE exercise_muscle_groups (
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    muscle_group_id INTEGER NOT NULL REFERENCES muscle_groups(id),

    PRIMARY KEY (exercise_id, muscle_group_id)
);

CREATE TABLE workouts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    workout_date DATE NOT NULL,
    notes TEXT
);

CREATE TABLE workout_exercises (
    id INTEGER PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(id)
);

CREATE TABLE workout_sets (
    id INTEGER PRIMARY KEY,
    workout_exercise_id INTEGER NOT NULL REFERENCES workout_exercises(id),
    set_number SMALLINT NOT NULL,
    reps SMALLINT,
    weight DECIMAL(5,2),
    duration_seconds INTEGER,
    distance_meters REAL,
    rir SMALLINT,
    completed BOOLEAN DEFAULT TRUE
);

CREATE TABLE workout_templates (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_template_exercises (
    id INTEGER PRIMARY KEY,
    workout_template_id INTEGER NOT NULL REFERENCES workout_templates(id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    exercise_order SMALLINT NOT NULL
);

CREATE TABLE meals (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    meal_time TIMESTAMP NOT NULL,
    meal_name TEXT
);

CREATE TABLE micronutrients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    unit TEXT NOT NULL
);

CREATE TABLE foods (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT
);

CREATE TABLE food_nutrients (
    food_id INTEGER NOT NULL REFERENCES foods(id),
    micronutrient_id INTEGER NOT NULL REFERENCES micronutrients(id),
    amount_per_100g REAL NOT NULL,
    PRIMARY KEY (food_id, micronutrient_id)
);

CREATE TABLE nutrition_entries (
    id INTEGER PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES meals(id),
    food_id INTEGER NOT NULL REFERENCES foods(id),
    quantity REAL NOT NULL,
    unit TEXT NOT NULL
);

CREATE TABLE body_weight_logs (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    weight DECIMAL(5,2),
    body_fat_percentage REAL,
    measured_at DATE
);

CREATE TABLE body_measurements (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    chest REAL,
    waist REAL,
    hips REAL,
    left_arm REAL,
    right_arm REAL,
    left_thigh REAL,
    right_thigh REAL,
    measured_at DATE
);

CREATE TABLE personal_records (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    record_type TEXT NOT NULL,
    value REAL NOT NULL,
    achieved_at DATE NOT NULL
);
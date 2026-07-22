import * as SQLite from "expo-sqlite";
import { initialSeeding } from "./initialSeeding";

//SQLite.deleteDatabaseSync('gymnasia.db');

export const db = SQLite.openDatabaseSync("gymnasia.db");

db.execSync("PRAGMA foreign_keys = ON;");

export function initializeDatabase() {
  db.execSync(`
    	CREATE TABLE IF NOT EXISTS body_measurements (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  user_id integer NOT NULL,
		  chest real,
		  waist real,
		  hips real,
		  left_arm real,
		  right_arm real,
		  left_thigh real,
		  right_thigh real,
		  measured_at text,
		  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS body_weight_logs (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  user_id integer NOT NULL,
		  weight real,
		  body_fat_percentage real,
		  measured_at text,
		  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS exercise_muscle_groups (
		  exercise_id integer NOT NULL,
		  muscle_group_id integer NOT NULL,
		  role text NOT NULL CHECK(role IN ('primary', 'secondary')),
		  PRIMARY KEY(exercise_id, muscle_group_id, role),
		  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE no action ON DELETE CASCADE,
		  FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS exercises (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  name text NOT NULL,
		  category text,
		  description text,
		  created_at text NOT NULL
		);

		CREATE TABLE IF NOT EXISTS food_nutrients (
		  food_id integer NOT NULL,
		  micronutrient_id integer NOT NULL,
		  amount_per_100g real NOT NULL,
		  PRIMARY KEY(food_id, micronutrient_id),
		  FOREIGN KEY (food_id) REFERENCES foods(id) ON UPDATE no action ON DELETE CASCADE,
		  FOREIGN KEY (micronutrient_id) REFERENCES micronutrients(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS foods (
	      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  name text NOT NULL,
		  brand text
		);

		CREATE TABLE IF NOT EXISTS meals (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  user_id integer NOT NULL,
		  meal_time text NOT NULL,
		  meal_name text,
		  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS micronutrients (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  name text NOT NULL,
		  unit text NOT NULL
		);

		CREATE UNIQUE INDEX IF NOT EXISTS micronutrients_name_unique ON micronutrients (name);
		CREATE TABLE IF NOT EXISTS muscle_groups (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  name text NOT NULL
		);

		CREATE UNIQUE INDEX IF NOT EXISTS muscle_groups_name_unique ON muscle_groups (name);
		CREATE TABLE IF NOT EXISTS nutrition_entries (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  meal_id integer NOT NULL,
		  food_id integer NOT NULL,
		  quantity real NOT NULL,
		  unit text NOT NULL,
		  FOREIGN KEY (meal_id) REFERENCES meals(id) ON UPDATE no action ON DELETE CASCADE,
		  FOREIGN KEY (food_id) REFERENCES foods(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS personal_records (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  user_id integer NOT NULL,
		  exercise_id integer NOT NULL,
		  record_type text NOT NULL,
		  value real NOT NULL,
		  achieved_at text NOT NULL,
		  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE,
		  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS users (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  name text NOT NULL,
		  height integer NOT NULL,
		  birth_date integer NOT NULL,
		  gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
		  use_biometrics integer DEFAULT true,
		  created_at text NOT NULL
		);

		CREATE TABLE IF NOT EXISTS workout_exercises (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  workout_id integer NOT NULL,
		  exercise_id integer NOT NULL,
		  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON UPDATE no action ON DELETE CASCADE,
		  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS workout_sets (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  workout_exercise_id integer NOT NULL,
		  set_number integer NOT NULL,
		  reps integer,
		  weight real,
		  duration_seconds integer,
		  distance_meters real,
		  rir integer,
		  completed integer DEFAULT true,
		  FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS workout_templates (
    	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    	  user_id integer NOT NULL,
    	  folder_id integer,
    	  name text NOT NULL,
    	  description text,
    	  total_sets integer NOT NULL,
    	  created_at text NOT NULL,
    	  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE,
    	  FOREIGN KEY (folder_id) REFERENCES workout_template_folders(id) ON UPDATE no action ON DELETE SET NULL
);
		CREATE TABLE IF NOT EXISTS workout_template_exercises (
    	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    	  workout_template_id integer NOT NULL,
    	  exercise_id integer NOT NULL,
    	  exercise_order integer NOT NULL,
    	  FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON UPDATE no action ON DELETE CASCADE,
    	  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE no action ON DELETE CASCADE
    	);

    	CREATE TABLE IF NOT EXISTS workout_template_sets (
    	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    	  workout_template_exercise_id integer NOT NULL,
    	  set_number integer NOT NULL,
    	  reps integer,             
    	  weight real,             
    	  rir integer,             
    	  FOREIGN KEY (workout_template_exercise_id) REFERENCES workout_template_exercises(id) ON UPDATE no action ON DELETE CASCADE
    	);

		CREATE TABLE IF NOT EXISTS workout_template_folders (
    	  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    	  user_id integer NOT NULL,
    	  name text NOT NULL,
    	  description text,
    	  created_at text NOT NULL,
    	  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS workouts (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  user_id integer NOT NULL,
		  workout_date text NOT NULL,
		  title text,
		  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS raw_workout_logs (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  workout_id integer NOT NULL,
		  content text NOT NULL,
		  last_edited_at text NOT NULL,
		  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS parsed_workout_logs (
		  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		  workout_id integer NOT NULL,
		  parser_version text,
		  parsed_json text NOT NULL,
		  parsed_at text NOT NULL,
		  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
		);
		CREATE TABLE IF NOT EXISTS timers (
    	  id TEXT PRIMARY KEY,
    	  label TEXT NOT NULL,
    	  duration INTEGER NOT NULL,
    	  time_left INTEGER NOT NULL,
    	  is_running BOOLEAN NOT NULL DEFAULT 0,
    	  end_time BIGINT,
    	  notification_id TEXT
    	);
	`);
  initialSeeding(db);
}

-- Drop legacy authentication tables if they exist
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users CASCADE;

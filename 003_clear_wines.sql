-- Clear all wines from the database
-- WARNING: This will delete ALL wine records permanently!

DELETE FROM wines;

-- Reset the sequence if you want IDs to start from 1 again (optional)
-- ALTER SEQUENCE wines_id_seq RESTART WITH 1;

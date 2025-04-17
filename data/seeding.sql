INSERT INTO "user" (email, last_name, first_name, "password")
VALUES ('martin.fretto@gmail.com', 'Fretto', 'Martin', '$argon2id$v=19$m=65536,t=3,p=4$+C4A2vvar25ppRrrUFyRQw$dNtz7oRLpJuRi4GdQNr8QC2CVF8hCzsQlvhAL0CWAPI');

INSERT INTO "budget" (name, warning_amount, spent_amount, allocated_amount, user_id)
VALUES ('alimentation', 600, 0, 700, 1),
('santé', 100, 0, 150, 1);


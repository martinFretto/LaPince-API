INSERT INTO "user" (email, last_name, first_name, "password")
VALUES ('martin.fretto@gmail.com', 'Fretto', 'Martin', 'test');

INSERT INTO "budget" (name, warning_amount, spent_amount, allocated_amount, user_id)
VALUES ('alimentation', 600, 0, 700, 1),
('santé', 100, 0, 150, 1);


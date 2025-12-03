-- NOTE: prototype password  = qweasd
-- It is BCRYPT hashed and stored below.



-- Insert data into the first table (adminID, useremail, password, role)
INSERT INTO admin (adminemail, password, role) 
VALUES ( 'admin@gmail.com', '$2a$12$Oc/l7IjqJeJhN1hyCj0Oc.BG0MbZU.rT/AbrIQ2QLqZ3CU7IVl0Z.', 'Administrator');
INSERT INTO admin (adminemail, password, role) 
VALUES ( 'owner@gmail.com', '$2a$12$Oc/l7IjqJeJhN1hyCj0Oc.BG0MbZU.rT/AbrIQ2QLqZ3CU7IVl0Z.', 'Owner');



-- Insert data into the second table (userID, username, password, whatsappNo, postal_address, role)
INSERT INTO user (username, password, whatsappNo, postal_address, role) 
VALUES ('dinura1ginige@gmail.com', '$2a$12$Oc/l7IjqJeJhN1hyCj0Oc.BG0MbZU.rT/AbrIQ2QLqZ3CU7IVl0Z.', '0778812345', '123 Main St, Colombo', 'User');
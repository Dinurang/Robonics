-- Insert data into the first table (adminID, useremail, password, role)
INSERT INTO admin_table (adminID, useremail, password, role) 
VALUES (1, 'admin@example.com', 'securepassword123', 'Administrator');

-- Insert data into the second table (userID, username, password, whatsappNo, postal_address, role)
INSERT INTO user_table (userID, username, password, whatsappNo, postal_address, role) 
VALUES (101, 'john_doe', 'mypassword456', '+1234567890', '123 Main St, City, Country', 'User');
drop table project;
drop table user;
drop table project_documentation_files;
drop table payment_proof_files;
drop table payment;
drop table pricing;
drop table project_data;
drop table admin;

-- Users table
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    whatsappNo VARCHAR(20) NOT NULL,
    postal_address VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Projects table
CREATE TABLE project (
    projectID INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(20),
    userID INT NOT NULL,
    order_date DATE,
    cost NUMERIC(10,2),
    est_deadline DATE,
    payment_date DATE,
    FOREIGN KEY (userID) REFERENCES user(userID)
);





CREATE TABLE payment_proof_files (
    fileID INT AUTO_INCREMENT PRIMARY KEY,
    projectID INT,
    gdrive_file_id VARCHAR(255) NOT NULL,   -- Google Drive File ID
    original_name VARCHAR(255) NOT NULL,    -- original uploaded filename
    mime_type VARCHAR(100),
    file_sizeMB INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_documentation_files (
    projectID INT PRIMARY KEY,
    gdrive_file_id VARCHAR(255),   -- Google Drive File ID
    original_name VARCHAR(255),
    file_sizeMB INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


drop table project_documentation_files;

CREATE TABLE IF NOT EXISTS project_documentation_files (
  fileID INT AUTO_INCREMENT PRIMARY KEY,
  projectID INT NOT NULL,
  original_name VARCHAR(255) ,
  file_sizeMB DECIMAL(10,2) ,
  uploaded_at DATETIME ,
  drive_file_id VARCHAR(255),
  drive_view_link TEXT,
  FOREIGN KEY (projectID) REFERENCES project(projectID) ON DELETE CASCADE
);










-- Payments table
CREATE TABLE payment (
    paymentID INT AUTO_INCREMENT PRIMARY KEY,
    projectID INT NOT NULL,
    dueamount NUMERIC(10,2),
    status VARCHAR(20),
    paymentdate DATETIME,
    FOREIGN KEY (projectID) REFERENCES project(projectID)
);

-- Project data table
CREATE TABLE project_data (
    projectID INT PRIMARY KEY,
    description TEXT,
    required_deadline DATE,
    deliverymode VARCHAR(20)
);

-- Admin table
CREATE TABLE admin (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    adminemail VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20) NOT NULL
);

-- Pricing table
CREATE TABLE pricing (
    projecttype VARCHAR(100) PRIMARY KEY,
    pricing NUMERIC(10,2),
    duration INT
);










DROP TRIGGER IF EXISTS after_project_insert;
DROP TRIGGER IF EXISTS update_payment_dueamount;
DROP TRIGGER IF EXISTS create_payment_on_project_insert;
DROP TRIGGER IF EXISTS update_project_paymentdate;
DROP TRIGGER IF EXISTS create_payment_proof_file_on_project_insert;



-- Trigger 1: When project.cost is updated, update payment.dueamount for the same projectID
DELIMITER $$

CREATE TRIGGER update_payment_dueamount
AFTER UPDATE ON robonics_db.project
FOR EACH ROW
BEGIN
    IF NEW.cost IS NOT NULL AND OLD.cost != NEW.cost THEN
        UPDATE robonics_db.payment 
        SET dueamount = NEW.cost 
        WHERE projectID = NEW.projectID;
    END IF;
END$$


DELIMITER $$

CREATE TRIGGER create_payment_on_project_insert
AFTER INSERT ON robonics_db.project
FOR EACH ROW
BEGIN
    -- Insert a new record in payment table when a new project is created
    -- Only insert if projectID is not NULL
    IF NEW.projectID IS NOT NULL THEN
        INSERT INTO robonics_db.payment (projectID, dueamount, status, paymentdate)
        VALUES (NEW.projectID, NEW.cost, 'incomplete', NULL);
    END IF;
END$$

DELIMITER ;



-- Trigger 3: When payment.paymentdate is updated, update project.payment_date for the same projectID


DELIMITER $$
CREATE TRIGGER update_project_paymentdate
AFTER UPDATE ON robonics_db.payment
FOR EACH ROW
BEGIN
    IF NEW.paymentdate IS NOT NULL AND (OLD.paymentdate IS NULL OR OLD.paymentdate != NEW.paymentdate) THEN
        UPDATE robonics_db.project 
        SET payment_date = NEW.paymentdate 
        WHERE projectID = NEW.projectID;
    END IF;
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER create_payment_proof_file_on_project_insert
AFTER INSERT ON robonics_db.project
FOR EACH ROW
BEGIN
    -- Insert a new record in payment table when a new project is created
    -- Only insert if projectID is not NULL
    IF NEW.projectID IS NOT NULL THEN
        INSERT INTO robonics_db.payment_proof_files (projectID, gdrive_file_id,original_name,mime_type,file_sizeMB,uploaded_at)
        VALUES (NEW.projectID,NULL, NULL, NULL, NULL,NULL);
    END IF;
END$$

DELIMITER ;


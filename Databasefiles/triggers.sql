DELIMITER $$

CREATE TRIGGER after_project_insert
AFTER INSERT ON project
FOR EACH ROW
BEGIN
    -- Insert the new ProjectID into project_documentation_files table
    INSERT INTO project_documentation_files (ProjectID)
    VALUES (NEW.ProjectID);
END$$

DELIMITER ;



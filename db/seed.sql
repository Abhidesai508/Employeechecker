INSERT INTO DEPARTMENT
(name)

VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO ROLE
(title, salary, department_id)

VALUES
('Sales Lead', 100000.00, 1),
('Salesperson', 80000.00, 1),
('Lead Engineer', 150000.00, 2),
('Software Engineer', 120000.00, 2),
('Accountant', 125000.00, 3),
('Legal Team Lead', 250000.00, 4),
('Lawyer', 190000.00, 4);

INSERT INTO EMPLOYEE
(first_name, last_name, role_id, manager_id)

VALUES
('Sarah', 'Lourd', 6, 5),
('Malia', 'Brown', 5, NULL),
('John', 'Doe', 1, NULL),
('Tom', 'Allen', 7, 5),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, NULL),
('Kevin', 'Tupik', 4, 3);
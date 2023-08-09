const connection = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const express = require('express');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// prompt user for what they would like to do
function init () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
}
    ]).then((answer) => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    }
    )
}

// view all departments
function viewDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}

// view all roles
function viewRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}

// view all employees
function viewEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}

// add a department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you would like to add?'
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, answer.department, (err, rows) => {
            if (err) throw err;
            console.log('Department added!');
            init();
        });
    });
}

// add a role
function addRole() {
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) throw err;
        const departments = rows.map((department) => ({
                name: department.name, value: department.id
            }));
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role you would like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'What is the department ID for this role?',
            choices: departments
        }
    ]).then((answer) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        db.query(sql, [answer.role, answer.salary, answer.department_id], (err, rows) => {
            if (err) throw err;
            console.log('Role added!');
            init();
        });
    });
});
}

// add an employee
function addEmployee() {
    db.query(`SELECT employee.first_name, employee.last_name, role.title AS role_name, manager.first_name AS manager_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
    `, (err, rows) => {
        if (err) throw err;
        const managers = rows.map((manager) => ({
                name: manager.first_name, value: manager.id
            }));
        db.query(`SELECT * FROM role`, (err, rows) => {
            if (err) throw err;
            const roles = rows.map((role) => ({
                    name: role.title, value: role.id
                }));
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee you would like to add?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee you would like to add?'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the role ID for this employee?',
            choices: roles
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'What is the manager ID for this employee?',
            choices: managers
        }
    ]).then((answer) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        db.query(sql, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, rows) => {
            if (err) throw err;
            console.log('Employee added!');
            init();
        });
    });;
    });
});
}

// update an employee role
function updateEmployeeRole() {
    db.query(`SELECT * FROM employee`, (err, rows) => {
        if (err) throw err;
        const employees = rows.map((employee) => ({
                name: employee.first_name, value: employee.id
            }));
        db.query(`SELECT * FROM role`, (err, rows) => {
            if (err) throw err;
            const roles = rows.map((role) => ({
                    name: role.title, value: role.id
                }));
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'What is the ID of the employee you would like to update?',
            choices: employees
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'What is the new role ID for this employee?',
            choices: roles
        }
    ]).then((answer) => {
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        db.query(sql, [answer.role_id, answer.employee_id], (err, rows) => {
            if (err) throw err;
            console.log('Employee role updated!');
            init();
        });
    });
});
});
}

init();
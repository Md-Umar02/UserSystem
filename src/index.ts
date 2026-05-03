// ✅ Task 1: Strongly Typed User System

// Create:

// User interface with:
// id (number)
// name (string)
// email (string)
// isActive (boolean)

// Then:

// Create an array of users
// Write functions:
// addUser(user)
// getUserById(id)
// deleteUser(id)

// 👉 Rules:

// No any
// Proper return types
// Handle edge cases (user not found)

import mysql from "mysql2/promise";
import * as readline from "readline";

interface User{
    id: number;
    name: string;
    isActive: boolean;
}

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rootUser",
    database: "user_system"
})

let users: User[] = []

async function addUser(u: User) : Promise<void> {
    const exists = users.find(user => user.id === u.id);
    if(exists) {
        throw new Error("duplicate");
    }
    await pool.execute(
        "INSERT INTO users (id, name, isActive) values (?, ?, ?)",
        [u.id, u.name, u.isActive]
    );
}

async function getUserById(id: number) : Promise<User | undefined> {
    // const user = users.find(u => u.id === id);
    // if(user === undefined) {
    //     throw new Error("Not Found");
    // }
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    const result = (rows as any[])[0];
    return result
        ? { id: result.id, name: result.name, isActive: !!result.isActive }
        : undefined;
}

async function deleteUser(id: number): Promise<boolean> {
  const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  return (result as mysql.ResultSetHeader).affectedRows > 0;
}

function updateUser(userId: number, updatedUser: Partial<User>) {
    const index = users.findIndex(u => u.id === userId);
    if(index === undefined) {
        throw new Error("Not Found");
    }
    return {...users[index], ...updatedUser}
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
}); 

rl.question("Choose operation (add/get/update/delete): ", (operation) => {
    switch (operation.toLowerCase()) {
        case "add":
            rl.question("Enter id: ", (id) => {
                rl.question("Enter name: ", (name) => {
                    rl.question("Is active (true/false): ", (isActive) => {
                        const user: User = {
                            id: Number(id),
                            name: name,
                            isActive: isActive.toLowerCase() === "true"
                        };
                        addUser(user);
                        console.log(users);
                        rl.close();
                    });
                });
            });
            break;
        case "get":
            rl.question("Enter id: ", (id) => {
                console.log(getUserById(Number(id)));
                rl.close();
            });
            break;
        case "delete":
            rl.question("Enter id: ", (id) => {
                console.log("Deleted:", deleteUser(Number(id)));
            });
            rl.close();
            break;
    
        default:
            console.log("Invalid");
            break;
    }
});

// addUser({ id: 1, name: "Alice", isActive: true });
// addUser({ id: 2, name: "Bob", isActive: false });

// console.log(users);

// console.log(updateUser(2, {isActive: true}));

// console.log(getUserById(2));

// console.log(deleteUser(1));

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

import { log } from "console";
import * as readline from "readline";

interface User{
    id: number;
    name: string;
    isActive: boolean;
}

let users: User[] = []

function addUser(u: User) : void {
    const exists = users.find(user => user.id === u.id);
    if(exists) {
        throw new Error("duplicate");
    }
    users.push(u);
}

function getUserById(id: number) : User | undefined {
    const user = users.find(u => u.id === id);
    if(user === undefined) {
        throw new Error("Not Found");
    }
    return user;
}

function deleteUser(id: number) : boolean {
    const user = users.findIndex(u => u.id === id);
    if(user === -1) {
        throw new Error("Not Found");
    }
    users.splice(user, 1);
    return true;
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

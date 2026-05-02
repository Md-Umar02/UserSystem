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
import * as readline from "readline";
let users = [];
function addUser(u) {
    const exists = users.find(user => user.id === u.id);
    if (exists) {
        throw new Error("duplicate");
    }
    users.push(u);
}
function getUserById(id) {
    const user = users.find(u => u.id === id);
    if (user === undefined) {
        throw new Error("Not Found");
    }
    return user;
}
function deleteUser(id) {
    const user = users.findIndex(u => u.id === id);
    if (user === -1) {
        throw new Error("Not Found");
    }
    users.splice(user, 1);
    return true;
}
function updateUser(userId, updatedUser) {
    const index = users.findIndex(u => u.id === userId);
    if (index === undefined) {
        throw new Error("Not Found");
    }
    return { ...users[index], ...updatedUser };
}
addUser({ id: 1, name: "Alice", isActive: true });
addUser({ id: 2, name: "Bob", isActive: false });
// console.log(users);
console.log(updateUser(2, { isActive: true }));
// console.log(getUserById(2));
// console.log(deleteUser(1));
//# sourceMappingURL=index.js.map
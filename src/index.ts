import mysql from "mysql2/promise";
import * as readline from "readline";

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootUser",
  database: "user_system"
});

async function addUser(u: User): Promise<void> {
  const [rows] = await pool.execute("SELECT id FROM users WHERE id = ?", [u.id]);
  if ((rows as any[]).length > 0) {
    throw new Error("User with this ID already exists.");
  }
  await pool.execute(
    "INSERT INTO users (id, name, email, isActive) VALUES (?, ?, ?, ?)",
    [u.id, u.name, u.email, u.isActive]
  );
}

async function getUserById(id: number): Promise<User | undefined> {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  const result = (rows as any[])[0];
  return result
    ? {
        id: result.id,
        name: result.name,
        email: result.email,
        isActive: !!result.isActive
      }
    : undefined;
}

async function deleteUser(id: number): Promise<boolean> {
  const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  return (result as mysql.ResultSetHeader).affectedRows > 0;
}

async function updateUser(userId: number, updatedUser: Partial<User>): Promise<User | undefined> {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const newUser: User = { ...user, ...updatedUser };

  await pool.execute(
    "UPDATE users SET name = ?, email = ?, isActive = ? WHERE id = ?",
    [newUser.name, newUser.email, newUser.isActive, userId]
  );

  return newUser;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Choose operation (add/get/update/delete): ", async (operation) => {
  switch (operation.toLowerCase()) {
    case "add":
      rl.question("Enter id: ", (id) => {
        rl.question("Enter name: ", (name) => {
          rl.question("Enter email: ", (email) => {
            rl.question("Is active (true/false): ", async (isActive) => {
              try {
                const user: User = {
                  id: Number(id),
                  name,
                  email,
                  isActive: isActive.toLowerCase() === "true"
                };
                await addUser(user);
                console.log("User added!");
              } catch (err) {
                console.error("Error:", (err as Error).message);
              }
              rl.close();
            });
          });
        });
      });
      break;

    case "get":
      rl.question("Enter id: ", async (id) => {
        try {
          const user = await getUserById(Number(id));
          console.log(user ?? "User not found.");
        } catch (err) {
          console.error("Error:", (err as Error).message);
        }
        rl.close();
      });
      break;

    case "update":
      rl.question("Enter id: ", (id) => {
        rl.question("New name (blank to skip): ", (name) => {
          rl.question("New email (blank to skip): ", (email) => {
            rl.question("Is active? (true/false, blank to skip): ", async (isActive) => {
              try {
                const data: Partial<User> = {};
                if (name) data.name = name;
                if (email) data.email = email;
                if (isActive) data.isActive = isActive.toLowerCase() === "true";

                const updated = await updateUser(Number(id), data);
                console.log("Updated:", updated);
              } catch (err) {
                console.error("Error:", (err as Error).message);
              }
              rl.close();
            });
          });
        });
      });
      break;

    case "delete":
      rl.question("Enter id: ", async (id) => {
        try {
          const deleted = await deleteUser(Number(id));
          console.log(deleted ? "User deleted." : "User not found.");
        } catch (err) {
          console.error("Error:", (err as Error).message);
        }
        rl.close();
      });
      break;

    default:
      console.log("Invalid operation.");
      rl.close();
  }
});
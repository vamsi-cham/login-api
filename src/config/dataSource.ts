// src/config/dataSource.ts
import { DataSource } from "typeorm";
import { User } from "../entity/User"; // Adjust the path as necessary
import { Poll } from "../entity/Poll";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",  // Your PostgreSQL username
  password: "Ansivandana@143",  // Your PostgreSQL password
  database: "LoginDB",
  entities: [User, Poll],
  synchronize: true,
  logging: true,
});

import express, { Express } from "express";
import { useRouter } from "./users/users";
import { Server } from "http";

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  useRouter() {
    this.app.use("/users", useRouter);
  }
}

import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { S3Service } from "./s3";

export class App extends Hono {
  readonly prisma = new PrismaClient();
  readonly s3 = new S3Service();

  private allowedOrigins = [process.env.FRONT_LOCAL_URL, process.env.FRONT_PROD_URL, process.env.FRONT_DEV_URL];

  constructor() {
    super();

    this.configureCors();
  }

  private configureCors() {
    console.log("CORS allowed origins:", this.allowedOrigins);

    // CORS middleware
    this.use(
      "*",
      cors({
        origin: (origin) => {
          // allow requests with no origin (Postman, curl, server-to-server)
          if (!origin) return "*";

          if (this.allowedOrigins.includes(origin)) return origin;

          // if not in list, block
          return ""; // or throw new Error("Not allowed by CORS")
        },
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true, // if you need cookies / auth headers
      }),
    );
  }
}

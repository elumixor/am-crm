import { di } from "@elumixor/di";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AWSUploadService } from "../utils/aws-upload-service";

@di.injectable
export class App extends Hono {
  readonly prisma = new PrismaClient();
  readonly uploadService = new AWSUploadService();

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

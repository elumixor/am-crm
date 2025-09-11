import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

/** Uploads files to AWS S3, generates signed URLs for uploaded resources */
export class AWSUploadService {
  private readonly client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  private readonly bucket = env.AWS_BUCKET_NAME;
  private readonly urlExpiry = 3600; // 1 hour

  /** Puts the object into S3. Store only the object key in DB; generate URLs on demand via getSignedUrl. */
  async upload(key: string, body: Buffer | ReadableStream | string, contentType: string): Promise<void> {
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType });
    await this.client.send(cmd);
  }

  /** Gets a signed URL for the object key */
  async getSignedUrl(key: string) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return await getSignedUrl(this.client, cmd, { expiresIn: this.urlExpiry });
  }
}

export const uploadService = new AWSUploadService();

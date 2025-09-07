import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { di } from "@elumixor/di";
import { nonNull } from "@elumixor/frontils";

/** Uploads files to AWS S3, generates signed URLs for uploaded resources */
@di.injectable
export class AWSUploadService {
  private readonly client = new S3Client({
    region: nonNull(process.env.AWS_REGION),
    credentials: {
      accessKeyId: nonNull(process.env.AWS_ACCESS_KEY_ID),
      secretAccessKey: nonNull(process.env.AWS_SECRET_ACCESS_KEY),
    },
  });

  private readonly bucket = nonNull(process.env.AWS_BUCKET_NAME);
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

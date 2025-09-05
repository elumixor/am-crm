import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nonNull } from "@elumixor/frontils";

export class S3Service {
  private readonly client = new S3Client({
    region: nonNull(process.env.AWS_REGION),
    credentials: {
      accessKeyId: nonNull(process.env.AWS_ACCESS_KEY_ID),
      secretAccessKey: nonNull(process.env.AWS_SECRET_ACCESS_KEY),
    },
  });

  private readonly bucket = nonNull(process.env.AWS_BUCKET_NAME);
  private readonly urlExpiry = 3600;

  /** Puts the object into S3, returns a signed URL */
  async upload(key: string, body: Buffer | ReadableStream | string, contentType: string) {
    const cmd = new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType });
    await this.client.send(cmd);

    return this.getSignedUrl(key);
  }

  /** Gets a signed URL for the object key */
  async getSignedUrl(key: string) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return await getSignedUrl(this.client, cmd, { expiresIn: this.urlExpiry });
  }
}

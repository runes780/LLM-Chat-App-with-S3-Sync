import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root',
})
export class S3SyncService {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      region: 'YOUR_REGION',
    });

    this.s3 = new AWS.S3({
      endpoint: 'YOUR_S3_COMPATIBLE_ENDPOINT',
      s3ForcePathStyle: true,
    });
  }

  async saveMessages(chatId: string, messages: { role: string; content: string }[]): Promise<void> {
    const params = {
      Bucket: 'YOUR_BUCKET_NAME',
      Key: `chat_messages_${chatId}.json`,
      Body: JSON.stringify(messages),
      ContentType: 'application/json',
    };

    try {
      await this.s3.putObject(params).promise();
      console.log('Messages saved to S3');
    } catch (error) {
      console.error('Error saving messages to S3:', error);
    }
  }

  async loadMessages(chatId: string): Promise<{ role: string; content: string }[] | null> {
    const params = {
      Bucket: 'YOUR_BUCKET_NAME',
      Key: `chat_messages_${chatId}.json`,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return JSON.parse(data.Body.toString());
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        console.log('No saved messages found');
        return null;
      }
      console.error('Error loading messages from S3:', error);
      return null;
    }
  }
}
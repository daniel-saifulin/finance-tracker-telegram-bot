import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, GetCommandOutput, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid'

interface OutComeAttributes {
  id: string,
  text: string,
  messageId: number,
  chatId: number,
  userId: number,
}

export default class Outcome {
  db: DynamoDBDocument;
  uid: string;

  constructor() {
    const client = new DynamoDBClient({ region: "us-west-2" });
    this.db = DynamoDBDocument.from(client);
  }

  async createAndFetch(options: Record<string, any>) {
    const attributes = this.mappingAttributes(options);
    const response = await this.addRecord(attributes);

    if (response.$metadata.httpStatusCode === 200) {
      return (await this.getRecord()).Item;
    }

    return undefined;
  }

  private async addRecord(attributes: OutComeAttributes): Promise<PutCommandOutput> {
    const params = {
      TableName: 'Outcome',
      Item: attributes
    }

    return this.db.put(params)
  }

  private getRecord(): Promise<GetCommandOutput> {
    const params = {
      TableName: 'Outcome',
      Key: {
        id: this.uid,
      }
    }

    return this.db.get(params);
  }

  private mappingAttributes(options: Record<string, any>): OutComeAttributes {
    this.uid = uuidv4();
    const text = options.message?.text;
    const messageId = options?.message?.message_id;
    const chatId = options?.message?.chat?.id;
    const userId = options?.message?.from?.id;

    return {
      id: this.uid,
      messageId:messageId, 
      chatId:chatId,
      userId:userId, 
      text: text,
    }
  }
}

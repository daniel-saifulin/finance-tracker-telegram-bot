import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, GetCommandOutput, PutCommandOutput, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';
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

  async createAndFetchItem(options: Record<string, any>) {
    const attributes = this.mappingAttributes(options);
    const response = await this.addRecord(attributes);

    return response?.$metadata?.httpStatusCode === 200
      ? (await this.getRecord()).Item
      : undefined
  }

  async updateItem(options: Record<string, any>) {
    const callbackQueryData = options?.callback_query?.data;
    const callbackqueryId = options?.callback_query?.id;

    if (!callbackQueryData && !callbackqueryId) {
      return undefined
    }

    const data = JSON.parse(callbackQueryData);
    this.uid = data.id;

    const attributes =  {
      id: data.id,
      category: data.category,
      callbackqueryId
    }

    const response = await this.updateRecord(attributes);

    return response?.$metadata?.httpStatusCode === 200
      ? (await this.getRecord())?.Item
      : undefined;
  }

  private async addRecord(attributes: OutComeAttributes): Promise<PutCommandOutput> {
    const params = {
      TableName: 'Outcome',
      Item: attributes
    }

    return this.db.put(params)
  }

  private async updateRecord(attributes: Record<string, any>): Promise<UpdateCommandOutput> {
    const params = {
      TableName: 'Outcome',
      UpdateExpression: "set category = :category, callbackqueryId = :callbackqueryId",
      ExpressionAttributeValues: {
        ":category": attributes.category,
        ":callbackqueryId": attributes.callbackqueryId,
      },
      Key: { id: attributes.id },
    }

    return this.db.update(params);
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

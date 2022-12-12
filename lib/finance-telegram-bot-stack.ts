import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path'
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam'

export class FinanceTelegramBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const statement = new iam.PolicyStatement();

    const database = new dynamodb.Table(this, 'Outcome', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: 'Outcome',
    });

    const role = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'finance-bot-role',
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const fn = new NodejsFunction(this, 'finance-tracker', {
      entry: path.join(__dirname, '../src/index.ts'),
      runtime: lambda.Runtime.NODEJS_14_X,
      role: role,
    });

    const api = new apigateway.LambdaRestApi(this, 'finance-bot-api', {
      restApiName: 'FinanceBotAPI',
      handler: fn
    });

    // database.grantFullAccess(fn)
  }
}

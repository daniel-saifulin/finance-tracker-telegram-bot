import Outcome from './services/Outcome';
import TelegramAPI from './services/TelegramAPI';
import { isNumber } from './helpers/isNumber';

exports.handler = async function (event: any, context: any) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))

  const telegramApi = new TelegramAPI();
  const outcomeService = new Outcome();

  const body = JSON.parse(event.body);
  const text = body?.message?.text;
  const chatId = body?.message?.chat?.id;
  const callbackquery = body?.callback_query;


  if (isNumber(text)) {
    try {
      const item = await outcomeService.createAndFetchItem(body);

      if (item) {
        await telegramApi.sendMessageWithReply(`item created ${item.id}`, chatId, item);
      }
    } catch (error) {
      await telegramApi.sendMessage('error in creating', chatId);
    }
  } else if (callbackquery) {
    try {
      const item = await outcomeService.updateItem(body);

      if (item) {
        await telegramApi.sendMessage('👍', item.chatId);
      }
    } catch(error) {}
  }

  return {
    'statusCode': 200
  }
}

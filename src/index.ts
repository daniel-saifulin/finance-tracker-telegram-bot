import Outcome from './services/Outcome';
import TelegramAPI from './services/TelegramAPI';
import { isNumber } from './helpers/isNumber';

exports.handler = async function (event: any, context: any) {
  const telegramApi = new TelegramAPI()

  const body = JSON.parse(event.body);
  const text = body?.message?.text;
  const chatId = body?.message?.chat?.id;

  if (isNumber(text)) {
    try {
      const outComeService = new Outcome();
      const item = await outComeService.createAndFetch(JSON.parse(event.body));

      if (item) {
        await telegramApi.sendMessage(`item created ${item.id}`, chatId);
      }

    } catch (error) {
      await telegramApi.sendMessage(error as any, chatId);
    }
  }

  return {
    'statusCode': 200
  }
}

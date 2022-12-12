import axios, { AxiosInstance } from "axios";

export default class TelegramAPI {
  token: string | undefined = process.env.telegramToken;
  api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `https://api.telegram.org/${this.token}`,
      timeout: 1000,
    });
  }

  async sendMessage(text: string, chatId: number): Promise<void> {
    await this.api.post('/sendMessage', {
      text,
      chat_id: chatId,
      parse_mode: 'Markdown',
    })
  }
}


// const replyMarkup = {
//   reply_markup: {
//     inline_keyboard: [
//       [
//         {
//           text: "A",
//           callback_data: "123"
//         }
//       ]
//     ]
//   }
// }
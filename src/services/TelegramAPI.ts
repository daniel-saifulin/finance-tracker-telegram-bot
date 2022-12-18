import axios, { AxiosInstance } from "axios";

export default class TelegramAPI {
  token: string | undefined = process.env.telegramToken;
  api: AxiosInstance;

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

  async sendMessageWithReply(text: string, chatId: number, item: Record<string, any>): Promise<void> {
    await this.api.post('/sendMessage', {
      text,
      chat_id: chatId,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: this.inlineKeyboard(item)
      }
    })
  }

  private inlineKeyboard(item: Record<string, any>) {
    return  [
      [
       {
          text: "A",
          callback_data: JSON.stringify({
            'id': item.id.toString(),
            'category': 'A'
          }),
        },
        {
          text: "B",
          callback_data: JSON.stringify({
            'id': item.id.toString(),
            'category': 'B'
          }),
        },
        {
          text: "C",
          callback_data: JSON.stringify({
            'id': item.id.toString(),
            'category': 'C'
          }),
        },
        {
          text: "D",
          callback_data: JSON.stringify({
            'id': item.id.toString(),
            'category': 'D'
          }),
        }
      ]
    ]
  }
}

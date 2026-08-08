import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage(`Hello! I'm your friendly gym assistant.`)],
  botName: 'GymBot',
};

export default config;

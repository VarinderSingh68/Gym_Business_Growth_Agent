import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './Chatbot.css';

import config from './config.js';
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';

const ChatbotComponent = () => {
  const [showChatbot, toggleChatbot] = useState(false);

  return (
    <div>
      {showChatbot && (
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      )}
      <button className="chatbot-toggle-button" onClick={() => toggleChatbot((prev) => !prev)}>
        {showChatbot ? 'X' : '💬'}
      </button>
    </div>
  );
};

export default ChatbotComponent;

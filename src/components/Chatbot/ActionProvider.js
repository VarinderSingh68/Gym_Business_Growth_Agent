class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  handleMessage = async (message) => {
    const botMessage = this.createChatBotMessage("Thinking...");
    this.addMessageToState(botMessage);

    try {
      const response = await fetch('http://127.0.0.1:4000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      const reply = this.createChatBotMessage(data.reply);
      this.addMessageToState(reply);
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      const errorMessage = this.createChatBotMessage("Sorry, I'm having trouble connecting. Please try again later.");
      this.addMessageToState(errorMessage);
    }
  };

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider;

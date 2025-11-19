import React, { useState } from "react";
import { sendMessageToAI } from "../services/aiService.js";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    const aiResponse = await sendMessageToAI(input);

    const aiMessage = {
      sender: "ai",
      text: aiResponse
    };

    setMessages((prev) => [...prev, aiMessage]);
    setTyping(false);
  };

  return (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-10 border border-purple-600">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">
          Ask AI Anything
        </h2>

        <div className="h-80 overflow-y-auto mb-4 p-4 bg-gray-800 rounded-lg space-y-4 border border-gray-700">
          {messages.map((msg, index) => (
              <div
                  key={index}
                  className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.sender === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-200"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
          ))}

          {typing && (
              <div className="text-gray-400 text-sm italic">AI is typing...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </form>
      </div>
  );
};

export default AIChat;

import { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/aiService';

function AIChat() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your Groovify AI assistant. Ask me about music, artists, or recommendations! 🎵", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await askAI(input);
      const botMessage = { id: Date.now() + 1, text: aiResponse, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        id: Date.now() + 1, 
        text: error.message || "The AI is waking up. Please try your question again in a moment!", 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-purple-500 border-opacity-30 max-w-md mx-auto">
      <div className="bg-purple-600 p-4 rounded-t-xl flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold">AI</span>
        </div>
        <div>
          <h3 className="font-bold text-white">Groovify AI Assistant</h3>
          <p className="text-purple-200 text-sm">Ask me about music! 🎵</p>
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about music, artists, recommendations..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2 text-center">
          The AI might take a moment to wake up on first use
        </p>
      </div>
    </div>
  );
}

export default AIChat;
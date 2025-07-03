import React, { useState } from 'react';
import { Send, Scale, AlertCircle, Loader2, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ApiResponse {
  response?: string;
  error?: string;
  [key: string]: any;
}

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (type: 'user' | 'bot', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    const userQuery = query.trim();
    setQuery('');
    setError(null);
    setIsLoading(true);

    // Add user message immediately
    addMessage('user', userQuery);

    try {
      const response = await fetch('http://127.0.0.1:8080/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_query: userQuery 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      // Handle different response formats
      let botResponse = '';
      if (data.response) {
        botResponse = data.response;
      } else if (typeof data === 'string') {
        botResponse = data;
      } else {
        botResponse = JSON.stringify(data, null, 2);
      }

      addMessage('bot', botResponse);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Connection error: ${err.message}` 
        : 'An unexpected error occurred. Please try again.';
      
      setError(errorMessage);
      addMessage('bot', `❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Bharatiya Nyaya Sanhita
              </h1>
              <p className="text-gray-700 font-medium">Legal Assistant & Knowledge System</p>
              <p className="text-sm text-gray-600 mt-1">Ask questions about Indian criminal law and legal provisions</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-orange-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Legal Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-160px)] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Scale className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Welcome to Bharatiya Nyaya Sanhita Assistant</h3>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                Get expert guidance on Indian criminal law provisions, legal interpretations, and case references. 
                Ask your questions about the Bharatiya Nyaya Sanhita and receive detailed, accurate responses.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Criminal Law</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Legal Provisions</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">Case References</span>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-2xl px-5 py-4 rounded-2xl shadow-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-white text-gray-800 border border-orange-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
                  <div
                    className={`text-xs mt-3 ${
                      message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md border border-orange-100 px-5 py-4 rounded-2xl max-w-xs">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                  <span className="text-sm text-gray-600">Analyzing legal query...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800">Connection Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-orange-100 p-5">
          <div className="flex gap-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about legal provisions, criminal law sections, or case interpretations..."
              className="flex-1 resize-none border-none outline-none text-gray-700 placeholder-gray-400 min-h-[48px] max-h-32 leading-relaxed"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
            <Scale className="w-3 h-3" />
            Press Enter to send • Shift + Enter for new line • Legal guidance powered by AI
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
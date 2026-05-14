import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetChatResponseMutation } from '../slices/productsApiSlice';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your AI Shopping Assistant. Looking for a specific gadget or a budget-friendly deal?" }
  ]);
  const chatRef = useRef(null);
  const [getChatResponse, { isLoading }] = useGetChatResponseMutation();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    try {
      const response = await getChatResponse({ message: userText }).unwrap();
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response.reply,
        products: response.products 
      }]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to the catalog. Try again in a second!" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-100">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-2xl shadow-blue-600/40 transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <Sparkles className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-sm pr-2">Ask AI</span>
        </button>
      ) : (
        <div className="bg-white w-[380px] h-[520px] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gray-900 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white animate-pulse">
                <Bot size={20} />
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Smart Guide</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' : 'bg-white border border-gray-100 text-gray-700 shadow-sm'
                }`}>
                  {msg.text}
                  {msg.products?.map(p => (
                    <Link key={p._id} to={`/product/${p._id}`} className="mt-3 flex items-center gap-3 bg-gray-50 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <img src={p.image} className="w-10 h-10 object-contain" />
                      <span className="font-bold text-blue-600 text-xs truncate">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && <div className="flex gap-2 p-3 bg-white w-fit rounded-2xl border"><Loader2 className="animate-spin text-blue-600" size={16}/></div>}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about a product..."
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600/20"
            />
            <button onClick={handleSend} className="bg-gray-900 text-white p-2.5 rounded-xl"><Send size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
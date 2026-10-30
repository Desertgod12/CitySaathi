import React, { useState } from 'react';
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HelpCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Language, UserImpact } from '../../types';
import { Button } from '../ui/Button';

interface AskAIAssistantProps {
  userImpact: UserImpact;
  onNavigateToTrips: () => void;
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
}

export const AskAIAssistant: React.FC<AskAIAssistantProps> = ({
  userImpact,
  onNavigateToTrips,
  lang,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: lang === 'hi'
        ? `नमस्ते! मैं आपका सिटी साथी एआई सहायक हूँ। आप मुझसे सुलभ मार्गों, साथी पॉइंट्स स्कोरिंग, टूटी सड़क/रैंप की शिकायत दर्ज करने व पर्यावरणीय बचत के बारे में पूछ सकते हैं।\n\n🌿 प्रभाव अवलोकन: आपने अब तक ${userImpact.totalCO2Avoided} किग्रा CO₂ बचाया है और ${userImpact.totalPoints} साथी पॉइंट्स अर्जित किए हैं!`
        : `Hello! I am your CitySaathi AI Assistant. You can ask me about step-free accessible transit, how Saathi Points are calculated, filing civic complaints, or local municipal services.\n\n🌿 Live Impact: You have avoided ${userImpact.totalCO2Avoided} kg of CO₂ and earned ${userImpact.totalPoints} verified Saathi Points!`,
      time: 'Just now',
      suggestions: [
        'How are Saathi Points calculated?',
        'Nearest accessible metro station in Ward 14',
        'How do I file a broken ramp complaint?',
        'What is my CO₂ avoidance factor?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      const lower = q.toLowerCase();

      if (lower.includes('point') || lower.includes('earn') || lower.includes('score') || lower.includes('पॉइंट')) {
        aiText = `Saathi Points are awarded for verified civic and environmental actions:\n• Sustainable Transit: 10 base points per trip (+2 pts/km active mobility bonus for walking/cycling).\n• Verified Civic Grievance: 25 points upon municipal resolution.\n• Verified Accessibility Barrier: 40 points upon resolution.\nSubmitting a report earns 0 points upfront to prevent spam.`;
      } else if (lower.includes('co2') || lower.includes('carbon') || lower.includes('emission') || lower.includes('पर्यावरण')) {
        aiText = `Your environmental impact is computed by comparing your selected transit mode with a personal vehicle baseline (0.192 kg CO₂/km):\n• Walking / Cycling: 0.00 kg/km (saves 0.192 kg/km)\n• City Bus: 0.040 kg/km (saves 0.152 kg/km)\n• Metro Rail: 0.030 kg/km (saves 0.162 kg/km)\nYou have currently avoided ${userImpact.totalCO2Avoided} kg of CO₂!`;
      } else if (lower.includes('metro') || lower.includes('station') || lower.includes('transit') || lower.includes('bus')) {
        aiText = `The closest accessible transit hub in Ward 14 is Central Metro Station (Gate 2 & 3). It offers step-free wheelchair ramps, braille tactile paving, elevators to platforms, and dedicated low-floor bus connections.`;
      } else if (lower.includes('complaint') || lower.includes('report') || lower.includes('grievance') || lower.includes('ramp')) {
        aiText = `To lodge a grievance:\n1. Go to "Civic Grievances" in the sidebar.\n2. Enter the title, location (or click "Detect GPS"), and upload a photo.\n3. Submit to receive an official tracking receipt.\n4. Once an engineer inspects and resolves the issue, you will be credited with 25-40 Saathi Points!`;
      } else {
        aiText = `Thank you for reaching out to CitySaathi. For specific queries regarding accessible mobility routes, logging transit journeys, or civic complaints, feel free to choose from the suggested prompts below or navigate through the sidebar menu.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            CitySaathi AI Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            24×7 conversational helpdesk for city mobility, civic grievance redressal, and impact metrics.
          </p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 self-start sm:self-auto">
          AI Civic Engine Active
        </div>
      </div>

      {/* 2. Main Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[560px]">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isAi ? 'bg-emerald-700' : 'bg-slate-800'
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-xl space-y-2 ${isAi ? 'items-start' : 'items-end'}`}>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isAi 
                      ? 'bg-slate-50 text-slate-800 border border-slate-200/80' 
                      : 'bg-emerald-700 text-white shadow-xs'
                  }`}>
                    {msg.text}
                  </div>

                  <div className={`text-[10px] text-slate-400 px-1 ${isAi ? 'text-left' : 'text-right'}`}>
                    {msg.time}
                  </div>

                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-[11px] font-semibold text-slate-600 transition-colors shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>CitySaathi AI is formulating answer...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about accessible transit, complaints, or points..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-600 shadow-2xs"
            />
            <Button
              type="submit"
              size="md"
              disabled={!input.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};

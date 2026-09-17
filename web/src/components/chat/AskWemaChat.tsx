'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, ArrowRight, CornerDownRight } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialContext';

export const AskWemaChat: React.FC = () => {
  const { chatMessages, sendChatMessage } = useFinancialData();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'Why did my expenses increase?',
    'How much did I spend on food this month?',
    'What are my recurring payments?',
    'Where did I spend the most?',
    'How much money came in this month?',
    'Can I afford my usual expenses?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setInput('');
    setLoading(true);
    await sendChatMessage(textToSend);
    setLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7B0046] text-white flex items-center justify-center shadow-xs">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-slate-900">Ask Wema</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grounded Financial Model
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ask questions about your transactions, spending spikes, and cash flow.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestion Chips Strip */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {suggestionChips.map(chip => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            disabled={loading}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#7B0046] hover:text-[#7B0046] hover:bg-pink-50/30 transition whitespace-nowrap shadow-xs disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {chatMessages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#7B0046] border border-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={16} />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs ${
                  isUser
                    ? 'bg-[#7B0046] text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs'
                }`}
              >
                <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>

                {/* Structured Financial Metric Highlights */}
                {msg.metrics && msg.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60">
                    {msg.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/80"
                      >
                        <span className="text-[10px] text-slate-500 font-semibold block truncate">
                          {m.label}
                        </span>
                        <span
                          className={`text-sm font-extrabold font-mono block ${
                            m.isPositive === false ? 'text-[#DC2626]' : 'text-slate-900'
                          }`}
                        >
                          {m.value}
                        </span>
                        {m.subtext && (
                          <span className="text-[10px] text-slate-400 block truncate">
                            {m.subtext}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Supporting Categories */}
                {msg.supportingCategories && msg.supportingCategories.length > 0 && (
                  <div className="flex items-center space-x-1.5 mt-3 pt-2">
                    <span className="text-[10px] text-slate-400 font-semibold">Supporting:</span>
                    {msg.supportingCategories.map(cat => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-bold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Follow-up Quick Prompts */}
                {msg.quickFollowUps && msg.quickFollowUps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      Suggested follow-ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.quickFollowUps.map(f => (
                        <button
                          key={f}
                          onClick={() => handleSend(f)}
                          className="text-[11px] font-semibold text-[#7B0046] hover:underline flex items-center space-x-1 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          <CornerDownRight size={11} />
                          <span>{f}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#7B0046] flex items-center justify-center animate-pulse">
              <Sparkles size={16} />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-500 font-medium">
              Calculating exact totals from your 6-month transaction ledger...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask Wema about expenses, income, recurring bills, or runway..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7B0046]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-[#7B0046] hover:bg-[#9E1B4C] text-white rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

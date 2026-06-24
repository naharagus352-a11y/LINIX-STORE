import React, { useState } from 'react';
import { FAQS } from '../data';
import { AppLanguage } from '../types';
import Icon from './Icon';

interface FAQSectionProps {
  language: AppLanguage;
}

export default function FAQSection({ language }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-950/40 border border-violet-900/30 px-3 py-1 rounded-full">
          FAQ
        </span>
        <h2 className="text-3xl font-black text-white mt-3 tracking-tight">
          {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-sm text-zinc-400 mt-2">
          {language === 'id' 
            ? 'Temukan jawaban cepat untuk pertanyaan seputar pembelian dan instalasi.' 
            : 'Find instant answers to everything about purchases and setups.'}
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const question = language === 'id' ? faq.questionId : faq.questionEn;
          const answer = language === 'id' ? faq.answerId : faq.answerEn;
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-300 ${
                isOpen
                  ? 'border-violet-500/30 bg-zinc-950/80 shadow-lg shadow-violet-600/2'
                  : 'border-zinc-800/80 bg-zinc-950/20 hover:border-zinc-700'
              }`}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
              >
                <span className="font-bold text-sm text-zinc-100 group-hover:text-white">
                  {question}
                </span>
                <span
                  className={`text-zinc-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-violet-400' : ''
                  }`}
                >
                  <Icon name="ChevronDown" size={18} />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-40 border-t border-zinc-900' : 'max-h-0'
                }`}
              >
                <p className="px-5 py-4 text-xs text-zinc-400 leading-relaxed bg-zinc-900/10">
                  {answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { AppLanguage } from '../types';
import Icon from './Icon';

interface StatsSectionProps {
  language: AppLanguage;
}

export default function StatsSection({ language }: StatsSectionProps) {
  const items = [
    {
      icon: 'ShieldCheck',
      titleId: 'Aman & Teruji',
      titleEn: '100% Safe & Tested',
      descId: 'Bebas virus, malware, serta anti-banned aman 100%.',
      descEn: 'Fully scan-tested, malware-free, and anti-ban secure.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: 'Clock',
      titleId: 'Proses Instan',
      titleEn: 'Instant Delivery',
      descId: 'Pengiriman link download privat kilat via WhatsApp.',
      descEn: 'Direct secure link sent immediately to your WhatsApp.',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      icon: 'TrendingUp',
      titleId: 'Selalu Update',
      titleEn: 'Always Up-To-Date',
      descId: 'Dapatkan update versi terbaru secara berkala dan mudah.',
      descEn: 'Get free, seamless version updates over lifetime.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: 'Users',
      titleId: 'Layanan Personal',
      titleEn: '1-on-1 Full Support',
      descId: 'Dibimbing langsung oleh admin ramah sampai berhasil pasang.',
      descEn: 'Step-by-step guidance by our friendly support admin.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item, idx) => {
        const title = language === 'id' ? item.titleId : item.titleEn;
        const desc = language === 'id' ? item.descId : item.descEn;

        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-950/60"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color} mb-4 transition-transform duration-300 group-hover:scale-105`}>
              <Icon name={item.icon} size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

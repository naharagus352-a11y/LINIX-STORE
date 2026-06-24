import React from 'react';
import { AppLanguage } from '../types';
import Icon from './Icon';

interface ChannelWidgetProps {
  language: AppLanguage;
}

export default function ChannelWidget({ language }: ChannelWidgetProps) {
  const channelUrl = 'https://whatsapp.com/channel/0029VbBoLfsFSAt6FIgPKQ1s';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 via-zinc-950 to-zinc-950 p-6 md:p-8">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-violet-600/5 blur-3xl" />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WhatsApp Channel
            </span>
            <span className="text-zinc-500 text-xs">Live Updates</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {language === 'id' 
              ? 'Gabung Channel WhatsApp Resmi Kami!' 
              : 'Join Our Official WhatsApp Channel!'}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {language === 'id'
              ? 'Dapatkan informasi update aplikasi gratis, rilis VIP terbaru, tutorial eksklusif, serta penawaran terbatas langsung di HP Anda!'
              : 'Get free application updates, latest VIP mod releases, exclusive tutorials, and limited-time discounts right in your pocket!'}
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold text-sm px-6 py-3.5 shadow-lg shadow-violet-600/10 transition-all duration-200"
          >
            <Icon name="MessageSquare" size={16} />
            {language === 'id' ? 'Gabung Channel Sekarang' : 'Join Channel Now'}
            <Icon name="ExternalLink" size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

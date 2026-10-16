import React from 'react';
import { Bot, Plus, Server } from 'lucide-react';
import { BOT_AVATAR } from '../data/templates';

interface TopBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenConnectModal: () => void;
  connectedServerName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  onOpenConnectModal,
  connectedServerName
}) => {
  return (
    <header className="h-16 border-b border-[#232428] bg-[#1e1f22]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between gap-8 text-[#dbdee1]">
      {/* Zone 1: Single text element brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <img
          src={BOT_AVATAR}
          alt="PanelBot"
          className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#5865F2]"
        />
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('dashboard');
          }}
          className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-[#5865F2] transition-colors"
        >
          PanelBot Manager
        </a>
      </div>

      {/* Zone 2: 4–5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#949ba4]">
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'dashboard'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          Visão Geral
        </button>

        <button
          type="button"
          onClick={() => onTabChange('command')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            currentTab === 'command'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          <span>Comando /load</span>
          <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] px-1 rounded font-mono">
            dog_cyb
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('discord')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'discord'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          Discord ao Vivo
        </button>

        <button
          type="button"
          onClick={() => onTabChange('rules')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            currentTab === 'rules'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          <span>Regras</span>
          <span className="text-[10px] bg-[#f0b232]/20 text-[#f0b232] font-mono px-1 rounded font-bold">
            30
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('events')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'events'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          Entrada & Saída
        </button>

        <button
          type="button"
          onClick={() => onTabChange('roles')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'roles'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          Cargos
        </button>

        <button
          type="button"
          onClick={() => onTabChange('styles')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            currentTab === 'styles'
              ? 'text-white border-b-2 border-[#5865F2]'
              : ''
          }`}
        >
          Estilos
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {connectedServerName && (
          <span className="hidden xl:inline text-xs text-[#949ba4] font-medium truncate max-w-[200px]">
            Servidor: <strong className="text-white">{connectedServerName}</strong>
          </span>
        )}

        <button
          type="button"
          onClick={onOpenConnectModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#5865F2] hover:bg-[#4752c4] rounded-xl transition-all shadow-md shadow-[#5865F2]/20 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Server className="w-3.5 h-3.5" />
          <span>Conectar Servidor</span>
        </button>
      </div>
    </header>
  );
};

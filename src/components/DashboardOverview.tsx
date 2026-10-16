import React from 'react';
import {
  Server,
  Play,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  Users,
  Volume2,
  Hash,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Key
} from 'lucide-react';
import { DiscordGuild } from '../types/discord';
import { BOT_AVATAR, SERVER_BANNER } from '../data/templates';

interface DashboardOverviewProps {
  currentGuild: DiscordGuild;
  onNavigateToCommand: () => void;
  onNavigateToDiscord: () => void;
  onOpenConnectModal: () => void;
  onQuickLoadDogCyb: () => void;
  isExecuting: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentGuild,
  onNavigateToCommand,
  onNavigateToDiscord,
  onOpenConnectModal,
  onQuickLoadDogCyb,
  isExecuting
}) => {
  const textChannelsCount = currentGuild.channels.filter((c) => c.type === 'text').length;
  const voiceChannelsCount = currentGuild.channels.filter((c) => c.type === 'voice').length;

  return (
    <div className="space-y-6">
      {/* Hero Banner with Cyber Paneleiro Aesthetics */}
      <div className="relative overflow-hidden rounded-3xl border border-[#232428] bg-[#1e1f22] p-8 shadow-2xl">
        {/* Background Ambient Glow & Graphic */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
          <img
            src={SERVER_BANNER}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative">
              <img
                src={BOT_AVATAR}
                alt="PanelBot Avatar"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#5865F2] shadow-xl"
              />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#23a55a] rounded-full border-2 border-[#1e1f22]"
                title="Bot Online e Conectado"
              />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  PanelBot Manager
                </h1>
                <span className="text-[11px] bg-[#5865F2] text-white font-bold px-2 py-0.5 rounded tracking-wider">
                  V2.4 ONLINE
                </span>
              </div>
              <p className="text-xs text-[#949ba4] max-w-xl mt-1 leading-relaxed">
                Automação e template loader para servidores paneleiros. Execute{' '}
                <code className="text-[#5865F2] font-mono font-bold">/load dog_cyb</code> para
                redefinir canais com nomes em negrito, símbolos chineses, regras engraçadas em
                Embed e hierarquia completa de cargos.
              </p>

              {/* Status Pills */}
              <div className="flex items-center gap-4 text-xs text-[#b5bac1] mt-3">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>Servidor: <strong className="text-white">{currentGuild.name}</strong></span>
                </span>
                <span aria-hidden="true" className="text-[#4e5058]">·</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#23a55a]" />
                  <span className="tabular-nums font-mono">{currentGuild.memberCount.toLocaleString()}</span> membros
                </span>
                <span aria-hidden="true" className="text-[#4e5058]">·</span>
                <span className="text-[#949ba4]">Prefixo: <code className="text-white font-mono">/load</code></span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onQuickLoadDogCyb}
              disabled={isExecuting}
              className="px-5 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#5865F2]/25 transition-all disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Carregando Template...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Carregar /load dog_cyb</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateToDiscord}
              className="px-4 py-3 rounded-xl bg-[#2b2d31] hover:bg-[#35373c] text-white text-xs font-semibold border border-[#3f4147] transition-all flex items-center gap-2"
            >
              <span>Abrir Discord ao Vivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-[#949ba4] font-medium flex items-center justify-between">
            <span>Canais de Texto</span>
            <Hash className="w-4 h-4 text-[#5865F2]" />
          </div>
          <div className="text-2xl font-black text-white mt-2 tabular-nums font-mono">
            {textChannelsCount}
          </div>
          <div className="text-[11px] text-[#949ba4] mt-1">
            entrada, saindo, regras, sms, plaquinhas, buscar-ip
          </div>
        </div>

        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-[#949ba4] font-medium flex items-center justify-between">
            <span>Canais de Voz</span>
            <Volume2 className="w-4 h-4 text-[#23a55a]" />
          </div>
          <div className="text-2xl font-black text-white mt-2 tabular-nums font-mono">
            {voiceChannelsCount}
          </div>
          <div className="text-[11px] text-[#949ba4] mt-1">
            duo 1 & 2, call 1 & 2, gf 1 & 2, música 1 & 2, afk 1 & 2
          </div>
        </div>

        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-[#949ba4] font-medium flex items-center justify-between">
            <span>Cargos Paneleiros</span>
            <Shield className="w-4 h-4 text-[#FEE75C]" />
          </div>
          <div className="text-2xl font-black text-white mt-2 tabular-nums font-mono">
            {currentGuild.roles.length}
          </div>
          <div className="text-[11px] text-[#949ba4] mt-1">
            Dono, Sub Dono, Deuses, Moderadores, Alfas, Betas
          </div>
        </div>

        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-[#949ba4] font-medium flex items-center justify-between">
            <span>Latência do Bot</span>
            <Cpu className="w-4 h-4 text-[#23a55a]" />
          </div>
          <div className="text-2xl font-black text-white mt-2 tabular-nums font-mono text-[#23a55a]">
            18ms
          </div>
          <div className="text-[11px] text-[#949ba4] mt-1">
            Shard #1 · Uptime 99.98%
          </div>
        </div>
      </div>

      {/* Feature Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: /load (id): dog_cyb Protocol */}
        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5865F2]/20 text-[#5865F2]">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Comando /load (id)</h3>
          </div>
          <p className="text-xs text-[#949ba4] leading-relaxed">
            Ao digitar <code className="text-[#5865F2] font-mono">/load dog_cyb</code>, o bot purga
            todos os canais antigos do servidor e recria a arquitetura oficial com nomes em negrito
            e apenas pontos chineses (sem emojis):
          </p>
          <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428] font-mono text-xs space-y-1 text-[#dbdee1]">
            <div>• <strong className="text-white">・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮 & ・ 𝘀𝗮𝗶𝗻𝗱𝗼</strong> (leitura)</div>
            <div>• <strong className="text-white">・ 𝗿𝗲𝗴𝗿𝗮𝘀</strong> (leitura em embed)</div>
            <div>• <strong className="text-white">・ 𝗮𝗻𝘂𝗻𝗰𝗶𝗼𝘀</strong> (canal de anúncios)</div>
            <div>• <strong className="text-white">・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀</strong> (canal de fórum)</div>
            <div>• <strong className="text-white">・ 𝘀𝗺𝘀 & ・ 𝗺𝗶𝗱𝗶𝗮𝘀</strong> (bate-papo livre)</div>
            <div>• <strong className="text-white">・ 𝗯𝘂𝘀𝗰𝗮𝗿-𝗶𝗽</strong> (dox fake)</div>
            <div>• <strong className="text-[#23a55a]">・ 𝗱𝘂𝗼, ・ 𝗰𝗮𝗹𝗹, ・ 𝗴𝗳, ・ 𝗺𝘂𝘀𝗶𝗰𝗮, ・ 𝗮𝗳𝗸</strong></div>
          </div>
          <button
            type="button"
            onClick={onNavigateToCommand}
            className="w-full py-2.5 bg-[#35373c] hover:bg-[#5865F2] hover:text-white text-xs font-semibold text-[#dbdee1] rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Configurar e Rodar /load
          </button>
        </div>

        {/* Card 2: Regras Engraçadas em Embed */}
        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#23a55a]/20 text-[#23a55a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Regras em Embed</h3>
          </div>
          <p className="text-xs text-[#949ba4] leading-relaxed">
            O canal de regras é enviado automaticamente em Embed de alta definição com as regras engraçadas:
          </p>
          <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428] text-xs space-y-1.5 text-[#dbdee1]">
            <div className="flex items-start gap-1.5">
              <span>🐒</span>
              <span><strong>Não alimente o macaco:</strong> ele descontrola após as 22h</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span>🍲</span>
              <span><strong>Não faça sopa às 2 da manhã:</strong> o barulho acorda o Sub Dono</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span>⚡</span>
              <span><strong>Hierarquia sagrada:</strong> proibido gemer sem permissão</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToDiscord}
            className="w-full py-2.5 bg-[#35373c] hover:bg-[#5865F2] hover:text-white text-xs font-semibold text-[#dbdee1] rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Ver Embed no Canal #regras
          </button>
        </div>

        {/* Card 3: Hierarquia de Cargos */}
        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FEE75C]/20 text-[#FEE75C]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Cargos Paneleiros</h3>
          </div>
          <p className="text-xs text-[#949ba4] leading-relaxed">
            Estrutura hierárquica automática com cores neon, permissões de moderação e exibição separada na lista:
          </p>
          <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428] text-xs space-y-1 font-semibold">
            <div className="text-[#FEE75C]">👑 DONO (Administrador)</div>
            <div className="text-[#E67E22]">⚔️ SUB DONO (Gerente)</div>
            <div className="text-[#9B59B6]">⚡ DEUSES (Vip Lendário)</div>
            <div className="text-[#3498DB]">🛡️ MODERADORES (Fiscal)</div>
            <div className="text-[#E74C3C]">🔥 ALFAS (Elite)</div>
            <div className="text-[#95A5A6]">🧊 BETAS (Comum)</div>
            <div className="text-[#2ECC71]">📢 DIVULGADOR (Parcerias)</div>
            <div className="text-[#BDC3C7]">👤 MEMBRO (Novatos)</div>
          </div>
          <button
            type="button"
            onClick={onOpenConnectModal}
            className="w-full py-2.5 bg-[#35373c] hover:bg-[#5865F2] hover:text-white text-xs font-semibold text-[#dbdee1] rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Trocar Servidor Conectado
          </button>
        </div>
      </div>
    </div>
  );
};

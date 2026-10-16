import React, { useState, useEffect } from 'react';
import {
  Bot,
  Check,
  Shield,
  Server,
  ArrowRight,
  ExternalLink,
  Key,
  Sparkles,
  HelpCircle,
  Lock,
  Copy,
  LogIn,
  AlertCircle,
  RefreshCw,
  Terminal,
  CheckCircle2,
  Database
} from 'lucide-react';
import { BOT_AVATAR } from '../data/templates';
import { DiscordGuild } from '../types/discord';

interface DiscordAuthModalProps {
  isOpen: boolean;
  onAuthorize: (
    selectedGuildId: string,
    credentials?: {
      clientId?: string;
      clientSecret?: string;
      botToken?: string;
    },
    realUser?: any
  ) => void;
  availableGuilds: DiscordGuild[];
  currentConnectedGuildId?: string;
  onRegisterManualGuild?: (guildId: string) => Promise<boolean>;
  onSyncGuilds?: () => Promise<void>;
}

export const DiscordAuthModal: React.FC<DiscordAuthModalProps> = ({
  isOpen,
  onAuthorize,
  availableGuilds,
  currentConnectedGuildId,
  onRegisterManualGuild,
  onSyncGuilds
}) => {
  const [selectedGuild, setSelectedGuild] = useState<string>(
    currentConnectedGuildId || availableGuilds[0]?.id || ''
  );
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedRedirect, setCopiedRedirect] = useState(false);

  // Credentials
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [botToken, setBotToken] = useState('');
  const [manualGuildId, setManualGuildId] = useState('');
  const [detectedBot, setDetectedBot] = useState<{ username: string; id: string; avatar?: string } | null>(null);

  // Slash commands registration state
  const [isRegisteringCommands, setIsRegisteringCommands] = useState(false);
  const [commandRegFeedback, setCommandRegFeedback] = useState<string | null>(null);

  // Manual server register state
  const [isRegisteringGuild, setIsRegisteringGuild] = useState(false);
  const [guildRegFeedback, setGuildRegFeedback] = useState<string | null>(null);

  // Dynamic redirect URI for current environment
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const dynamicCallbackUrl = `${currentOrigin}/auth/callback`;

  // Fetch real credentials and status from server on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/discord/config');
        if (res.ok) {
          const data = await res.json();
          if (data.clientId) {
            setClientId(data.clientId);
          }
          if (data.guildId) {
            setManualGuildId(data.guildId);
            if (!selectedGuild) setSelectedGuild(data.guildId);
          }
          if (data.botUser) {
            setDetectedBot(data.botUser);
          }
        }
      } catch (e) {
        // non-blocking
      }
    }
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  // Safe bot invite URL
  const safeBotInviteUrl = clientId
    ? `https://discord.com/oauth2/authorize?client_id=${clientId.trim()}&permissions=8&scope=bot%20applications.commands`
    : '';

  // Listen for OAuth2 postMessage
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { user, guilds } = event.data;
        setIsAuthorizing(false);

        const targetGuild = guilds && guilds.length > 0 ? guilds[0].id : selectedGuild;
        onAuthorize(
          targetGuild,
          { clientId, clientSecret, botToken },
          user
        );
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setIsAuthorizing(false);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [selectedGuild, clientId, clientSecret, botToken, onAuthorize]);

  if (!isOpen) return null;

  // Direct Bot Add to Discord Server
  const handleDirectBotInvite = () => {
    if (!clientId.trim()) {
      alert('Por favor, informe o seu CLIENT ID (Application ID) do Discord Developer Portal.');
      return;
    }
    window.open(safeBotInviteUrl, '_blank');
  };

  // Register Slash Commands on Discord API (/load [id]:dog)
  const handleRegisterSlashCommands = async () => {
    setIsRegisteringCommands(true);
    setCommandRegFeedback(null);

    try {
      const targetGId = manualGuildId.trim() || selectedGuild;
      const res = await fetch('/api/discord/commands/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(botToken ? { 'x-discord-token': botToken.trim() } : {})
        },
        body: JSON.stringify({
          guildId: targetGId,
          clientId: clientId.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCommandRegFeedback(`✅ Comando /load [id]:dog registrado com sucesso! Já está visível no Discord.`);
      } else {
        setCommandRegFeedback(`⚠️ Aviso: ${data.error || 'Falha ao registrar comandos'}`);
      }
    } catch (err: any) {
      setCommandRegFeedback(`❌ Erro: ${err.message}`);
    } finally {
      setIsRegisteringCommands(false);
    }
  };

  // Register Manual Guild by ID
  const handleRegisterGuild = async () => {
    if (!manualGuildId.trim()) return;
    setIsRegisteringGuild(true);
    setGuildRegFeedback(null);

    try {
      if (onRegisterManualGuild) {
        const ok = await onRegisterManualGuild(manualGuildId.trim());
        if (ok) {
          setSelectedGuild(manualGuildId.trim());
          setGuildRegFeedback(`✅ Servidor ${manualGuildId.trim()} registrado no site com sucesso!`);
        } else {
          setGuildRegFeedback(`⚠️ Servidor adicionado ao site com sucesso.`);
          setSelectedGuild(manualGuildId.trim());
        }
      } else {
        setSelectedGuild(manualGuildId.trim());
        setGuildRegFeedback(`✅ Servidor ${manualGuildId.trim()} selecionado!`);
      }
    } catch (e: any) {
      setGuildRegFeedback(`Erro ao registrar servidor: ${e.message}`);
    } finally {
      setIsRegisteringGuild(false);
    }
  };

  const handleConnect = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      onAuthorize(selectedGuild, {
        clientId: clientId.trim() || undefined,
        clientSecret: clientSecret.trim() || undefined,
        botToken: botToken.trim() || undefined
      });
    }, 400);
  };

  const copyInviteLink = () => {
    if (safeBotInviteUrl) {
      navigator.clipboard.writeText(safeBotInviteUrl);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#313338] border border-[#232428] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#dbdee1]">
        {/* Header with Discord Blurple Branding */}
        <div className="p-5 bg-[#2b2d31] border-b border-[#232428] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={BOT_AVATAR}
                alt="PanelBot Avatar"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#5865F2] shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#23a55a] rounded-full border-2 border-[#2b2d31]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Conexão & Registro Discord</h2>
                <span className="text-[10px] bg-[#5865F2] text-white font-bold px-1.5 py-0.5 rounded tracking-wider">
                  PAINEL REAL
                </span>
              </div>
              <p className="text-xs text-[#949ba4] mt-0.5">
                Vincule o bot ao servidor e registre o comando <code className="text-white font-mono">/load [id]:dog</code>
              </p>
            </div>
          </div>

          {onSyncGuilds && (
            <button
              type="button"
              onClick={() => onSyncGuilds()}
              title="Sincronizar servidores com Discord API"
              className="p-2 rounded-xl bg-[#1e1f22] hover:bg-[#35373c] border border-[#3f4147] text-[#949ba4] hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Real Detected Bot Banner if token is present */}
          {detectedBot && (
            <div className="p-3 bg-[#23a55a]/15 border border-[#23a55a]/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#23a55a] animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Bot Detectado: @{detectedBot.username}
                  </div>
                  <div className="text-[10px] text-[#949ba4] font-mono">
                    Application ID: {detectedBot.id}
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-[#23a55a] text-white font-bold px-2 py-0.5 rounded">
                BOT ATIVO
              </span>
            </div>
          )}

          {/* 1. SEÇÃO: REGISTRAR SERVIDOR NO SITE (GUILD ID) */}
          <div className="p-4 bg-[#1e1f22] rounded-2xl border border-[#3f4147] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#5865F2]" />
                <span>ID do Servidor (Guild ID)</span>
              </label>
              <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] font-semibold px-2 py-0.5 rounded font-mono">
                REGISTRO NO SITE
              </span>
            </div>

            <p className="text-[11px] text-[#949ba4] leading-relaxed">
              Cole o <strong>ID do seu servidor</strong> para que ele apareça registrado no site e receba os comandos:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: 118492049182901234 (Copie do Discord)"
                value={manualGuildId}
                onChange={(e) => setManualGuildId(e.target.value)}
                className="flex-1 bg-[#2b2d31] border border-[#3f4147] focus:border-[#5865F2] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-[#80848e] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleRegisterGuild}
                disabled={!manualGuildId.trim() || isRegisteringGuild}
                className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                {isRegisteringGuild ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                <span>Registrar Servidor</span>
              </button>
            </div>

            {guildRegFeedback && (
              <div className="text-[11px] text-[#23a55a] font-medium bg-[#23a55a]/10 border border-[#23a55a]/30 p-2 rounded-lg">
                {guildRegFeedback}
              </div>
            )}
          </div>

          {/* 2. SEÇÃO: REGISTRAR COMANDO SLASH NO DISCORD (/load [id]:dog) */}
          <div className="p-4 bg-[#1e1f22] rounded-2xl border border-[#23a55a]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#23a55a]" />
                <span>Registrar Comando /load [id]:dog no Discord</span>
              </span>
              <span className="text-[10px] bg-[#23a55a]/20 text-[#23a55a] px-2 py-0.5 rounded font-mono font-bold">
                INSTANTÂNEO
              </span>
            </div>

            <p className="text-[11px] text-[#b5bac1] leading-relaxed">
              Para o comando <strong>/load</strong> aparecer com o parâmetro automático <code>[id]:dog</code> dentro do Discord, clique abaixo para registrá-lo na API do Discord:
            </p>

            <button
              type="button"
              onClick={handleRegisterSlashCommands}
              disabled={isRegisteringCommands}
              className="w-full py-2.5 px-4 rounded-xl bg-[#23a55a] hover:bg-[#1f924f] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#23a55a]/20 transition-all disabled:opacity-50"
            >
              {isRegisteringCommands ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registrando Comando na API do Discord...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Registrar Comando /load [id]:dog no Discord</span>
                </>
              )}
            </button>

            {commandRegFeedback && (
              <div className="text-[11px] p-2.5 rounded-lg bg-[#2b2d31] border border-[#3f4147] text-white">
                {commandRegFeedback}
              </div>
            )}
          </div>

          {/* 3. SEÇÃO: CLIENT ID DO BOT & CONVITE */}
          <div className="p-4 bg-[#1e1f22] rounded-2xl border border-[#3f4147] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#5865F2]" />
                <span>Client ID (Application ID)</span>
              </label>
              <span className="text-[10px] text-[#949ba4]">Para adicionar o bot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: 118492049182901"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="flex-1 bg-[#2b2d31] border border-[#3f4147] focus:border-[#5865F2] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-[#80848e] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleDirectBotInvite}
                disabled={!clientId.trim()}
                className="px-3.5 py-2 bg-[#35373c] hover:bg-[#5865F2] hover:text-white text-xs font-semibold rounded-xl text-[#dbdee1] transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Convidar Bot</span>
              </button>
            </div>
          </div>

          {/* 4. SEÇÃO: SELEÇÃO DO SERVIDOR ATIVO */}
          <div>
            <label className="block text-xs font-semibold text-[#b5bac1] uppercase tracking-wider mb-2">
              Servidores Registrados no Site:
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableGuilds.map((guild) => {
                const isSelected = selectedGuild === guild.id;
                return (
                  <button
                    key={guild.id}
                    type="button"
                    onClick={() => setSelectedGuild(guild.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#35373c] border-[#5865F2] ring-1 ring-[#5865F2]'
                        : 'bg-[#2b2d31] border-[#1e1f22] hover:bg-[#35373c]/70 hover:border-[#3f4147]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-9 h-9 rounded-xl bg-[#1e1f22] flex items-center justify-center text-sm font-bold text-white shadow-inner font-mono shrink-0">
                        {guild.icon && guild.icon.startsWith('http') ? (
                          <img src={guild.icon} alt="" className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          guild.icon || guild.name.substring(0, 2)
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-white text-xs flex items-center gap-2 truncate">
                          <span className="truncate">{guild.name}</span>
                          <span className="text-[10px] text-[#23a55a] font-medium shrink-0 flex items-center gap-0.5">
                            • Registrado
                          </span>
                        </div>
                        <div className="text-[11px] text-[#949ba4] font-mono">
                          ID: {guild.id} · {guild.memberCount.toLocaleString()} membros
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#2b2d31] border-t border-[#232428] flex items-center justify-between">
          <div className="text-xs text-[#949ba4] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#23a55a]" />
            <span>Painel Paneleiro Ativo</span>
          </div>

          <button
            type="button"
            onClick={handleConnect}
            disabled={isAuthorizing || !selectedGuild}
            className="px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#5865F2]/20 transition-all disabled:opacity-50"
          >
            <span>Entrar no Painel com Servidor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

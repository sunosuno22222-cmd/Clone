import React, { useState } from 'react';
import {
  Hash,
  Volume2,
  ChevronDown,
  ChevronRight,
  Send,
  Sparkles,
  Users,
  Search,
  Bell,
  Pin,
  HelpCircle,
  Mic,
  Headphones,
  Settings,
  Plus,
  ShieldAlert,
  Terminal,
  Zap,
  Globe,
  Tag,
  Megaphone,
  MessageSquare,
  Lock,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { DiscordGuild, DiscordChannel, DiscordMessage } from '../types/discord';
import { DiscordEmbedView } from './DiscordEmbedView';
import { DiscordForumView } from './DiscordForumView';
import { BOT_AVATAR } from '../data/templates';

interface DiscordPreviewProps {
  currentGuild: DiscordGuild;
  allGuilds: DiscordGuild[];
  onSelectGuild: (guildId: string) => void;
  onOpenAuthModal: () => void;
  onExecuteCommand: (command: string) => void;
  messages: Record<string, DiscordMessage[]>;
  onSendMessage: (channelKey: string, content: string) => void;
  onSimulateMemberEvent?: (type: 'join' | 'leave') => void;
}

export const DiscordPreview: React.FC<DiscordPreviewProps> = ({
  currentGuild,
  allGuilds,
  onSelectGuild,
  onOpenAuthModal,
  onExecuteCommand,
  messages,
  onSendMessage,
  onSimulateMemberEvent
}) => {
  const defaultTextChannel =
    currentGuild.channels.find((c) => c.name.includes('entrada')) ||
    currentGuild.channels.find((c) => c.type === 'text') ||
    currentGuild.channels[0];

  const [activeChannelId, setActiveChannelId] = useState<string>(
    defaultTextChannel?.id || ''
  );
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [inputText, setInputText] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [selectedTemplateChoice, setSelectedTemplateChoice] = useState<'dog' | 'dog_cyb'>('dog');
  const [showMemberList, setShowMemberList] = useState(true);
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<string | null>(null);

  // IP Finder input state
  const [ipTarget, setIpTarget] = useState('');
  const [ipResults, setIpResults] = useState<{
    target: string;
    ip: string;
    city: string;
    provider: string;
    status: string;
    cep: string;
  } | null>(null);

  const activeChannel = currentGuild.channels.find((c) => c.id === activeChannelId) || defaultTextChannel;

  // Toggle category collapse
  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const categories = currentGuild.channels.filter((c) => c.type === 'category');
  const uncategorizedChannels = currentGuild.channels.filter(
    (c) => c.type !== 'category' && !c.parentId
  );

  const getChannelsForCategory = (catId: string) => {
    return currentGuild.channels.filter((c) => c.parentId === catId);
  };

  // Determine channel key for messages
  const getChannelKey = (channel?: DiscordChannel) => {
    if (!channel) return 'sms';
    const name = channel.name.toLowerCase();
    if (name.includes('entrada')) return 'entrada';
    if (name.includes('saindo')) return 'saindo';
    if (name.includes('regras')) return 'regras';
    if (name.includes('anuncios')) return 'anuncios';
    if (name.includes('buscar-ip')) return 'buscar-ip';
    if (name.includes('plaquinhas')) return 'plaquinhas';
    return 'sms';
  };

  const channelKey = getChannelKey(activeChannel);
  const channelMessages = messages[channelKey] || messages['sms'] || [];

  // When user types in chat input
  const handleInputChange = (val: string) => {
    // If user writes "/load" or "/load ", auto-transform to "/load [id]:dog"
    if (val === '/load' || val === '/load ') {
      setInputText('/load [id]:dog');
      setSelectedTemplateChoice('dog');
      setShowSlashMenu(true);
      return;
    }

    if (val.startsWith('/')) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }

    // Check if user is typing template id inside [id]:...
    const match = val.match(/\/load\s+\[id\]:([a-zA-Z0-9_-]*)/);
    if (match) {
      if (match[1] === 'dog_cyb') setSelectedTemplateChoice('dog_cyb');
      else if (match[1] === 'dog') setSelectedTemplateChoice('dog');
    }

    setInputText(val);
  };

  const handleSelectSlashCommand = (choice: 'dog' | 'dog_cyb') => {
    setSelectedTemplateChoice(choice);
    setInputText(`/load [id]:${choice}`);
    setShowSlashMenu(false);
  };

  // Handle message sending
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (inputText.startsWith('/')) {
      setShowSlashMenu(false);
      onExecuteCommand(inputText);
      setInputText('');
      return;
    }

    onSendMessage(channelKey, inputText);
    setInputText('');
  };

  // Trigger Fake IP Search
  const handleFakeIpSearch = (targetName: string) => {
    const fakeIps = ['177.136.21.90', '189.44.112.54', '201.88.9.14', '192.168.1.1 (Localhost kkk)'];
    const fakeCities = [
      'Xique-Xique, Bahia (Próximo à antena)',
      'São Paulo, SP (Bairro Sem CLT)',
      'Curitiba, PR (Abaixo de zero)',
      'Brasília, DF (Esplanada dos Betas)'
    ];
    const providers = ['GatoNet Fibra 20Mbps', 'Oi Velox Discada', 'Starlink do Paraguai', 'Claro 3G Instável'];
    const ceps = ['47400-000', '01000-000', '80000-000', '70000-000'];

    const randomIdx = Math.floor(Math.random() * fakeIps.length);
    setIpResults({
      target: targetName || 'Beta_Aleatorio#1337',
      ip: fakeIps[randomIdx],
      city: fakeCities[randomIdx],
      provider: providers[randomIdx],
      status: 'Puxado com sucesso pelo PanelBot dog_cyb',
      cep: ceps[randomIdx]
    });
  };

  const isForumChannel = activeChannel?.type === 'forum' || activeChannel?.name.includes('plaquinhas');
  const isReadOnly = activeChannel?.readOnly || activeChannel?.type === 'announcement' || channelKey === 'regras' || channelKey === 'entrada' || channelKey === 'saindo' || channelKey === 'anuncios';

  // Render proper channel icon (strictly no emojis!)
  const renderChannelIcon = (type: string, readOnly?: boolean) => {
    if (type === 'voice') return <Volume2 className="w-4 h-4 shrink-0 text-[#80848e]" />;
    if (type === 'announcement') return <Megaphone className="w-4 h-4 shrink-0 text-[#f0b232]" />;
    if (type === 'forum') return <MessageSquare className="w-4 h-4 shrink-0 text-[#5865F2]" />;
    if (readOnly) return <Lock className="w-3.5 h-3.5 shrink-0 text-[#80848e]" />;
    return <Hash className="w-4 h-4 shrink-0 text-[#80848e]" />;
  };

  return (
    <div className="flex h-[760px] w-full rounded-2xl overflow-hidden border border-[#1f2023] bg-[#313338] shadow-2xl text-[#dbdee1] select-none">
      {/* 1. Left Guild Rail (Server Icons) */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 shrink-0 border-r border-[#111214]/60">
        <div className="relative group">
          <button
            type="button"
            className="w-12 h-12 rounded-2xl bg-[#5865F2] hover:rounded-xl transition-all duration-200 flex items-center justify-center text-white shadow-lg"
          >
            <Sparkles className="w-6 h-6" />
          </button>
          <div className="absolute left-0 top-3 w-1 h-6 bg-white rounded-r -translate-x-1" />
        </div>

        <div className="w-8 h-[2px] bg-[#35373c] rounded my-1" />

        <div className="flex-1 overflow-y-auto space-y-2 w-full flex flex-col items-center">
          {allGuilds.map((guild) => {
            const isActive = guild.id === currentGuild.id;
            return (
              <div key={guild.id} className="relative group flex items-center justify-center w-full">
                <div
                  className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-200 ${
                    isActive ? 'h-10 -translate-x-0' : 'h-2 opacity-0 group-hover:opacity-100 group-hover:h-5'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => onSelectGuild(guild.id)}
                  title={guild.name}
                  className={`w-12 h-12 flex items-center justify-center font-bold text-base transition-all duration-200 ${
                    isActive
                      ? 'rounded-2xl bg-[#5865F2] text-white shadow-lg shadow-[#5865F2]/30'
                      : 'rounded-3xl bg-[#313338] hover:rounded-2xl hover:bg-[#5865F2] text-[#dbdee1] hover:text-white'
                  }`}
                >
                  {guild.icon ? guild.icon : guild.name.substring(0, 2)}
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={onOpenAuthModal}
            title="Conectar Bot a Outro Servidor"
            className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white flex items-center justify-center transition-all duration-200 group"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </div>

      {/* 2. Channels Sidebar */}
      <div className="w-64 bg-[#2b2d31] flex flex-col shrink-0 border-r border-[#1f2023]">
        {/* Guild Header */}
        <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between font-bold text-white shadow-sm hover:bg-[#35373c]/50 cursor-pointer transition-colors">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate">{currentGuild.name}</span>
            <span className="text-xs bg-[#5865F2] text-white px-1.5 py-0.5 rounded font-mono">
              PANELEIRO
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#949ba4]" />
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {uncategorizedChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannelId(channel.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                activeChannel?.id === channel.id
                  ? 'bg-[#35373c] text-white font-medium'
                  : 'text-[#949ba4] hover:bg-[#35373c]/40 hover:text-[#dbdee1]'
              }`}
            >
              {renderChannelIcon(channel.type, channel.readOnly)}
              <span className="truncate">{channel.name}</span>
            </button>
          ))}

          {categories.map((cat) => {
            const isCollapsed = collapsedCategories[cat.id];
            const childChannels = getChannelsForCategory(cat.id);

            return (
              <div key={cat.id} className="space-y-0.5">
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center gap-1.5 px-1 py-1 text-[11px] font-bold text-[#949ba4] hover:text-[#dbdee1] uppercase tracking-wider transition-colors text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-[#949ba4]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[#949ba4]" />
                  )}
                  <span className="truncate">{cat.name}</span>
                </button>

                {/* Category Channels */}
                {!isCollapsed &&
                  childChannels.map((channel) => {
                    const isActive = activeChannel?.id === channel.id;
                    const isVoice = channel.type === 'voice';

                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => {
                          setActiveChannelId(channel.id);
                          if (isVoice) {
                            setActiveVoiceRoom(channel.name);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm transition-all group ${
                          isActive
                            ? 'bg-[#35373c] text-white font-medium shadow-sm'
                            : 'text-[#949ba4] hover:bg-[#35373c]/40 hover:text-[#dbdee1]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {renderChannelIcon(channel.type, channel.readOnly)}
                          <span className="truncate tracking-wide">{channel.name}</span>
                        </div>

                        {channel.userLimit && (
                          <span className="text-[10px] text-[#80848e] font-mono">
                            0/{channel.userLimit}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* User Status Bar at Bottom */}
        <div className="h-14 bg-[#232428] px-2 flex items-center justify-between shrink-0 border-t border-[#1e1f22]">
          <div className="flex items-center gap-2 hover:bg-[#35373c]/60 p-1.5 rounded-lg cursor-pointer transition-colors">
            <div className="relative">
              <img
                src={BOT_AVATAR}
                alt="Me"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#5865F2]"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#23a55a] rounded-full border-2 border-[#232428]" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-white">Dog_Fundador</div>
              <div className="text-[10px] text-[#949ba4] font-mono">#0001 · DONO</div>
            </div>
          </div>

          <div className="flex items-center text-[#b5bac1]">
            <button
              type="button"
              title="Microfone"
              className="p-1.5 hover:bg-[#35373c] hover:text-white rounded-md transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Áudio"
              className="p-1.5 hover:bg-[#35373c] hover:text-white rounded-md transition-colors"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Configurações"
              className="p-1.5 hover:bg-[#35373c] hover:text-white rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Viewport: Chat or Forum */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
        {/* Top Channel Bar */}
        <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between bg-[#313338] shrink-0">
          <div className="flex items-center gap-2 truncate">
            {renderChannelIcon(activeChannel?.type || 'text', activeChannel?.readOnly)}
            <span className="font-bold text-white text-base truncate">
              {activeChannel?.name || 'Canal'}
            </span>
            {isReadOnly && (
              <span className="text-[10px] bg-[#1e1f22] text-[#949ba4] border border-[#35373c] px-1.5 py-0.5 rounded font-mono">
                Apenas Leitura
              </span>
            )}
            {activeChannel?.topic && (
              <>
                <span className="text-[#4e5058]">|</span>
                <span className="text-xs text-[#949ba4] truncate max-w-md hidden sm:inline">
                  {activeChannel.topic}
                </span>
              </>
            )}
          </div>

          {/* Quick Simulation Buttons on top bar */}
          <div className="flex items-center gap-2 text-[#b5bac1]">
            {channelKey === 'entrada' && onSimulateMemberEvent && (
              <button
                type="button"
                onClick={() => onSimulateMemberEvent('join')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#2ECC71]/20 hover:bg-[#2ECC71] text-[#2ECC71] hover:text-white rounded-md text-xs font-semibold transition-all border border-[#2ECC71]/40"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Simular Entrada</span>
              </button>
            )}

            {channelKey === 'saindo' && onSimulateMemberEvent && (
              <button
                type="button"
                onClick={() => onSimulateMemberEvent('leave')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#ED4245]/20 hover:bg-[#ED4245] text-[#ED4245] hover:text-white rounded-md text-xs font-semibold transition-all border border-[#ED4245]/40"
              >
                <UserMinus className="w-3.5 h-3.5" />
                <span>Simular Saída</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onExecuteCommand('/load dog_cyb')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#5865F2]/20 hover:bg-[#5865F2] text-[#c9cdfb] hover:text-white rounded-md text-xs font-semibold transition-all border border-[#5865F2]/30"
              title="Executar /load dog_cyb"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>/load dog_cyb</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMemberList(!showMemberList)}
              className={`p-1.5 rounded hover:bg-[#35373c] hover:text-white transition-colors ${
                showMemberList ? 'text-white' : 'text-[#80848e]'
              }`}
              title="Membros"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If this is the Forum Channel (・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀) */}
        {isForumChannel ? (
          <DiscordForumView channelName={activeChannel?.name || '・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀'} />
        ) : (
          <>
            {/* Standard Channel Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Channel Header Description */}
              <div className="mb-6 p-4 rounded-xl bg-[#2b2d31]/50 border border-[#35373c]/50">
                <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white mb-3">
                  {renderChannelIcon(activeChannel?.type || 'text', activeChannel?.readOnly)}
                </div>
                <h3 className="text-xl font-bold text-white">
                  Bem-vindo a {activeChannel?.name}!
                </h3>
                <p className="text-xs text-[#949ba4] mt-1">
                  {activeChannel?.topic || 'Início do histórico de mensagens deste canal.'}
                </p>
              </div>

              {/* Interactive tool if in #buscar-ip */}
              {activeChannel?.name.includes('buscar-ip') && (
                <div className="p-4 bg-[#2b2d31] border border-[#3f4147] rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Globe className="w-4 h-4 text-[#e74c3c]" />
                    <span>Simulador de Busca de IP & Dox Fictício (Paneleiro)</span>
                  </div>
                  <p className="text-xs text-[#949ba4]">
                    Digite o apelido de qualquer membro para simular uma varredura engraçada:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: @beta_revoltado ou 192.168.0.1"
                      value={ipTarget}
                      onChange={(e) => setIpTarget(e.target.value)}
                      className="flex-1 bg-[#1e1f22] border border-[#3f4147] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                    />
                    <button
                      type="button"
                      onClick={() => handleFakeIpSearch(ipTarget)}
                      className="px-4 py-1.5 bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Puxar Dados</span>
                    </button>
                  </div>

                  {ipResults && (
                    <div className="mt-3 p-3 bg-[#1e1f22] rounded-lg border border-[#e74c3c]/40 font-mono text-xs space-y-1">
                      <div className="text-[#e74c3c] font-bold">
                        [+] VARREDURA CONCLUÍDA PARA: {ipResults.target}
                      </div>
                      <div>IP Fictício: <span className="text-[#2ecc71]">{ipResults.ip}</span></div>
                      <div>Localização: <span className="text-white">{ipResults.city}</span></div>
                      <div>Provedor: <span className="text-white">{ipResults.provider}</span></div>
                      <div>CEP Estimado: <span className="text-white">{ipResults.cep}</span></div>
                      <div className="text-[11px] text-[#949ba4] italic mt-1">
                        * Zueira oficial do PanelBot dog_cyb edition. Não alimente o macaco!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Messages list */}
              {channelMessages.map((msg) => (
                <div key={msg.id} className="flex gap-4 group hover:bg-[#2e3035]/50 -mx-4 px-4 py-1.5 rounded-lg transition-colors">
                  <img
                    src={msg.author.avatar}
                    alt={msg.author.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-sm hover:underline cursor-pointer"
                        style={{ color: msg.author.roleColor || '#ffffff' }}
                      >
                        {msg.author.name}
                      </span>
                      {msg.author.bot && (
                        <span className="text-[10px] bg-[#5865F2] text-white font-bold px-1 py-0.2 rounded tracking-wider">
                          BOT
                        </span>
                      )}
                      {msg.author.roleName && (
                        <span className="text-[11px] text-[#949ba4] font-medium hidden sm:inline">
                          [{msg.author.roleName}]
                        </span>
                      )}
                      <span className="text-[11px] text-[#949ba4]">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.content && (
                      <div className="text-sm text-[#dbdee1] mt-1 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    )}

                    {msg.embeds && msg.embeds.map((emb, i) => (
                      <DiscordEmbedView key={i} embed={emb} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar or Read-Only Lock Banner */}
            <div className="p-4 bg-[#313338] border-t border-[#1f2023] relative">
              {/* Discord Slash Command Autocomplete Popover */}
              {(showSlashMenu || inputText.startsWith('/')) && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#2b2d31] border border-[#1f2023] rounded-xl shadow-2xl p-2.5 z-20 space-y-1.5">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#949ba4] border-b border-[#35373c]/50">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#5865F2]" />
                      COMANDOS DISCORD (SLASH)
                    </span>
                    <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] font-mono px-2 py-0.5 rounded font-bold">
                      VARIÁVEL [id]:dog AUTOMÁTICA
                    </span>
                  </div>

                  {/* Command Option 1: /load [id]:dog */}
                  <div
                    onClick={() => handleSelectSlashCommand('dog')}
                    className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
                      selectedTemplateChoice === 'dog'
                        ? 'bg-[#35373c] ring-1 ring-[#5865F2]'
                        : 'bg-[#2b2d31] hover:bg-[#35373c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center text-white shrink-0 font-mono font-bold text-sm shadow">
                        /
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm font-mono">/load</span>
                          <span className="text-xs font-mono font-bold bg-[#5865F2] text-white px-2 py-0.5 rounded shadow-sm">
                            [id]: dog
                          </span>
                          <span className="text-[10px] bg-[#23a55a]/20 text-[#23a55a] px-1.5 py-0.5 rounded font-mono font-bold">
                            PADRÃO
                          </span>
                        </div>
                        <div className="text-xs text-[#949ba4] mt-0.5">
                          Carrega o template pré-configurado com 30 regras e sem emojis
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#5865F2] group-hover:underline">
                      Tab ou Enter ↵
                    </span>
                  </div>

                  {/* Command Option 2: /load [id]:dog_cyb */}
                  <div
                    onClick={() => handleSelectSlashCommand('dog_cyb')}
                    className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
                      selectedTemplateChoice === 'dog_cyb'
                        ? 'bg-[#35373c] ring-1 ring-[#5865F2]'
                        : 'bg-[#2b2d31] hover:bg-[#35373c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#35373c] flex items-center justify-center text-[#949ba4] shrink-0 font-mono font-bold text-sm">
                        /
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#dbdee1] font-bold text-sm font-mono">/load</span>
                          <span className="text-xs font-mono font-bold bg-[#35373c] text-[#dbdee1] border border-[#3f4147] px-2 py-0.5 rounded">
                            [id]: dog_cyb
                          </span>
                        </div>
                        <div className="text-xs text-[#949ba4] mt-0.5">
                          Versão completa do template DOG_CYB
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#949ba4] group-hover:underline">
                      Selecionar
                    </span>
                  </div>
                </div>
              )}

              {isReadOnly ? (
                <div className="w-full bg-[#2b2d31] border border-[#35373c] rounded-xl p-3 flex items-center justify-center gap-2 text-xs text-[#949ba4]">
                  <Lock className="w-4 h-4 text-[#80848e]" />
                  <span>
                    Você não tem permissão para enviar mensagens em <strong>{activeChannel?.name}</strong> (Canal de Visualização Apenas)
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Quick Slash Command Chip Trigger */}
                  <div className="flex items-center gap-2 text-xs text-[#949ba4]">
                    <span className="text-[11px]">Comando Rápido:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputText('/load [id]:dog');
                        setSelectedTemplateChoice('dog');
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2b2d31] hover:bg-[#5865F2] text-white text-[11px] font-mono border border-[#3f4147] transition-all group"
                    >
                      <Terminal className="w-3 h-3 text-[#5865F2] group-hover:text-white" />
                      <span>/load</span>
                      <span className="bg-[#1e1f22] px-1 rounded text-[#23a55a] font-bold">[id]:dog</span>
                    </button>
                    <span className="text-[11px] text-[#80848e] hidden sm:inline">
                      (Digite <code className="text-white font-mono">/load</code> para vir o parâmetro automático)
                    </span>
                  </div>

                  <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={() => {
                        if (inputText.startsWith('/')) setShowSlashMenu(true);
                      }}
                      placeholder={`Conversar em ${activeChannel?.name || 'chat'} (ou digite /load para autocompletar [id]:dog)`}
                      className="w-full bg-[#383a40] text-white placeholder-[#80848e] text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-[#5865F2] font-sans"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="absolute right-2 p-1.5 rounded-md text-[#949ba4] hover:text-white hover:bg-[#4752c4] disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 4. Right Member List */}
      {showMemberList && (
        <div className="w-60 bg-[#2b2d31] flex flex-col shrink-0 border-l border-[#1f2023] overflow-y-auto p-3 space-y-4">
          {currentGuild.roles.map((role) => {
            return (
              <div key={role.id} className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#949ba4] px-1 flex items-center justify-between">
                  <span className="truncate">{role.name}</span>
                  <span className="font-mono text-[10px]">{role.memberCount}</span>
                </div>

                {role.name.includes('DONO') && (
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] cursor-pointer">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=dono_dog"
                        alt=""
                        className="w-8 h-8 rounded-full bg-[#1e1f22]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#23a55a] rounded-full border border-[#2b2d31]" />
                    </div>
                    <div className="truncate leading-tight">
                      <div className="text-xs font-semibold text-[#FEE75C] truncate">Dog_Fundador</div>
                      <div className="text-[10px] text-[#949ba4]">Criador da Panel</div>
                    </div>
                  </div>
                )}

                {role.name.includes('PANELBOT') && (
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] cursor-pointer">
                    <div className="relative">
                      <img
                        src={BOT_AVATAR}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#23a55a] rounded-full border border-[#2b2d31]" />
                    </div>
                    <div className="truncate leading-tight">
                      <div className="text-xs font-semibold text-[#5865F2] flex items-center gap-1">
                        <span>PanelBot</span>
                        <span className="text-[9px] bg-[#5865F2] text-white font-bold px-1 rounded">BOT</span>
                      </div>
                      <div className="text-[10px] text-[#949ba4]">/load dog_cyb</div>
                    </div>
                  </div>
                )}

                {role.name.includes('SUB DONO') && (
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] cursor-pointer">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=sub_dono"
                        alt=""
                        className="w-8 h-8 rounded-full bg-[#1e1f22]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#23a55a] rounded-full border border-[#2b2d31]" />
                    </div>
                    <div className="truncate leading-tight">
                      <div className="text-xs font-semibold text-[#E67E22] truncate">Sub_Tenente</div>
                      <div className="text-[10px] text-[#949ba4]">Fiscal da Sopa</div>
                    </div>
                  </div>
                )}

                {role.name.includes('DEUSES') && (
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] cursor-pointer">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=zeus_panel"
                        alt=""
                        className="w-8 h-8 rounded-full bg-[#1e1f22]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#f0b232] rounded-full border border-[#2b2d31]" />
                    </div>
                    <div className="truncate leading-tight">
                      <div className="text-xs font-semibold text-[#9B59B6] truncate">Zeus_Paneleiro</div>
                      <div className="text-[10px] text-[#949ba4]">Insônia 96h</div>
                    </div>
                  </div>
                )}

                {role.name.includes('ALFAS') && (
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] cursor-pointer">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=alfa_dog"
                        alt=""
                        className="w-8 h-8 rounded-full bg-[#1e1f22]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#23a55a] rounded-full border border-[#2b2d31]" />
                    </div>
                    <div className="truncate leading-tight">
                      <div className="text-xs font-semibold text-[#E74C3C] truncate">Alfa_Cyborg</div>
                      <div className="text-[10px] text-[#949ba4]">Gamer Nato</div>
                    </div>
                  </div>
                )}

                {role.name.includes('BETAS') && (
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] cursor-pointer opacity-85">
                    <div className="relative">
                      <img
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=beta_humilde"
                        alt=""
                        className="w-8 h-8 rounded-full bg-[#1e1f22]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#80848e] rounded-full border border-[#2b2d31]" />
                    </div>
                    <div className="truncate leading-tight">
                      <div className="text-xs font-semibold text-[#95A5A6] truncate">Beta_Humilde</div>
                      <div className="text-[10px] text-[#949ba4]">Na fila do Duo 1</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

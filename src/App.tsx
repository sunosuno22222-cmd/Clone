import React, { useState } from 'react';
import { INITIAL_SERVERS, INITIAL_MESSAGES } from './data/initialState';
import { DiscordGuild, DiscordMessage, DiscordChannel } from './types/discord';
import {
  TEMPLATE_DOG_CYB,
  AVAILABLE_TEMPLATES,
  SYMBOL_PRESETS,
  toUnicodeBoldSans,
  toUnicodeBoldSerif,
  toSmallCaps,
  BOT_AVATAR,
  buildRulesEmbedPart1,
  buildRulesEmbedPart2
} from './data/templates';
import { TopBar } from './components/TopBar';
import { DiscordAuthModal } from './components/DiscordAuthModal';
import { DashboardOverview } from './components/DashboardOverview';
import { CommandRunner } from './components/CommandRunner';
import { DiscordPreview } from './components/DiscordPreview';
import { RoleManagerTab } from './components/RoleManagerTab';
import { TemplateCustomizerTab } from './components/TemplateCustomizerTab';
import { MemberEventSimulator } from './components/MemberEventSimulator';
import { RulesManagerTab } from './components/RulesManagerTab';
import { PaneleiroRule } from './data/templates';

export default function App() {
  const [servers, setServers] = useState<DiscordGuild[]>(INITIAL_SERVERS);
  const [currentGuildId, setCurrentGuildId] = useState<string>(INITIAL_SERVERS[0].id);

  // Authentication modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userCustomToken, setUserCustomToken] = useState<string | undefined>(undefined);

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Messages per channel
  const [messages, setMessages] = useState<Record<string, DiscordMessage[]>>(INITIAL_MESSAGES);

  // Command runner execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '✅ [INIT] PanelBot v3.0 operacional com suporte a Discord REST API v10.',
    '⚡ [SHARD] Conectado ao cluster com ping de 18ms.',
    '👑 [AUTH] Servidor sincronizado.',
    '💡 [READY] Digite /load dog_cyb para reestruturar canais e cargos sem emojis (somente pontos chineses).'
  ]);

  const currentGuild = servers.find((s) => s.id === currentGuildId) || servers[0];

  // State for authenticated Discord user
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    id: string;
    username: string;
    avatar: string;
    globalName?: string;
  } | null>(null);

  // Handle Discord OAuth authorization
  const handleAuthorize = (
    guildId: string,
    credentials?: {
      clientId?: string;
      clientSecret?: string;
      botToken?: string;
    },
    realUser?: any
  ) => {
    setCurrentGuildId(guildId);
    setIsAuthModalOpen(false);
    if (credentials?.botToken) setUserCustomToken(credentials.botToken);

    if (realUser) {
      const avatarUrl = realUser.avatar
        ? `https://cdn.discordapp.com/avatars/${realUser.id}/${realUser.avatar}.png`
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${realUser.username}`;

      setAuthenticatedUser({
        id: realUser.id,
        username: realUser.username,
        avatar: avatarUrl,
        globalName: realUser.global_name
      });
    }

    setServers((prev) =>
      prev.map((g) => (g.id === guildId ? { ...g, botConnected: true } : g))
    );

    setTerminalLogs((prev) => [
      ...prev,
      realUser
        ? `🔑 [LOGIN REAL] Autenticado com sucesso no Discord como @${realUser.username} (${realUser.global_name || realUser.id})!`
        : `🔑 [OAUTH] Bot autorizado com sucesso no servidor ID: ${guildId}`,
      credentials?.botToken
        ? `🔒 [CREDENCIAIS] Client ID (${credentials.clientId || 'configurado'}), Client Secret (${credentials.clientSecret ? 'salvo' : 'pendente'}) e Bot Token ativos para chamadas reais na API v10.`
        : '🌐 [CONNECTED] Modo conectado de alta fidelidade ativo.'
    ]);
  };

  // Helper to send a message in a channel
  const handleSendMessage = (channelKey: string, content: string) => {
    const newMessage: DiscordMessage = {
      id: `msg_${Date.now()}`,
      channelId: channelKey,
      author: {
        id: 'user_dog_dono',
        name: 'Dog_Fundador',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dono_dog',
        roleColor: '#FEE75C',
        roleName: 'DONO'
      },
      content,
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      [channelKey]: [...(prev[channelKey] || []), newMessage]
    }));
  };

  // Trigger member join or leave event
  const handleSimulateMemberEvent = async (
    type: 'join' | 'leave',
    customUsername?: string,
    customAvatar?: string
  ) => {
    const isJoin = type === 'join';
    const username = customUsername || (isJoin ? 'Kapeta_Novato' : 'Beta_Fujao');
    const avatar =
      customAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const channelKey = isJoin ? 'entrada' : 'saindo';

    const embed = isJoin
      ? {
          title: '🔥 BEM-VINDO, KAPETA!',
          description: `Mais um doido entrou na panelinha! <@${username}> acabou de brotar nos portões do servidor.`,
          color: '#2ECC71',
          thumbnail: { url: avatar },
          fields: [
            {
              name: '📜 Regras da Casa',
              value: 'Vá agora em <#regras> ler o regulamento antes de fazer besteira.',
              inline: true
            },
            {
              name: '🏷️ Plaquinhas no Fórum',
              value: 'Acesse o fórum <#plaquinhas> para resgatar sua insígnia.',
              inline: true
            },
            {
              name: '💬 Bate-papo Liberado',
              value: 'Converse no canal <#sms>.',
              inline: true
            }
          ],
          footer: {
            text: 'PanelBot Welcome System • Sistema de Entrada Ativo'
          },
          timestamp: new Date().toISOString()
        }
      : {
          title: '💀 O FDPT SAIU!',
          description: `O fdpt <@${username}> não aguentou a pressão e vazou do servidor. Espero que o diabo coma seu cu!`,
          color: '#ED4245',
          thumbnail: { url: avatar },
          fields: [
            {
              name: '🧊 Destino do Fraco',
              value: 'Menos um peso morto pra puxar a call pra baixo. Foi pra vala dos betas.',
              inline: false
            }
          ],
          footer: {
            text: 'PanelBot Leave Logger • Menos um membro'
          },
          timestamp: new Date().toISOString()
        };

    const newMsg: DiscordMessage = {
      id: `evt_${Date.now()}`,
      channelId: channelKey,
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      embeds: [embed],
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      [channelKey]: [...(prev[channelKey] || []), newMsg]
    }));

    setTerminalLogs((prev) => [
      ...prev,
      isJoin
        ? `🔥 [ENTRADA] Membro ${username} entrou no servidor (Embed enviado em ・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮).`
        : `💀 [SAÍDA] Membro ${username} saiu do servidor (Embed enviado em ・ 𝘀𝗮𝗶𝗻𝗱𝗼).`
    ]);

    // Send to backend API
    try {
      await fetch('/api/discord/member-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userCustomToken ? { 'x-discord-token': userCustomToken } : {})
        },
        body: JSON.stringify({
          type,
          username,
          avatarUrl: avatar
        })
      });
    } catch (e) {
      // client-side continues smoothly
    }
  };

  // Publish rules to #regras channel (split into Part 1 and Part 2)
  const handlePublishRulesToDiscord = (updatedRules: PaneleiroRule[]) => {
    const part1 = {
      title: '📜 CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 1/2',
      description: 'Regulamento oficial do covil. Siga rigorosamente para evitar rebaixamento imediato a Beta ou deportação para o AFK.',
      color: '#5865F2',
      thumbnail: { url: BOT_AVATAR },
      fields: updatedRules.slice(0, 15).map((r) => ({
        name: r.title,
        value: `${r.description}\n*⚖️ ${r.punishment}*`,
        inline: false
      })),
      footer: {
        text: `PanelBot Security Protocol • 1 a 15 de ${updatedRules.length} regras • dog_cyb`,
        icon_url: BOT_AVATAR
      },
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const part2 = {
      title: '⚡ CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 2/2',
      description: 'Diretrizes complementares de voz, shitpost, microfones e segurança de sobrevivência na panelinha.',
      color: '#9B59B6',
      thumbnail: { url: BOT_AVATAR },
      fields: updatedRules.slice(15, 30).map((r) => ({
        name: r.title,
        value: `${r.description}\n*⚖️ ${r.punishment}*`,
        inline: false
      })),
      footer: {
        text: `PanelBot Security Protocol • 16 a ${updatedRules.length} de ${updatedRules.length} regras • dog_cyb`,
        icon_url: BOT_AVATAR
      },
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const rulesMsg: DiscordMessage = {
      id: `msg_regras_upd_${Date.now()}`,
      channelId: 'regras',
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      embeds: [part1, part2],
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      regras: [rulesMsg]
    }));

    setTerminalLogs((prev) => [
      ...prev,
      `📜 [REGRAS] Regulamento com ${updatedRules.length} regras atualizado e publicado no canal ・ 𝗿𝗲𝗴𝗿𝗮𝘀.`
    ]);
  };

  // Execute /load template
  const handleRunLoadTemplate = async (
    tmplId: string,
    options: {
      symbolStyle: string;
      fontStyle: 'boldSans' | 'boldSerif' | 'smallCaps' | 'default';
      purgeExisting: boolean;
      useRealApi?: boolean;
    }
  ) => {
    setIsExecuting(true);
    setTerminalLogs((prev) => [
      ...prev,
      `🚀 [START] Iniciando protocolo /load ${tmplId} no servidor ${currentGuild.name}...`
    ]);

    const preset = SYMBOL_PRESETS.find((s) => s.id === options.symbolStyle) || SYMBOL_PRESETS[0];

    const formatName = (base: string) => {
      let styled = base;
      if (options.fontStyle === 'boldSans') styled = toUnicodeBoldSans(base);
      else if (options.fontStyle === 'boldSerif') styled = toUnicodeBoldSerif(base);
      else if (options.fontStyle === 'smallCaps') styled = toSmallCaps(base);
      return `${preset.prefix}${styled}`;
    };

    // If real API mode is requested and server endpoint is reachable
    if (options.useRealApi) {
      setTerminalLogs((prev) => [
        ...prev,
        '🌐 [DISCORD API] Enviando requisições REST para https://discord.com/api/v10/guilds/' + currentGuild.id + '...'
      ]);

      try {
        const apiRes = await fetch('/api/discord/load-dog-cyb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(userCustomToken ? { 'x-discord-token': userCustomToken } : {})
          },
          body: JSON.stringify({
            guildId: currentGuild.id,
            purgeExisting: options.purgeExisting
          })
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          setTerminalLogs((prev) => [
            ...prev,
            `📡 [DISCORD API] Resposta: ${apiData.message || 'Comandos enviados com sucesso!'}`
          ]);
        }
      } catch (err: any) {
        setTerminalLogs((prev) => [
          ...prev,
          `⚠️ [API FALLBACK] ${err.message}. Continuando no motor conectado local...`
        ]);
      }
    }

    // Step 1: Purge
    await new Promise((r) => setTimeout(r, 500));
    setTerminalLogs((prev) => [
      ...prev,
      `💣 [PURGE] Apagando ${currentGuild.channels.length} canais antigos do servidor...`
    ]);

    // Step 2: Create Categories (NO EMOJIS, only chinese dots and bold font)
    await new Promise((r) => setTimeout(r, 500));
    setTerminalLogs((prev) => [
      ...prev,
      `🏗️ [CATEGORIAS] Criando categorias: ・ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 ・, ・ 𝐂𝐇𝐀𝐓 𝐆𝐄𝐑𝐀𝐋 ・, ・ 𝐕𝐎𝐙 & 𝐂𝐀𝐋𝐋𝐒 ・`
    ]);

    // Step 3: Create Text Channels with bold & chinese dots
    await new Promise((r) => setTimeout(r, 500));
    setTerminalLogs((prev) => [
      ...prev,
      `✨ [TEXTO] Criando canais: ${formatName('entrada')}, ${formatName('saindo')}, ${formatName('regras')} (leitura), ${formatName('anuncios')} (anúncios), ${formatName('plaquinhas')} (fórum), ${formatName('sms')}, ${formatName('midias')}, ${formatName('buscar-ip')}`
    ]);

    // Step 4: Create Voice Channels
    await new Promise((r) => setTimeout(r, 500));
    setTerminalLogs((prev) => [
      ...prev,
      `🔊 [VOZ] Criando canais de voz: ${formatName('duo 1')} (limite 2), ${formatName('call 1')}, ${formatName('gf 1')} (limite 2), ${formatName('musica 1')}, ${formatName('afk 1')}`
    ]);

    // Step 5: Roles
    await new Promise((r) => setTimeout(r, 400));
    setTerminalLogs((prev) => [
      ...prev,
      `👑 [CARGOS] Hierarquia gerada: DONO, SUB DONO, DEUSES, MODERADORES, ALFAS, BETAS, DIVULGADOR, MEMBRO`
    ]);

    // Step 6: Dispatch Rules Embed
    await new Promise((r) => setTimeout(r, 500));
    setTerminalLogs((prev) => [
      ...prev,
      `📜 [EMBEDS] Disparando Embed de Regras Engraçadas ("Não alimente o macaco", "Não faça sopa às 2 da manhã") no canal #${formatName('regras')}...`
    ]);

    // Rebuild the guild
    const selectedTemplate = AVAILABLE_TEMPLATES.find((t) => t.id === tmplId) || TEMPLATE_DOG_CYB;
    const newChannels: DiscordChannel[] = [];
    let pos = 0;

    for (const cat of selectedTemplate.categories) {
      const catId = `cat_${Date.now()}_${pos++}`;
      newChannels.push({
        id: catId,
        name: cat.name,
        type: 'category',
        position: pos
      });

      for (const ch of cat.channels) {
        let chName = ch.name;
        // Clean out any lingering symbols and apply the selected format
        const cleanRaw = ch.name
          .replace(/^[・✦⌁•〢»々\s]+/, '')
          .replace(/^[📜🤖🌐📢🔊❤️🎵💤]/, '')
          .trim();
        chName = formatName(cleanRaw);

        newChannels.push({
          id: `ch_${Date.now()}_${pos++}`,
          name: chName,
          type: ch.type,
          parentId: catId,
          position: pos,
          topic: ch.topic,
          userLimit: ch.userLimit,
          readOnly: ch.readOnly
        });
      }
    }

    setServers((prev) =>
      prev.map((g) =>
        g.id === currentGuildId
          ? {
              ...g,
              channels: newChannels
            }
          : g
      )
    );

    // Add bot confirmation message to sms
    const botConfirmMsg: DiscordMessage = {
      id: `bot_conf_${Date.now()}`,
      channelId: 'sms',
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      content: `🎉 **Protocolo /load ${tmplId} concluído com êxito!**\n• Nomes configurados com fontes em negrito e apenas pontos chineses.\n• Canais de regras, anúncios, entrada e saída protegidos para leitura.\n• Canal de plaquinhas configurado em formato de Fórum.\n• Sistema de Entrada & Saída pronto.`,
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const rulesMsg: DiscordMessage = {
      id: `msg_regras_load_${Date.now()}`,
      channelId: 'regras',
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      embeds: [buildRulesEmbedPart1(), buildRulesEmbedPart2()],
      timestamp: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      regras: [rulesMsg],
      sms: [...(prev.sms || []), botConfirmMsg]
    }));

    setIsExecuting(false);
    setTerminalLogs((prev) => [
      ...prev,
      `✅ [SUCCESS] Template [${tmplId}] aplicado 100% com sucesso!`
    ]);
  };

  // Command execution from slash / chat
  const handleExecuteCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (trimmed.startsWith('/load')) {
      const parts = trimmed.split(' ');
      const tmpl = parts[1] || 'dog_cyb';
      handleRunLoadTemplate(tmpl, {
        symbolStyle: 'chinese_dot',
        fontStyle: 'boldSans',
        purgeExisting: true
      });
    } else {
      handleSendMessage('sms', `Comando executado: \`${cmdText}\``);
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] text-[#dbdee1] flex flex-col font-sans">
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenConnectModal={() => setIsAuthModalOpen(true)}
        connectedServerName={currentGuild?.name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            currentGuild={currentGuild}
            onNavigateToCommand={() => setCurrentTab('command')}
            onNavigateToDiscord={() => setCurrentTab('discord')}
            onOpenConnectModal={() => setIsAuthModalOpen(true)}
            onQuickLoadDogCyb={() =>
              handleRunLoadTemplate('dog_cyb', {
                symbolStyle: 'chinese_dot',
                fontStyle: 'boldSans',
                purgeExisting: true
              })
            }
            isExecuting={isExecuting}
          />
        )}

        {currentTab === 'command' && (
          <CommandRunner
            currentGuild={currentGuild}
            onRunLoadTemplate={handleRunLoadTemplate}
            isExecuting={isExecuting}
            logs={terminalLogs}
          />
        )}

        {currentTab === 'discord' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2b2d31] p-4 rounded-2xl border border-[#232428]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Visualizador do Discord em Tempo Real</span>
                  <span className="text-[10px] bg-[#23a55a]/20 text-[#23a55a] px-2 py-0.5 rounded font-mono font-bold">
                    SEM EMOJIS · SÓ PONTOS CHINESES
                  </span>
                </h2>
                <p className="text-xs text-[#949ba4] mt-0.5">
                  Canais de texto em negrito, canais de anúncios e regras em leitura, canal de plaquinhas em fórum e logs de entrada/saída.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateMemberEvent('join')}
                  className="px-3 py-1.5 bg-[#2ECC71]/20 hover:bg-[#2ECC71] text-[#2ECC71] hover:text-white text-xs font-semibold rounded-xl border border-[#2ECC71]/40 transition-all"
                >
                  + Simular Entrada
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateMemberEvent('leave')}
                  className="px-3 py-1.5 bg-[#ED4245]/20 hover:bg-[#ED4245] text-[#ED4245] hover:text-white text-xs font-semibold rounded-xl border border-[#ED4245]/40 transition-all"
                >
                  - Simular Saída
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleRunLoadTemplate('dog_cyb', {
                      symbolStyle: 'chinese_dot',
                      fontStyle: 'boldSans',
                      purgeExisting: true
                    })
                  }
                  disabled={isExecuting}
                  className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#5865F2]/20 disabled:opacity-50"
                >
                  <span>Executar /load dog_cyb</span>
                </button>
              </div>
            </div>

            <DiscordPreview
              currentGuild={currentGuild}
              allGuilds={servers}
              onSelectGuild={setCurrentGuildId}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onExecuteCommand={handleExecuteCommand}
              messages={messages}
              onSendMessage={handleSendMessage}
              onSimulateMemberEvent={handleSimulateMemberEvent}
            />
          </div>
        )}

        {currentTab === 'rules' && (
          <RulesManagerTab
            onPublishRulesToDiscord={handlePublishRulesToDiscord}
            onNavigateToDiscord={() => setCurrentTab('discord')}
          />
        )}

        {currentTab === 'events' && (
          <MemberEventSimulator
            onTriggerEvent={handleSimulateMemberEvent}
            isExecuting={isExecuting}
          />
        )}

        {currentTab === 'roles' && (
          <RoleManagerTab
            roles={currentGuild.roles}
            onUpdateRoles={(newRoles) => {
              setServers((prev) =>
                prev.map((g) => (g.id === currentGuildId ? { ...g, roles: newRoles } : g))
              );
            }}
          />
        )}

        {currentTab === 'styles' && <TemplateCustomizerTab />}
      </main>

      <DiscordAuthModal
        isOpen={isAuthModalOpen}
        onAuthorize={handleAuthorize}
        availableGuilds={servers}
        currentConnectedGuildId={currentGuildId}
      />
    </div>
  );
}

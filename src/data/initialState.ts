import { DiscordGuild, DiscordMessage, DiscordChannel } from '../types/discord';
import { TEMPLATE_DOG_CYB, BOT_AVATAR, SERVER_BANNER } from './templates';

export function createServerFromTemplate(guildId: string, guildName: string, icon: string): DiscordGuild {
  const template = TEMPLATE_DOG_CYB;
  const channels: DiscordChannel[] = [];
  let pos = 0;

  for (const cat of template.categories) {
    const catId = `cat_${pos++}`;
    channels.push({
      id: catId,
      name: cat.name,
      type: 'category',
      position: pos
    });

    for (const ch of cat.channels) {
      channels.push({
        id: `ch_${pos++}`,
        name: ch.name,
        type: ch.type,
        parentId: catId,
        position: pos,
        topic: ch.topic,
        userLimit: ch.userLimit,
        readOnly: ch.readOnly
      });
    }
  }

  const roles = template.roles.map((r, i) => ({
    id: `role_${i}`,
    name: r.name,
    color: r.color,
    position: template.roles.length - i,
    permissions: r.permissions,
    hoist: r.hoist,
    mentionable: true,
    memberCount: i === 0 ? 1 : i === 1 ? 2 : i === 2 ? 3 : i === 3 ? 4 : i === 4 ? 12 : i === 5 ? 84 : 120
  }));

  return {
    id: guildId,
    name: guildName,
    icon,
    banner: SERVER_BANNER,
    ownerId: 'user_dog_dono',
    memberCount: 1482,
    onlineCount: 349,
    channels,
    roles,
    botConnected: true
  };
}

export const INITIAL_SERVERS: DiscordGuild[] = [
  createServerFromTemplate('118492049182901', '・ PANELINHA DO DOG ・', '狗'),
  {
    id: '99283748291048',
    name: '・ CYBER PANEL 2026 ・',
    icon: '电',
    banner: SERVER_BANNER,
    ownerId: 'user_master',
    memberCount: 780,
    onlineCount: 195,
    botConnected: true,
    channels: [
      { id: 'c1', name: '・ 𝗴𝗲𝗿𝗮𝗹', type: 'text', position: 1, topic: 'Conversa padrão' },
      { id: 'c2', name: '・ 𝗺𝗲𝗺𝗲𝘀', type: 'text', position: 2 },
      { id: 'c3', name: '・ 𝗰𝗮𝗹𝗹 𝟭', type: 'voice', position: 3 }
    ],
    roles: [
      { id: 'r1', name: 'DONO', color: '#FEE75C', position: 3, permissions: ['ADMINISTRATOR'], hoist: true, mentionable: true, memberCount: 1 },
      { id: 'r2', name: 'MEMBRO', color: '#BDC3C7', position: 1, permissions: [], hoist: false, mentionable: false, memberCount: 779 }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, DiscordMessage[]> = {
  regras: [
    {
      id: 'msg_regras_1',
      channelId: 'regras',
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      embeds: [
        TEMPLATE_DOG_CYB.initialMessages[0].embed,
        TEMPLATE_DOG_CYB.initialMessages[1].embed
      ],
      timestamp: 'Hoje às 04:20'
    }
  ],
  entrada: [
    {
      id: 'msg_entrada_1',
      channelId: 'entrada',
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      embeds: [
        {
          title: '🔥 BEM-VINDO, KAPETA!',
          description: 'Mais um doido entrou na panelinha! <@novato_kapeta> acabou de brotar nos portões do servidor.',
          color: '#2ECC71',
          thumbnail: {
            url: 'https://api.dicebear.com/7.x/bottts/svg?seed=novato_kapeta'
          },
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
      ],
      timestamp: 'Hoje às 10:14'
    }
  ],
  saindo: [
    {
      id: 'msg_saida_1',
      channelId: 'saindo',
      author: {
        id: 'bot_panelbot',
        name: 'PanelBot',
        avatar: BOT_AVATAR,
        bot: true,
        roleColor: '#5865F2',
        roleName: 'PANELBOT'
      },
      embeds: [
        {
          title: '💀 O FDPT SAIU!',
          description: 'O fdpt <@beta_fujão> não aguentou a pressão e vazou do servidor. Espero que o diabo coma seu cu!',
          color: '#ED4245',
          thumbnail: {
            url: 'https://api.dicebear.com/7.x/bottts/svg?seed=beta_fujao'
          },
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
        }
      ],
      timestamp: 'Hoje às 10:20'
    }
  ],
  anuncios: [
    {
      id: 'msg_anunc_1',
      channelId: 'anuncios',
      author: {
        id: 'user_dono',
        name: 'Dog_Fundador',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dono_dog',
        roleColor: '#FEE75C',
        roleName: 'DONO'
      },
      embeds: [TEMPLATE_DOG_CYB.initialMessages[3].embed],
      timestamp: 'Hoje às 08:00'
    }
  ],
  sms: [
    {
      id: 'msg_sms_1',
      channelId: 'sms',
      author: {
        id: 'user_dono',
        name: 'Dog_Fundador',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dono_dog',
        roleColor: '#FEE75C',
        roleName: 'DONO'
      },
      content: 'Servidor oficial configurado com sucesso! Nomes em negrito e apenas pontos chineses nos canais.',
      timestamp: 'Hoje às 08:30'
    },
    {
      id: 'msg_sms_2',
      channelId: 'sms',
      author: {
        id: 'user_deus',
        name: 'Zeus_Paneleiro',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zeus_panel',
        roleColor: '#9B59B6',
        roleName: 'DEUSES'
      },
      content: 'Lembrando que o canal de plaquinhas agora é fórum oficial. Vão lá abrir seus tópicos.',
      timestamp: 'Hoje às 09:12'
    }
  ]
};

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper to get Discord token (from env or header)
function getDiscordToken(req: Request): string | undefined {
  const headerToken = req.headers['x-discord-token'] as string;
  if (headerToken && headerToken.trim()) return headerToken.trim();
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'MY_DISCORD_BOT_TOKEN') {
    return process.env.DISCORD_BOT_TOKEN.trim();
  }
  return undefined;
}

// 1. Get OAuth Authorization URL
app.get('/api/discord/oauth/url', (req: Request, res: Response) => {
  const customClientId = (req.query.client_id as string) || '';
  const envClientId = process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_ID !== 'MY_DISCORD_CLIENT_ID'
    ? process.env.DISCORD_CLIENT_ID
    : '';
  const clientId = customClientId || envClientId || '118492049182901';

  let hostUrl = `${req.protocol}://${req.get('host')}`;
  if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) {
    hostUrl = process.env.APP_URL;
  }

  const clientRedirect = req.query.redirect_uri as string;
  const redirectUri = clientRedirect && clientRedirect.startsWith('http')
    ? clientRedirect
    : `${hostUrl}/auth/callback`;

  // Standard bot invite URL without redirect_uri (never fails with redirect_uri invalid)
  const botInviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

  // Full OAuth2 Code grant URL with redirect_uri
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify guilds bot applications.commands',
    permissions: '8'
  });

  res.json({
    url: `https://discord.com/oauth2/authorize?${params.toString()}`,
    botInviteUrl,
    redirectUri,
    clientId
  });
});

// OAuth Callback Route with cross-origin postMessage
app.get(['/auth/callback', '/auth/callback/'], async (req: Request, res: Response) => {
  const { code } = req.query;
  const clientId = process.env.DISCORD_CLIENT_ID || '';
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || '';

  let hostUrl = `${req.protocol}://${req.get('host')}`;
  if (process.env.APP_URL && process.env.APP_URL.startsWith('http')) {
    hostUrl = process.env.APP_URL;
  }
  const redirectUri = `${hostUrl}/auth/callback`;

  if (!code) {
    return res.send(`
      <!DOCTYPE html>
      <html><body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: 'Código de autorização não recebido.' }, '*');
            window.close();
          } else { window.location.href = '/'; }
        </script>
        <p>Erro no login.</p>
      </body></html>
    `);
  }

  try {
    const tokenRes = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || 'Falha ao trocar código OAuth2.';
      return res.send(`
        <!DOCTYPE html>
        <html>
          <body style="background:#111214;color:#dbdee1;font-family:sans-serif;padding:30px;text-align:center;">
            <h3>Aviso de Autenticação Discord</h3>
            <p>${errMsg}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errMsg)} }, '*');
                setTimeout(function() { window.close(); }, 2500);
              }
            </script>
          </body>
        </html>
      `);
    }

    // Fetch User Profile
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = userRes.ok ? await userRes.json() : null;

    // Fetch User Guilds
    const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const guildsData = guildsRes.ok ? await guildsRes.json() : [];

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Autenticado com Sucesso</title></head>
        <body style="background:#111214;color:#dbdee1;font-family:sans-serif;text-align:center;padding:40px;">
          <h2 style="color:#23a55a;">Autenticado com Sucesso!</h2>
          <p>Conectando sua conta Discord ao PanelBot...</p>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: ${JSON.stringify(userData)},
                  guilds: ${JSON.stringify(guildsData)},
                  tokens: ${JSON.stringify(tokenData)}
                }, '*');
                setTimeout(function() { window.close(); }, 600);
              } else {
                window.location.href = '/';
              }
            } catch (e) {
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    return res.send(`
      <!DOCTYPE html>
      <html><body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(err.message)} }, '*');
            window.close();
          }
        </script>
        <p>Erro: ${err.message}</p>
      </body></html>
    `);
  }
});

// Discord Slash Commands Specification
// Defines /load with option [id] (choices: dog, dog_cyb)
const SLASH_COMMANDS_SPEC = [
  {
    name: 'load',
    description: 'Carrega o template pré-configurado no servidor paneleiro',
    options: [
      {
        name: 'id',
        description: 'ID do template a ser carregado (ex: dog)',
        type: 3, // ApplicationCommandOptionType.STRING
        required: true,
        choices: [
          {
            name: 'dog - Servidor Paneleiro DOG_CYB',
            value: 'dog'
          },
          {
            name: 'dog_cyb - Template Paneleiro Completo',
            value: 'dog_cyb'
          }
        ]
      }
    ]
  }
];

// Helper to register slash commands on Discord
async function registerSlashCommands(clientId: string, token: string, targetGuildId?: string) {
  const results: { global?: boolean; guild?: boolean; error?: string } = {};

  try {
    // 1. If target guild is provided, register directly on the guild (INSTANT update in Discord, no delay!)
    if (targetGuildId && targetGuildId.trim()) {
      const guildRes = await fetch(
        `https://discord.com/api/v10/applications/${clientId}/guilds/${targetGuildId.trim()}/commands`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(SLASH_COMMANDS_SPEC)
        }
      );
      results.guild = guildRes.ok;
      if (!guildRes.ok) {
        results.error = `Guild commands error: ${guildRes.status} ${await guildRes.text()}`;
      }
    }

    // 2. Also register globally so it works anywhere
    const globalRes = await fetch(
      `https://discord.com/api/v10/applications/${clientId}/commands`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(SLASH_COMMANDS_SPEC)
      }
    );
    results.global = globalRes.ok;
    return results;
  } catch (err: any) {
    return { error: err.message };
  }
}

// Check Discord Bot Configuration & auto-detect
app.get('/api/discord/config', async (req: Request, res: Response) => {
  dotenv.config(); // Reload any fresh env updates
  const token = getDiscordToken(req);
  const rawClientId = process.env.DISCORD_CLIENT_ID || '';
  const clientId = rawClientId !== 'MY_DISCORD_CLIENT_ID' ? rawClientId.trim() : '';
  const rawGuildId = process.env.DISCORD_GUILD_ID || '';
  const guildId = rawGuildId !== 'MY_DISCORD_GUILD_ID' ? rawGuildId.trim() : '';
  const hasSecret = Boolean(process.env.DISCORD_CLIENT_SECRET && process.env.DISCORD_CLIENT_SECRET !== 'MY_DISCORD_CLIENT_SECRET');

  if (!token) {
    return res.json({
      configured: false,
      hasToken: false,
      hasSecret,
      clientId,
      guildId,
      message: 'Token não configurado.'
    });
  }

  try {
    const discordRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bot ${token}`
      }
    });

    if (!discordRes.ok) {
      return res.json({
        configured: false,
        hasToken: true,
        hasSecret,
        error: `Discord API erro: ${discordRes.statusText}`,
        clientId,
        guildId
      });
    }

    const botUser = await discordRes.json();
    const effectiveClientId = clientId || botUser.id;

    // Auto-register slash commands if guildId or clientId is known
    if (effectiveClientId && (guildId || token)) {
      registerSlashCommands(effectiveClientId, token, guildId).catch(() => {});
    }

    return res.json({
      configured: true,
      hasToken: true,
      hasSecret,
      botUser,
      clientId: effectiveClientId,
      guildId,
      commands: SLASH_COMMANDS_SPEC,
      inviteUrl: `https://discord.com/oauth2/authorize?client_id=${effectiveClientId}&permissions=8&scope=bot%20applications.commands`
    });
  } catch (err: any) {
    return res.json({
      configured: false,
      hasToken: true,
      hasSecret,
      error: err.message,
      clientId,
      guildId
    });
  }
});

// Endpoint: Register Slash Commands on Discord API (/load [id]:dog)
app.post('/api/discord/commands/register', async (req: Request, res: Response) => {
  dotenv.config();
  const token = getDiscordToken(req);
  const bodyGuildId = req.body.guildId;
  const envGuildId = process.env.DISCORD_GUILD_ID !== 'MY_DISCORD_GUILD_ID' ? process.env.DISCORD_GUILD_ID : '';
  const targetGuildId = (bodyGuildId || envGuildId || '').trim();

  const bodyClientId = req.body.clientId;
  const envClientId = process.env.DISCORD_CLIENT_ID !== 'MY_DISCORD_CLIENT_ID' ? process.env.DISCORD_CLIENT_ID : '';
  let clientId = (bodyClientId || envClientId || '').trim();

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'DISCORD_BOT_TOKEN não configurado no .env ou cabeçalho.'
    });
  }

  try {
    // If clientId is missing, resolve it from the bot token
    if (!clientId) {
      const meRes = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bot ${token}` }
      });
      if (meRes.ok) {
        const me = await meRes.json();
        clientId = me.id;
      }
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'DISCORD_CLIENT_ID (Application ID) não pôde ser determinado.'
      });
    }

    const regResult = await registerSlashCommands(clientId, token, targetGuildId);

    return res.json({
      success: true,
      message: `Comando slash /load [id]:dog registrado com sucesso no Discord!`,
      clientId,
      guildId: targetGuildId,
      commands: SLASH_COMMANDS_SPEC,
      status: regResult
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint: Fetch all Registered Guilds for the Bot from Discord API
app.get('/api/discord/guilds', async (req: Request, res: Response) => {
  dotenv.config();
  const token = getDiscordToken(req);
  const envGuildId = process.env.DISCORD_GUILD_ID !== 'MY_DISCORD_GUILD_ID' ? process.env.DISCORD_GUILD_ID : '';
  const requestedGuildId = (req.query.guild_id as string) || envGuildId;

  if (!token) {
    return res.json({
      configured: false,
      guilds: [],
      message: 'Token de bot não configurado no .env'
    });
  }

  try {
    // 1. Fetch guilds list where the bot is installed
    const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bot ${token}` }
    });

    let guildsList: any[] = [];
    if (guildsRes.ok) {
      guildsList = await guildsRes.json();
    }

    // 2. If a specific guild ID was configured or requested, make sure it is in the list
    if (requestedGuildId && !guildsList.some((g) => g.id === requestedGuildId)) {
      try {
        const specificRes = await fetch(`https://discord.com/api/v10/guilds/${requestedGuildId}?with_counts=true`, {
          headers: { Authorization: `Bot ${token}` }
        });
        if (specificRes.ok) {
          const specificData = await specificRes.json();
          guildsList.unshift(specificData);
        }
      } catch (e) {
        // non-blocking
      }
    }

    // 3. For the active/configured guild, fetch channels and roles if possible
    const enrichedGuilds = await Promise.all(
      guildsList.map(async (g) => {
        const isCurrent = g.id === requestedGuildId;
        let channels: any[] = [];
        let roles: any[] = [];

        if (isCurrent) {
          try {
            const [cRes, rRes] = await Promise.all([
              fetch(`https://discord.com/api/v10/guilds/${g.id}/channels`, {
                headers: { Authorization: `Bot ${token}` }
              }),
              fetch(`https://discord.com/api/v10/guilds/${g.id}/roles`, {
                headers: { Authorization: `Bot ${token}` }
              })
            ]);
            if (cRes.ok) channels = await cRes.json();
            if (rRes.ok) roles = await rRes.json();
          } catch (e) {
            // ignore
          }
        }

        return {
          id: g.id,
          name: g.name,
          icon: g.icon
            ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
            : g.name.substring(0, 2).toUpperCase(),
          banner: g.banner ? `https://cdn.discordapp.com/banners/${g.id}/${g.banner}.png` : undefined,
          ownerId: g.owner_id || '',
          memberCount: g.approximate_member_count || 1,
          onlineCount: g.approximate_presence_count || 1,
          botConnected: true,
          isConfiguredFromEnv: g.id === envGuildId,
          channels: channels.length > 0 ? channels.map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type === 4 ? 'category' : c.type === 2 ? 'voice' : c.type === 5 ? 'announcement' : c.type === 15 ? 'forum' : 'text',
            parentId: c.parent_id,
            position: c.position,
            topic: c.topic,
            userLimit: c.user_limit,
            readOnly: c.type === 5 || c.name.includes('regras') || c.name.includes('anuncios')
          })) : undefined,
          roles: roles.length > 0 ? roles.map((r: any) => ({
            id: r.id,
            name: r.name,
            color: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#99aab5',
            position: r.position,
            permissions: [String(r.permissions)],
            hoist: r.hoist,
            mentionable: r.mentionable,
            memberCount: 0
          })) : undefined
        };
      })
    );

    return res.json({
      configured: true,
      guilds: enrichedGuilds,
      activeGuildId: requestedGuildId,
      botTokenPresent: true
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: Discord Interactions Webhook (handles /load command from real Discord)
app.post('/api/discord/interactions', async (req: Request, res: Response) => {
  const { type, data, guild_id } = req.body;

  // Discord PING verification
  if (type === 1) {
    return res.json({ type: 1 });
  }

  // Application Command (/load)
  if (type === 2 && data?.name === 'load') {
    const idOption = data.options?.find((o: any) => o.name === 'id')?.value || 'dog';
    return res.json({
      type: 4, // Respond with message
      data: {
        content: `🚀 **[PanelBot]** Protocolo \`/load [id]:${idOption}\` iniciado no servidor! Reestruturando canais sem emojis e enviando as 30 Regras Oficiais em ・ 𝗿𝗲𝗴𝗿𝗮𝘀...`
      }
    });
  }

  return res.json({ type: 4, data: { content: 'Comando processado com sucesso.' } });
});

// 2. Fetch Guild Channels & Roles from Discord REST API
app.get('/api/discord/guild/:guildId', async (req: Request, res: Response) => {
  const token = getDiscordToken(req);
  const { guildId } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'DISCORD_BOT_TOKEN não informado.' });
  }

  try {
    const [channelsRes, rolesRes, guildRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${token}` }
      }),
      fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${token}` }
      }),
      fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
        headers: { Authorization: `Bot ${token}` }
      })
    ]);

    if (!guildRes.ok) {
      const errBody = await guildRes.text();
      return res.status(guildRes.status).json({ error: 'Erro ao buscar servidor no Discord', details: errBody });
    }

    const channels = await channelsRes.json();
    const roles = await rolesRes.json();
    const guild = await guildRes.json();

    return res.json({ guild, channels, roles });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Execute /load dog_cyb Template on Discord Guild via REST API
app.post('/api/discord/load-dog-cyb', async (req: Request, res: Response) => {
  const token = getDiscordToken(req);
  const { guildId, purgeExisting = true } = req.body;

  if (!token || !guildId) {
    // If no real token or guild, return simulated success with live structure
    return res.json({
      success: true,
      mode: 'simulation',
      message: 'Template dog_cyb processado com sucesso no simulador.',
      createdCount: 15
    });
  }

  try {
    const logs: string[] = [];

    // Step A: Purge channels if requested
    if (purgeExisting) {
      const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${token}` }
      });

      if (channelsRes.ok) {
        const channels = await channelsRes.json();
        logs.push(`Purgando ${channels.length} canais existentes...`);
        for (const ch of channels) {
          try {
            await fetch(`https://discord.com/api/v10/channels/${ch.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bot ${token}` }
            });
          } catch (e) {
            // ignore individual channel delete errors
          }
        }
      }
    }

    // Step B: Create Category 1: ・ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 ・
    const catInfoRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '・ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 ・',
        type: 4 // Guild Category
      })
    });
    const catInfo = await catInfoRes.json();

    // Create Text Channels in Category 1
    // 1. ・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮
    await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮',
        type: 0,
        parent_id: catInfo.id,
        topic: 'Boas-vindas: Bem-vindo, kapeta!'
      })
    });

    // 2. ・ 𝘀𝗮𝗶𝗻𝗱𝗼
    await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '・ 𝘀𝗮𝗶𝗻𝗱𝗼',
        type: 0,
        parent_id: catInfo.id,
        topic: 'Saídas: O fdpt saiu, espero que o diabo coma seu cu!'
      })
    });

    // 3. ・ 𝗿𝗲𝗴𝗿𝗮𝘀
    const regrasRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '・ 𝗿𝗲𝗴𝗿𝗮𝘀',
        type: 0,
        parent_id: catInfo.id,
        topic: 'Regras da casa em embed. Apenas leitura. Não alimente o macaco.'
      })
    });
    const regrasChannel = await regrasRes.json();

    // 4. ・ 𝗮𝗻𝘂𝗻𝗰𝗶𝗼𝘀 (type: 5 Announcement Channel)
    await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '・ 𝗮𝗻𝘂𝗻𝗰𝗶𝗼𝘀',
        type: 5, // Guild Announcement
        parent_id: catInfo.id,
        topic: 'Canal oficial de avisos e comunicados da administração.'
      })
    });

    // 5. ・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀 (type: 15 Forum Channel)
    await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀',
        type: 15, // Guild Forum
        parent_id: catInfo.id,
        topic: 'Canal de Fórum para pedidos e resgate de plaquinhas.'
      })
    });

    // Step C: Create Category 2: ・ 𝐂𝐇𝐀𝐓 𝐆𝐄𝐑𝐀𝐋 ・
    const catChatRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '・ 𝐂𝐇𝐀𝐓 𝐆𝐄𝐑𝐀𝐋 ・', type: 4 })
    });
    const catChat = await catChatRes.json();

    const textChannels = ['・ 𝘀𝗺𝘀', '・ 𝗺𝗶𝗱𝗶𝗮𝘀', '・ 𝗯𝘂𝘀𝗰𝗮𝗿-𝗶𝗽', '・ 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀', '・ 𝗱𝗶𝘃𝘂𝗹𝗴𝗮𝗰𝗮𝗼'];
    for (const name of textChannels) {
      await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        method: 'POST',
        headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type: 0, parent_id: catChat.id })
      });
    }

    // Step D: Create Category 3: ・ 𝐕𝐎𝐙 & 𝐂𝐀𝐋𝐋𝐒 ・
    const catVoiceRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '・ 𝐕𝐎𝐙 & 𝐂𝐀𝐋𝐋𝐒 ・', type: 4 })
    });
    const catVoice = await catVoiceRes.json();

    const voiceChannels = [
      { name: '・ 𝗱𝘂𝗼 𝟭', limit: 2 },
      { name: '・ 𝗱𝘂𝗼 𝟮', limit: 2 },
      { name: '・ 𝗰𝗮𝗹𝗹 𝟭' },
      { name: '・ 𝗰𝗮𝗹𝗹 𝟮' },
      { name: '・ 𝗴𝗳 𝟭', limit: 2 },
      { name: '・ 𝗴𝗳 𝟮', limit: 2 },
      { name: '・ 𝗺𝘂𝘀𝗶𝗰𝗮 𝟭' },
      { name: '・ 𝗺𝘂𝘀𝗶𝗰𝗮 𝟮' },
      { name: '・ 𝗮𝗳𝗸 𝟭' },
      { name: '・ 𝗮𝗳𝗸 𝟮' }
    ];
    for (const vc of voiceChannels) {
      await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        method: 'POST',
        headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vc.name,
          type: 2, // Voice
          parent_id: catVoice.id,
          user_limit: vc.limit || 0
        })
      });
    }

    // Step E: Post funny rules embed in #regras
    if (regrasChannel?.id) {
      await fetch(`https://discord.com/api/v10/channels/${regrasChannel.id}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: '📜 CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 1/2',
              description: 'Regulamento oficial do covil. Siga rigorosamente para evitar rebaixamento imediato a Beta ou deportação para o AFK.',
              color: 0x5865f2,
              fields: [
                { name: '1. NÃO ALIMENTE O MACACO', value: 'Sob hipótese alguma dê moral para o primata que ficar spammando no chat ou chamando no privado. Ele se descontrola após as 22h, rói os cabos de rede e começa a pingar @everyone sem motivo.\n*⚖️ Punição: Confinamento em sala AFK com áudio desabilitado.*' },
                { name: '2. NÃO FAÇA SOPA ÀS 2 DA MANHÃ', value: 'O som da panela de pressão tremendo no microfone estourado acorda o Sub Dono e desestabiliza a call dos Deuses. Quem esquentar caldo de madrugada toma mute de 48 horas.\n*⚖️ Punição: Mute de 48h sem direito a fiança.*' },
                { name: '3. RESPEITE A HIERARQUIA DE ALFAS E DEUSES', value: 'Se um Dono, Sub Dono ou Deus entrar na sala, abaixe o volume do seu microfone. Proibido gemer no microfone sem autorização formal e autenticada em cartório por um Alfa.\n*⚖️ Punição: Rebaixamento sumário a Beta.*' },
                { name: '4. COLOQUE SUA PLAQUINHA NO FÓRUM', value: 'Acesse o fórum ・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀 e crie seu tópico. Membro sem plaquinha é espião infiltrado e perde a cidadania no chat geral.\n*⚖️ Punição: Proibido de mandar memes até regularizar.*' },
                { name: '5. BUSCAR IP NO CANAL CORRETO', value: 'Toda consulta de zoeira, puxada de CEP da tia ou dox fake deve ser feita no canal ・ 𝗯𝘂𝘀𝗰𝗮𝗿-𝗶𝗽. Proibido poluir a SMS com coordenadas de Xique-Xique.\n*⚖️ Punição: Limpeza manual do histórico do bot.*' },
                { name: '6. CANAIS DE GF MONITORADOS', value: 'Quem entrar nas calls GF 1 ou GF 2 para webnamorar tem que pagar taxa moral para a moderação sob pena de ser arremessado para o AFK 2.\n*⚖️ Punição: Puxão para a call geral para cantar hino nacional.*' },
                { name: '7. PROIBIDO FALAR DE CLT E TRABALHO', value: 'Este é um recinto sagrado de shitpost. Não venha deprimir os manos com cálculo de FGTS, escala 6x1 ou desconto de INSS em pleno sábado à noite.\n*⚖️ Punição: Proibição de falar sobre boletos por 7 dias.*' },
                { name: '8. EXPOSED SOMENTE EM POWERPOINT', value: 'Dox e exposed de baixa qualidade feitos em bloco de notas serão cancelados. Exija-se apresentação formal com slides, transição Estrela e gráfico de pizza.\n*⚖️ Punição: Exposed rejeitado por descumprir normas ABNT.*' },
                { name: '9. RESPEITE OS DEUSES, ELES NÃO DORMEM', value: 'A administração sobrevive à base de energético barato e rancor. Não marque o Dono ou Deuses para besteira se não quiser tomar banho de kick.\n*⚖️ Punição: Kick relâmpago educativo.*' },
                { name: '10. NÃO PEÇA CARGO DE MODERADOR', value: 'Ficar pedindo cargo no privado da staff é o caminho mais rápido para ganhar o cargo honorário de Faxineiro da Call no canal AFK.\n*⚖️ Punição: Cargo "Mendigo de Permissão".*' },
                { name: '11. PROIBIDO GEMIDÃO NO BOT DE MÚSICA', value: 'O canal de música é patrimônio da comunidade. Quem botar funk estourado em 400% de ganho ou áudio do gemidão terá o fone confiscado moralmente.\n*⚖️ Punição: Mute perpétuo no canal de música.*' },
                { name: '12. SE BEBER, NÃO ABRA O ・ 𝗺𝗶𝗱𝗶𝗮𝘀', value: 'Fotos vergonhosas enviadas sob efeito de substâncias duvidosas serão imortalizadas nos arquivos dos Deuses e usadas como chantagem em votações futuras.\n*⚖️ Punição: Foto fixada no mural da vergonha.*' },
                { name: '13. PROIBIDO CHORAR POR DERROTA NO DUO', value: 'Se você puxou duo no canal ・ 𝗱𝘂𝗼 𝟭 e perdeu o elo, resolva na mão limpa. Proibido abrir votação de impeachment do parceiro no chat geral.\n*⚖️ Punição: Obrigado a jogar a próxima de suporte calado.*' },
                { name: '14. O SUB DONO NUNCA ESTÁ ERRADO', value: 'Caso o Sub Dono esteja visivelmente equivocado, consulte a regra 9 e finja demência. A sobrevivência na panelinha depende da sua concordância.\n*⚖️ Punição: Debate inútil que resulta em mute.*' },
                { name: '15. SE FOR CAIR DA CALL, CAIA COM HONRA', value: 'Proibido sumir no meio da discussão dizendo que a internet caiu. Se for puxar o cabo da tomada, assuma publicamente na SMS que amarelou.\n*⚖️ Punição: Cargo "Cabo Puxado na Tomada".*' }
              ],
              footer: { text: 'PanelBot Security Protocol • Parte 1 de 2 • dog_cyb' }
            },
            {
              title: '⚡ CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 2/2',
              description: 'Diretrizes complementares de voz, shitpost, microfones e segurança de sobrevivência na panelinha.',
              color: 0x9b59b6,
              fields: [
                { name: '16. MICROFONE DE PASTELARIA É CRIME HEDIONDO', value: 'Entrar em call com microfone que chia igual óleo fervendo ou secador de cabelo ligado vai te mandar direto pro ・ 𝗮𝗳𝗸 𝟮 com o cargo de Turbina Humana.\n*⚖️ Punição: Mute até comprar um fone de 15 reais.*' },
                { name: '17. PROIBIDO PEDIR PIX DE 1 REAL NO CHAT', value: 'Ficar mandando chave aleatória pedindo trocado pra inteirar pastel ou refrigerante é humilhação pública. Pedintes serão tributados em 90% pelos Deuses.\n*⚖️ Punição: Obrigação de mandar comprovante de CLT.*' },
                { name: '18. PROIBIDO SALGADINHO CROCANTE DE MIC ABERTO', value: 'Mastigar Doritos, Fandangos, torresmo ou pipoca com a sensibilidade do microfone em 100% renderá banimento sensorial por poluição acústica.\n*⚖️ Punição: Desconectado com aviso de mastigação nociva.*' },
                { name: '19. ÁUDIOS DE MAIS DE 15s EXIGEM RESUMO', value: 'Se você mandou áudio contando o drama da sua vida, anexe um sumário executivo em 3 tópicos. Ninguém aqui é psicólogo concursado.\n*⚖️ Punição: Áudio solenemente ignorado.*' },
                { name: '20. NÃO ESQUENTE PEIXE NO MICROONDAS VIRTUAL', value: 'Não venha pro chat com brigas requentadas de meses atrás sobre anime ou joguinho. Passou de 48 horas, o assunto prescreveu sumariamente.\n*⚖️ Punição: Mute de 6 horas para esfriar a cabeça.*' },
                { name: '21. PROIBIDO DORMIR NA CALL RONCANDO', value: 'Deixar o fone ligado roncando feito um motor de geladeira antiga vai te teletransportar pro ・ 𝗮𝗳𝗸 𝟭 com o apelido alterado para "Trator 2000".\n*⚖️ Punição: Desconectado e apelido trocado pela staff.*' },
                { name: '22. PROIBIDO TRAVAR O XIAOMI DOS BETAS COM FIGURINHA', value: 'Mandar 40 figurinhas pesadas em sequência até reiniciar o celular humilde dos novatos renderá advertência expressa por sabotagem de hardware.\n*⚖️ Punição: Modo lento de 120 segundos aplicado.*' },
                { name: '23. NÃO PAGUE DE INTELECTUAL NO MEIO DO SHITPOST', value: 'Ninguém quer citação em latim enquanto o macaco estiver solto. Guarde o vocabulário rebuscado para o LinkedIn.\n*⚖️ Punição: Spam de figurinha de macaco em todas as mensagens.*' },
                { name: '24. POLÍTICA OU FUTEBOL COM ÁLCOOL NO SANGUE = BAN', value: 'Debater eleição ou futebol às 4 da manhã com duas garrafas de corote na mente sempre termina em tragédia. Preserve a harmonia.\n*⚖️ Punição: Mute até passar o efeito e a vergonha.*' },
                { name: '25. PINGAR @EVERYONE SÓ SE O MUNDO ACABAR', value: 'Usar @everyone sem permissão dos Deuses só é aceito se meteoros estiverem caindo no telhado da sua residência. Do contrário, banimento relâmpago.\n*⚖️ Punição: Banimento com passagem só de ida.*' },
                { name: '26. O CANAL ・ 𝗮𝗻𝘂𝗻𝗰𝗶𝗼𝘀 É DECRETO LEI', value: 'Quando a administração postar algo nos anúncios, não venha na SMS perguntar "é sério?". Se está nos anúncios, virou lei constitucional.\n*⚖️ Punição: Aplicação imediata do decreto contestado.*' },
                { name: '27. PROIBIDO FLERTAR COM O PANELBOT', value: 'O bot é uma inteligência artificial militar focada na estabilidade do covil. Mandar cantada pro robô ativará o protocolo de autodestruição da sua honra.\n*⚖️ Punição: Resposta sarcástica pública no meio do chat.*' },
                { name: '28. SE O ASSUNTO FOR SECRETO, VÁ PRO PRIVADO', value: 'Ficar no chat geral com mistério e fofoca pela metade é proibido. Ou conta a história toda na SMS ou vai pro privado sussurrar.\n*⚖️ Punição: Obrigação moral de explanar o babado para todos.*' },
                { name: '29. RESPEITE OS BETAS, SEM ELES NÃO HÁ AUDIÊNCIA', value: 'Não humilhe os novatos em excesso. Sem eles para tomar kick e servir de plateia, a panelinha não tem propósito existencial.\n*⚖️ Punição: Rebaixado temporariamente a Beta para sentir na pele.*' },
                { name: '30. O QUE ACONTECE NA PANELINHA FICA NA PANELINHA', value: 'Printar conversa para mandar no Twitter ou em servidores rivais é alta traição diplomática. O traidor terá sua foto transformada em meme vitalício.\n*⚖️ Punição: Banimento perpétuo e exposição no canal de fórum.*' }
              ],
              footer: { text: 'PanelBot Security Protocol • Parte 2 de 2 • dog_cyb' }
            }
          ]
        })
      });
    }

    return res.json({
      success: true,
      mode: 'real',
      message: 'Template dog_cyb aplicado diretamente na API do Discord com sucesso!',
      logs
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Member Join / Leave Webhook Simulator
app.post('/api/discord/member-event', async (req: Request, res: Response) => {
  const { type, username, avatarUrl, channelId } = req.body;
  const token = getDiscordToken(req);

  const isJoin = type === 'join';
  const name = username || (isJoin ? 'Kapeta_Novato' : 'Beta_Fujao');
  const avatar =
    avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

  const embed = isJoin
    ? {
        title: '🔥 BEM-VINDO, KAPETA!',
        description: `Mais um doido entrou na panelinha! <@${name}> brotou no servidor.`,
        color: 0x2ecc71,
        thumbnail: { url: avatar },
        fields: [
          { name: 'Regras da Casa', value: 'Vá agora em <#regras> ler o regulamento antes de fazer besteira.', inline: true },
          { name: 'Plaquinhas', value: 'Faça seu pedido no fórum <#plaquinhas>.', inline: true },
          { name: 'Bate-papo', value: 'Converse no canal <#sms>.', inline: true }
        ],
        footer: { text: 'PanelBot Welcome System • Sistema de Entrada Ativo' }
      }
    : {
        title: '💀 O FDPT SAIU!',
        description: `O fdpt <@${name}> não aguentou a pressão e vazou do servidor. Espero que o diabo coma seu cu!`,
        color: 0xed4245,
        thumbnail: { url: avatar },
        fields: [
          { name: 'Destino do Fraco', value: 'Menos um peso morto pra puxar a call pra baixo. Foi pra vala dos betas.' }
        ],
        footer: { text: 'PanelBot Leave Logger • Menos um membro' }
      };

  // If real channelId and bot token are provided, send to real Discord channel
  if (token && channelId) {
    try {
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ embeds: [embed] })
      });
    } catch (e) {
      // non-blocking
    }
  }

  return res.json({
    success: true,
    event: type,
    embed,
    username: name,
    avatar
  });
});

// Vite Middleware for SPA development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PanelBot Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

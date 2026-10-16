import { TemplateDefinition } from '../types/discord';

export const BOT_AVATAR = '/src/assets/images/panelbot_avatar_1792173305348.jpg';
export const SERVER_BANNER = '/src/assets/images/server_banner_paneleiro_1792173304978.jpg';

// Unicode bold sans converter for Discord channel styling (Mathematical Sans-Bold)
export function toUnicodeBoldSans(text: string): string {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
  const bold = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵-';
  
  let result = '';
  for (const char of text) {
    const idx = Array.from(normal).indexOf(char);
    if (idx !== -1) {
      result += Array.from(bold)[idx];
    } else {
      result += char;
    }
  }
  return result;
}

export function toUnicodeBoldSerif(text: string): string {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
  const bold = '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗-';
  
  let result = '';
  for (const char of text) {
    const idx = Array.from(normal).indexOf(char);
    if (idx !== -1) {
      result += Array.from(bold)[idx];
    } else {
      result += char;
    }
  }
  return result;
}

export function toSmallCaps(text: string): string {
  const map: Record<string, string> = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
    k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ',
    u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ', '0': '₀', '1': '₁', '2': '₂',
    '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '-': '-'
  };
  return text.toLowerCase().split('').map(c => map[c] || c).join('');
}

// Preset Chinese symbols - strictly NO EMOJIS, only chinese dots and typographic markers
export const SYMBOL_PRESETS = [
  { id: 'chinese_dot', label: '・ (Ponto Chinês Tradicional)', prefix: '・ ' },
  { id: 'zen_dash', label: '々・ (Ideograma Zen)', prefix: '々・ ' },
  { id: 'double_pipe', label: '〢・ (Barra Dupla)', prefix: '〢・ ' },
  { id: 'chevron', label: '» (Chevron)', prefix: '» ' },
  { id: 'dot_classic', label: '• (Ponto Clássico)', prefix: '• ' }
];

// 30 Official Paneleiro Rules with hilarious lore and punishments
export interface PaneleiroRule {
  id: number;
  category: 'convivencia' | 'hierarquia' | 'calls' | 'shitpost' | 'seguranca';
  categoryLabel: string;
  title: string;
  description: string;
  punishment: string;
}

export const PANELEIRO_RULES_LIST: PaneleiroRule[] = [
  {
    id: 1,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '1. NÃO ALIMENTE O MACACO',
    description: 'Sob hipótese alguma dê moral para o primata que ficar spammando no chat ou chamando no privado. Ele se descontrola após as 22h, rói os cabos de rede e começa a pingar @everyone sem motivo.',
    punishment: 'Confinamento em sala AFK com áudio desabilitado e banho de gelo moral.'
  },
  {
    id: 2,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '2. NÃO FAÇA SOPA ÀS 2 DA MANHÃ',
    description: 'O som da panela de pressão tremendo no microfone estourado acorda o Sub Dono e desestabiliza a call dos Deuses. Quem for pego esquentando caldo de mocotó de madrugada toma mute instantâneo de 48 horas.',
    punishment: 'Mute de 48 horas sem direito a fiança ou recurso.'
  },
  {
    id: 3,
    category: 'hierarquia',
    categoryLabel: 'Hierarquia & Poder',
    title: '3. RESPEITE A HIERARQUIA DE ALFAS E DEUSES',
    description: 'Se um Dono, Sub Dono ou Deus entrar na sala, abaixe a cabeça e o volume do seu microfone. Proibido gemer no microfone sem autorização formal e autenticada em cartório por um Alfa.',
    punishment: 'Rebaixamento sumário a Beta e perda de prioridade de fala.'
  },
  {
    id: 4,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '4. COLOQUE SUA PLAQUINHA NO FÓRUM',
    description: 'Acesse o canal de fórum ・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀 e crie seu tópico de solicitação. Membro sem plaquinha é tratado como espião infiltrado e perde a cidadania no chat geral.',
    punishment: 'Perda do direito de mandar memes até regularizar a situação.'
  },
  {
    id: 5,
    category: 'seguranca',
    categoryLabel: 'Segurança & Dox',
    title: '5. BUSCAR IP SOMENTE NO CANAL CORRETO',
    description: 'Toda consulta de zoeira, puxada de CEP da tia ou dox fake deve ser feita estritamente no canal ・ 𝗯𝘂𝘀𝗰𝗮𝗿-𝗶𝗽. Proibido poluir a SMS com coordenadas de satélite de Xique-Xique.',
    punishment: 'Limpeza manual compulsória do histórico do bot.'
  },
  {
    id: 6,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '6. CANAIS DE GF SÃO MONITORADOS PELA RECEITA MORAL',
    description: 'Quem entrar nas calls GF 1 ou GF 2 para webnamorar tem que pagar taxa moral para a moderação. Proibido declaração de amor melosa sob pena de ser arremessado imediatamente para o AFK 2.',
    punishment: 'Teletransporte para call geral para cantar o hino nacional à capela.'
  },
  {
    id: 7,
    category: 'shitpost',
    categoryLabel: 'Shitpost & Zueira',
    title: '7. PROIBIDO FALAR DE CLT E TRABALHO',
    description: 'Este é um recinto sagrado de shitpost e resenha 24/7. Não deprima os manos com cálculo de FGTS, escala 6x1 ou desconto de INSS em pleno sábado à noite.',
    punishment: 'Proibição de falar sobre boletos e carteira assinada por 7 dias.'
  },
  {
    id: 8,
    category: 'seguranca',
    categoryLabel: 'Segurança & Dox',
    title: '8. SE FOR EXPOR ALGUÉM, EXIGE-SE POWERPOINT',
    description: 'Dox e exposed de baixa qualidade feitos em bloco de notas serão apagados sumariamente. Se for explanar a fofoca de alguém, exija-se apresentação formal com slides, transição Estrela e gráfico de pizza.',
    punishment: 'Exposed cancelado por não atender às normas da ABNT.'
  },
  {
    id: 9,
    category: 'hierarquia',
    categoryLabel: 'Hierarquia & Poder',
    title: '9. RESPEITE OS DEUSES, ELES NÃO DORMEM HÁ 4 DIAS',
    description: 'A administração sobrevive à base de energético barato e rancor acumulado. Não marque o Dono ou Deuses para perguntar besteira se não quiser tomar banho de kick sem aviso prévio.',
    punishment: 'Kick relâmpago para aprender a ter bom senso.'
  },
  {
    id: 10,
    category: 'hierarquia',
    categoryLabel: 'Hierarquia & Poder',
    title: '10. NÃO PEÇA CARGO DE MODERADOR',
    description: 'Ficar pedindo cargo no privado da staff é o caminho mais rápido para ganhar o cargo honorário de Faxineiro da Call no canal AFK.',
    punishment: 'Atribuição perpétua do cargo humorístico "Mendigo de Permissão".'
  },
  {
    id: 11,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '11. PROIBIDO TOCAR GEMIDÃO NO BOT DE MÚSICA',
    description: 'O canal de música é patrimônio da comunidade. Quem botar funk estourado em 400% de ganho ou áudio do gemidão vai ter o fone confiscado moralmente.',
    punishment: 'Mute perpétuo no canal de música e cancelamento de fila.'
  },
  {
    id: 12,
    category: 'shitpost',
    categoryLabel: 'Shitpost & Zueira',
    title: '12. SE BEBER, NÃO ABRA O CANAL ・ 𝗺𝗶𝗱𝗶𝗮𝘀',
    description: 'Fotos vergonhosas enviadas sob efeito de substâncias duvidosas serão imortalizadas nos arquivos dos Deuses e usadas como chantagem em votações futuras.',
    punishment: 'Foto fixada no mural da vergonha da administração.'
  },
  {
    id: 13,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '13. PROIBIDO CHORAR POR DERROTA NO DUO',
    description: 'Se você puxou duo no canal ・ 𝗱𝘂𝗼 𝟭 e perdeu o elo, resolva na mão limpa. Proibido abrir votação de impeachment do parceiro no chat geral ou abrir berreiro no microfone.',
    punishment: 'Obrigado a jogar a próxima partida de boneco suporte calado.'
  },
  {
    id: 14,
    category: 'hierarquia',
    categoryLabel: 'Hierarquia & Poder',
    title: '14. O SUB DONO NUNCA ESTÁ ERRADO',
    description: 'Caso o Sub Dono esteja visivelmente equivocado, consulte a regra 9 e finja demência. A sobrevivência na panelinha depende da sua capacidade de concordar com absurdos.',
    punishment: 'Debate inútil que resulta em 24h de confinamento.'
  },
  {
    id: 15,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '15. SE FOR CAIR DA CALL, CAIA COM HONRA',
    description: 'Proibido sumir no meio da discussão dizendo que a internet caiu. Se for puxar o cabo da tomada, assuma publicamente no canal ・ 𝘀𝗺𝘀 que tomou pavor e arregou.',
    punishment: 'Ganho do cargo humilhante "Cabo Puxado na Tomada".'
  },
  {
    id: 16,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '16. MICROFONE DE PASTELARIA É CRIME HEDIONDO',
    description: 'Entrar em call com microfone que chia igual óleo fervendo, vento batendo na janela ou cachorro latindo na orelha da galera resultará em deportação imediata pro ・ 𝗮𝗳𝗸 𝟮.',
    punishment: 'Mute de servidor até comprar um fone de 15 reais na feira.'
  },
  {
    id: 17,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '17. PROIBIDO PEDIR PIX DE 1 REAL NO CHAT',
    description: 'Ficar mandando chave aleatória mendigando trocado pra inteirar o pastel, cigarro ou coca-cola é falta grave de decoro. Pedintes serão tributados em 90% pela tesouraria dos Deuses.',
    punishment: 'Obrigação moral de apresentar comprovante de carteira de trabalho.'
  },
  {
    id: 18,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '18. PROIBIDO COMER SALGADINHO CROCANTE DE MIC ABERTO',
    description: 'Triturar Doritos, Fandangos, torresmo ou pipoca com a sensibilidade do microfone em 100% é terrorismo sonoro contra o tímpano dos membros.',
    punishment: 'Desconexão forçada com aviso de poluição acústica.'
  },
  {
    id: 19,
    category: 'shitpost',
    categoryLabel: 'Shitpost & Zueira',
    title: '19. AUDIOS DE MAIS DE 15 SEGUNDOS EXIGEM RESUMO EXECUTIVO',
    description: 'Se você gravou um podcast contando seu drama existencial, anexe um sumário em tópicos. O canal ・ 𝘀𝗺𝘀 é dinâmico e ninguém aqui é psicólogo com registro no CRP.',
    punishment: 'Áudio solenemente ignorado e classificado como ruído branco.'
  },
  {
    id: 20,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '20. NÃO ESQUENTE PEIXE NO MICROONDAS VIRTUAL',
    description: 'Não traga discussões requentadas do mês passado ou picuinhas mortas de 2022 sobre anime ou joguinho. Assunto com mais de 48 horas prescreveu sumariamente.',
    punishment: 'Mute preventivo de 6 horas para esfriar os miolos.'
  },
  {
    id: 21,
    category: 'calls',
    categoryLabel: 'Calls & Voz',
    title: '21. PROIBIDO DORMIR NA CALL RONCANDO',
    description: 'Dormir de mic aberto roncando que nem um caminhão Scania desregulado vai te render teletransporte direto para o canal ・ 𝗮𝗳𝗸 𝟭 com apelido trocado para "Trator 2000".',
    punishment: 'Desconectado da sala e apelido alterado pela administração.'
  },
  {
    id: 22,
    category: 'shitpost',
    categoryLabel: 'Shitpost & Zueira',
    title: '22. PROIBIDO TRAVAR O XIAOMI DOS BETAS COM FIGURINHA',
    description: 'Respeite os aparelhos dos irmãos de hardware humilde. Mandar 40 figurinhas pesadas piscantes em loop até reiniciar o celular dos novatos dá advertência direta.',
    punishment: 'Modo lento de 120 segundos aplicado na sua conta.'
  },
  {
    id: 23,
    category: 'shitpost',
    categoryLabel: 'Shitpost & Zueira',
    title: '23. NÃO PAGUE DE INTELECTUAL NO MEIO DO SHITPOST',
    description: 'Ninguém quer ler dissertação de mestrado com termos em latim ou citações acadêmicas enquanto a baixaria estiver comendo solta. Guarde o vocabulário para o LinkedIn.',
    punishment: 'Spam em massa de figurinha do macaco em todas as suas mensagens.'
  },
  {
    id: 24,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '24. PROIBIDO POLÍTICA OU FUTEBOL COM ÁLCOOL NO SANGUE',
    description: 'Debater escalação da seleção brasileira ou geopolítica internacional às 4 da manhã sob efeito de substâncias duvidosas sempre termina em soco virtual. Preserve a paz.',
    punishment: 'Mute de call até passar o efeito e a ressaca moral.'
  },
  {
    id: 25,
    category: 'seguranca',
    categoryLabel: 'Segurança & Dox',
    title: '25. SE FOR PINGAR @EVERYONE, QUE SEJA O APOCALIPSE',
    description: 'Marcar @everyone ou @here sem autorização explícita dos Deuses só é permitido se um meteoro estiver caindo na sua casa. Do contrário, a punição é imediata.',
    punishment: 'Banimento instantâneo com passagem só de ida para o submundo.'
  },
  {
    id: 26,
    category: 'hierarquia',
    categoryLabel: 'Hierarquia & Poder',
    title: '26. O CANAL ・ 𝗮𝗻𝘂𝗻𝗰𝗶𝗼𝘀 É DECRETO LEI',
    description: 'Quando os Donos ou Deuses emitirem comunicado nos anúncios, leia e cumpra. Não venha na SMS perguntar "é sério isso?". Se está nos anúncios, virou lei constitucional.',
    punishment: 'Execução imediata da pena descrita no comunicado.'
  },
  {
    id: 27,
    category: 'seguranca',
    categoryLabel: 'Segurança & Dox',
    title: '27. PROIBIDO FLERTAR COM O PANELBOT',
    description: 'O PanelBot foi desenvolvido para segurança militar e automação de servidores. Mandar cantada pro bot ou tentar webnamorar o código ativará o protocolo de vergonha pública.',
    punishment: 'O bot responderá zombando da sua carência no meio do chat geral.'
  },
  {
    id: 28,
    category: 'convivencia',
    categoryLabel: 'Convivência & Caos',
    title: '28. SE O ASSUNTO FOR SECRETO, VÁ PRO PRIVADO',
    description: 'Ficar no chat geral com mistério e conversinha de comadre tipo "amigo, sabe aquilo? depois te conto..." é estritamente proibido. Ou conta a fofoca toda na SMS ou vai pro PV.',
    punishment: 'Obrigação moral de explanar o babado para todos os membros.'
  },
  {
    id: 29,
    category: 'hierarquia',
    categoryLabel: 'Hierarquia & Poder',
    title: '29. RESPEITE OS BETAS, SEM ELES NÃO HÁ AUDIÊNCIA',
    description: 'Não pratique bullying excessivo com os Betas novatos. Eles são necessários para inflar as estatísticas do servidor e dar audiência às loucuras dos Alfas.',
    punishment: 'Rebaixamento temporário a Beta para sentir na pele.'
  },
  {
    id: 30,
    category: 'seguranca',
    categoryLabel: 'Segurança & Dox',
    title: '30. REGRA SUPREMA: O QUE ACONTECE NA PANELINHA FICA NA PANELINHA',
    description: 'Tirar print das conversas para explanar no Twitter ou mandar em servidores rivais é considerado alta traição diplomática. O traidor será caçado e imortalizado em meme.',
    punishment: 'Banimento perpétuo, exposed com direito a PowerPoint e humilhação pública.'
  }
];

// Helper to build Discord Embeds from rules (split into Part 1 and Part 2 to respect Discord 25-field limit)
export function buildRulesEmbedPart1() {
  return {
    title: '📜 CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 1/2',
    description: 'Regulamento oficial do covil. Siga rigorosamente para evitar rebaixamento imediato a Beta ou deportação para o AFK.',
    color: '#5865F2',
    thumbnail: { url: BOT_AVATAR },
    fields: PANELEIRO_RULES_LIST.slice(0, 15).map((r) => ({
      name: r.title,
      value: `${r.description}\n*⚖️ ${r.punishment}*`,
      inline: false
    })),
    footer: {
      text: 'PanelBot Security Protocol • Parte 1 de 2 • dog_cyb',
      icon_url: BOT_AVATAR
    },
    timestamp: new Date().toISOString()
  };
}

export function buildRulesEmbedPart2() {
  return {
    title: '⚡ CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 2/2',
    description: 'Diretrizes complementares de voz, shitpost, microfones e segurança de sobrevivência na panelinha.',
    color: '#9B59B6',
    thumbnail: { url: BOT_AVATAR },
    fields: PANELEIRO_RULES_LIST.slice(15, 30).map((r) => ({
      name: r.title,
      value: `${r.description}\n*⚖️ ${r.punishment}*`,
      inline: false
    })),
    footer: {
      text: 'PanelBot Security Protocol • Parte 2 de 2 • dog_cyb',
      icon_url: BOT_AVATAR
    },
    timestamp: new Date().toISOString()
  };
}

// Initial messages for templates
export const RULES_PART_1 = buildRulesEmbedPart1();
export const RULES_PART_2 = buildRulesEmbedPart2();

export const TEMPLATE_DOG_CYB: TemplateDefinition = {
  id: 'dog_cyb',
  name: 'Dog Cyb (Servidor Paneleiro Oficial)',
  description: 'Estrutura oficial sem emojis: apenas pontos chineses e nomes em negrito, canais de anúncios e leitura protegidos, canal de plaquinhas em formato de fórum, e sistema de entrada/saída personalizado.',
  version: '3.0.0',
  author: 'dog_cyb',
  categories: [
    {
      name: '・ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒 ・',
      channels: [
        {
          name: '・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮',
          type: 'text',
          topic: 'Boas-vindas automáticas aos novatos: Bem-vindo, kapeta!',
          readOnly: true
        },
        {
          name: '・ 𝘀𝗮𝗶𝗻𝗱𝗼',
          type: 'text',
          topic: 'Logs de saída: O fdpt saiu, espero que o diabo coma seu cu!',
          readOnly: true
        },
        {
          name: '・ 𝗿𝗲𝗴𝗿𝗮𝘀',
          type: 'text',
          topic: 'Regras da casa em embed. Apenas leitura. Não alimente o macaco.',
          readOnly: true
        },
        {
          name: '・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀',
          type: 'forum',
          topic: 'Canal de Fórum para pedidos e resgate de plaquinhas personalizadas.',
          readOnly: false
        },
        {
          name: '・ 𝗮𝗻𝘂𝗻𝗰𝗶𝗼𝘀',
          type: 'announcement',
          topic: 'Canal oficial de anúncios e avisos dos Deuses e da Administração.',
          readOnly: true
        }
      ]
    },
    {
      name: '・ 𝐂𝐇𝐀𝐓 𝐆𝐄𝐑𝐀𝐋 ・',
      channels: [
        {
          name: '・ 𝘀𝗺𝘀',
          type: 'text',
          topic: 'Chat principal de bate-papo rápido, resenha e shitpost 24/7.',
          readOnly: false
        },
        {
          name: '・ 𝗺𝗶𝗱𝗶𝗮𝘀',
          type: 'text',
          topic: 'Envio livre de imagens, memes, vídeos e áudios.',
          readOnly: false
        },
        {
          name: '・ 𝗯𝘂𝘀𝗰𝗮𝗿-𝗶𝗽',
          type: 'text',
          topic: 'Canal paneleiro de busca de IP fake e zoeira entre membros.',
          readOnly: false
        },
        {
          name: '・ 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀',
          type: 'text',
          topic: 'Área reservada para invocar bots e testar comandos.',
          readOnly: false
        },
        {
          name: '・ 𝗱𝗶𝘃𝘂𝗹𝗴𝗮𝗰𝗮𝗼',
          type: 'text',
          topic: 'Parcerias e divulgação de links permitidos.',
          readOnly: false
        }
      ]
    },
    {
      name: '・ 𝐕𝐎𝐙 & 𝐂𝐀𝐋𝐋𝐒 ・',
      channels: [
        {
          name: '・ 𝗱𝘂𝗼 𝟭',
          type: 'voice',
          userLimit: 2
        },
        {
          name: '・ 𝗱𝘂𝗼 𝟮',
          type: 'voice',
          userLimit: 2
        },
        {
          name: '・ 𝗰𝗮𝗹𝗹 𝟭',
          type: 'voice'
        },
        {
          name: '・ 𝗰𝗮𝗹𝗹 𝟮',
          type: 'voice'
        },
        {
          name: '・ 𝗴𝗳 𝟭',
          type: 'voice',
          userLimit: 2
        },
        {
          name: '・ 𝗴𝗳 𝟮',
          type: 'voice',
          userLimit: 2
        },
        {
          name: '・ 𝗺𝘂𝘀𝗶𝗰𝗮 𝟭',
          type: 'voice'
        },
        {
          name: '・ 𝗺𝘂𝘀𝗶𝗰𝗮 𝟮',
          type: 'voice'
        },
        {
          name: '・ 𝗮𝗳𝗸 𝟭',
          type: 'voice'
        },
        {
          name: '・ 𝗮𝗳𝗸 𝟮',
          type: 'voice'
        }
      ]
    }
  ],
  roles: [
    {
      name: 'DONO',
      color: '#FEE75C',
      hoist: true,
      permissions: ['ADMINISTRATOR', 'MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'BAN_MEMBERS']
    },
    {
      name: 'SUB DONO',
      color: '#E67E22',
      hoist: true,
      permissions: ['MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS', 'KICK_MEMBERS', 'MUTE_MEMBERS']
    },
    {
      name: 'DEUSES',
      color: '#9B59B6',
      hoist: true,
      permissions: ['PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'MANAGE_MESSAGES', 'ATTACH_FILES']
    },
    {
      name: 'MODERADORES',
      color: '#3498DB',
      hoist: true,
      permissions: ['MANAGE_MESSAGES', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS']
    },
    {
      name: 'ALFAS',
      color: '#E74C3C',
      hoist: true,
      permissions: ['PRIORITY_SPEAKER', 'USE_EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK']
    },
    {
      name: 'BETAS',
      color: '#95A5A6',
      hoist: true,
      permissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
    },
    {
      name: 'DIVULGADOR',
      color: '#2ECC71',
      hoist: true,
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
    },
    {
      name: 'MEMBRO',
      color: '#BDC3C7',
      hoist: false,
      permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT', 'SPEAK']
    },
    {
      name: 'PANELBOT',
      color: '#5865F2',
      hoist: true,
      permissions: ['ADMINISTRATOR']
    }
  ],
  initialMessages: [
    {
      channelMatch: 'regras',
      embed: RULES_PART_1
    },
    {
      channelMatch: 'regras',
      embed: RULES_PART_2
    },
    {
      channelMatch: 'entrada',
      embed: {
        title: 'BEM-VINDO, KAPETA!',
        description: 'Mais um doido entrou na panelinha! <@novato_kapeta> acabou de brotar nos portões do servidor.',
        color: '#2ECC71',
        thumbnail: {
          url: 'https://api.dicebear.com/7.x/bottts/svg?seed=kapeta_novato'
        },
        fields: [
          {
            name: 'Regras da Casa',
            value: 'Va agora em <#regras> ler o regulamento antes de fazer besteira.',
            inline: true
          },
          {
            name: 'Plaquinhas',
            value: 'Faca seu pedido no forum <#plaquinhas>.',
            inline: true
          },
          {
            name: 'Bate-papo',
            value: 'Venha conversar em <#sms>.',
            inline: true
          }
        ],
        footer: {
          text: 'PanelBot Welcome System • Sistema de Entrada Ativo'
        },
        timestamp: new Date().toISOString()
      }
    },
    {
      channelMatch: 'saindo',
      embed: {
        title: 'O FDPT SAIU!',
        description: 'O fdpt <@beta_fujão> não aguentou a pressão e vazou do servidor. Espero que o diabo coma seu cu!',
        color: '#ED4245',
        thumbnail: {
          url: 'https://api.dicebear.com/7.x/bottts/svg?seed=beta_fujao'
        },
        fields: [
          {
            name: 'Destino do Fraco',
            value: 'Menos um peso morto pra puxar a call pra baixo. Foi pra vala dos betas.',
            inline: false
          }
        ],
        footer: {
          text: 'PanelBot Leave Logger • Menos um membro'
        },
        timestamp: new Date().toISOString()
      }
    },
    {
      channelMatch: 'anuncios',
      embed: {
        title: 'TRANSMISSAO OFICIAL DA ADMINISTRACAO',
        description: 'Canal exclusivo para avisos, decretos e novidades dos Donos e Deuses. Membros regulares tem permissao somente de leitura.',
        color: '#FEE75C',
        footer: {
          text: 'Canal de Anuncios • Somente Leitura'
        },
        timestamp: new Date().toISOString()
      }
    }
  ]
};

export const FORUM_SAMPLE_POSTS = [
  {
    id: 'post_1',
    title: '[OFICIAL] Como solicitar sua Plaquinha no Servidor',
    author: {
      name: 'Dog_Fundador',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dono_dog',
      roleColor: '#FEE75C',
      roleName: 'DONO'
    },
    content: 'Crie uma postagem neste fórum informando seu nick e qual plaquinha deseja: [Deus da Panel], [Alfa Nato], [Tropa do Dog], [Rei da Call] ou [Viciado em GF]. Membros sem plaquinha serão taxados de beta.',
    tags: ['OFICIAL', 'FIXADO'],
    replyCount: 42,
    upvotes: 68,
    createdAt: 'Hoje às 08:00',
    pinned: true
  },
  {
    id: 'post_2',
    title: '[PEDIDOS] Plaquinha de Alfa Nato para novos membros',
    author: {
      name: 'Alfa_Cyborg',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alfa_dog',
      roleColor: '#E74C3C',
      roleName: 'ALFAS'
    },
    content: 'Postem seus prints de participação nas calls e no chat ・ 𝘀𝗺𝘀 para comprovar status de Alfa e receber a plaquinha oficial.',
    tags: ['ALFAS', 'PEDIDOS'],
    replyCount: 19,
    upvotes: 24,
    createdAt: 'Hoje às 09:30',
    pinned: false
  },
  {
    id: 'post_3',
    title: '[INSIGNIA] Plaquinha Viciado em GF para casais da call',
    author: {
      name: 'Sub_Tenente',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sub_dono',
      roleColor: '#E67E22',
      roleName: 'SUB DONO'
    },
    content: 'Quem mora na call ・ 𝗴𝗳 𝟭 ou ・ 𝗴𝗳 𝟮 tem que solicitar a plaquinha com o @ do parceiro. Não aceitamos mentiras.',
    tags: ['GF', 'ZUEIRA'],
    replyCount: 31,
    upvotes: 45,
    createdAt: 'Hoje às 10:15',
    pinned: false
  }
];

export const AVAILABLE_TEMPLATES: TemplateDefinition[] = [
  TEMPLATE_DOG_CYB
];

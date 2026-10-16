import React, { useState } from 'react';
import { Sparkles, Hash, Copy, Check, MessageSquare, Plus, Trash2 } from 'lucide-react';
import {
  SYMBOL_PRESETS,
  toUnicodeBoldSans,
  toUnicodeBoldSerif,
  toSmallCaps,
  TEMPLATE_DOG_CYB
} from '../data/templates';
import { DiscordEmbedView } from './DiscordEmbedView';

export const TemplateCustomizerTab: React.FC = () => {
  const [testText, setTestText] = useState('sms');
  const [selectedSymbol, setSelectedSymbol] = useState('chinese_dot');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Editable rules state
  const [rules, setRules] = useState([
    {
      title: '1. NÃO ALIMENTE O MACACO',
      desc: 'Sob hipótese alguma dê moral para o primata que ficar spammando no chat ou chamando no privado. Ele se descontrola após as 22h e começa a morder os cabos de rede e pingar @everyone.'
    },
    {
      title: '2. NÃO FAÇA SOPA ÀS 2 DA MANHÃ',
      desc: 'O som da panela de pressão treme a call dos Deuses e acorda o Sub Dono. Quem for pego esquentando caldo de madrugada na call toma mute instantâneo de 48 horas sem direito a fiança.'
    },
    {
      title: '3. RESPEITE A HIERARQUIA DE ALFAS E DEUSES',
      desc: 'Se um Dono, Sub Dono ou Deus entrar na sala, abaixe o volume do seu microfone. Proibido gemer no microfone sem autorização formal por escrito de um Alfa.'
    },
    {
      title: '4. COLOQUE SUA PLAQUINHA NO FÓRUM',
      desc: 'Acesse o canal de fórum ・ 𝗽𝗹𝗮𝗾𝘂𝗶𝗻𝗵𝗮𝘀 e crie seu tópico de solicitação. Membro sem plaquinha é tratado como espião infiltrado e perde a cidadania no chat.'
    },
    {
      title: '5. BUSCAR IP SOMENTE NO CANAL CORRETO',
      desc: 'Toda consulta de zoeira, puxada de CEP da tia ou dox fake deve ser feita estritamente no canal ・ 𝗯𝘂𝘀𝗰𝗮𝗿-𝗶𝗽. Proibido poluir a SMS com coordenadas de Xique-Xique.'
    },
    {
      title: '6. CANAIS DE GF MONITORADOS',
      desc: 'Quem entrar nas calls GF 1 ou GF 2 para webnamorar tem que pagar a taxa moral para a moderação, sob pena de ser arremessado imediatamente para o AFK 2 com áudio mutado.'
    },
    {
      title: '7. PROIBIDO FALAR DE CLT E TRABALHO',
      desc: 'Este é um recinto sagrado de shitpost e resenha 24/7. Não deprima os manos com cálculo de FGTS, escala 6x1 ou desconto do INSS em pleno horário nobre.'
    },
    {
      title: '8. SE FOR EXPÔR ALGUÉM, FAÇA EM POWERPOINT',
      desc: 'Dox e exposed de baixa qualidade serão apagados sumariamente. Se for explanar a fofoca de alguém, exija-se apresentação formal com slides, transição Estrela, gráfico de pizza e fonte Comic Sans.'
    },
    {
      title: '9. RESPEITE OS DEUSES, ELES NÃO DORMEM HÁ 4 DIAS',
      desc: 'A administração sobrevive à base de energético barato e rancor. Não marque o Dono ou Deuses para perguntar besteira se não quiser tomar banho de kick sem aviso.'
    },
    {
      title: '10. NÃO PEÇA CARGO DE MODERADOR',
      desc: 'Ficar pedindo cargo no privado da staff é o caminho mais rápido para ganhar o cargo honorário de Faxineiro da Call no canal AFK.'
    },
    {
      title: '11. PROIBIDO TOCAR GEMIDÃO NO BOT DE MÚSICA',
      desc: 'O canal de música é patrimônio da comunidade. Quem botar funk estourado em 300% de ganho ou áudio do gemidão vai ter o fone confiscado moralmente.'
    },
    {
      title: '12. SE BEBER, NÃO ABRA O CANAL ・ 𝗺𝗶𝗱𝗶𝗮𝘀',
      desc: 'Fotos vergonhosas enviadas sob efeito de substâncias duvidosas serão imortalizadas nos arquivos dos Deuses e usadas como chantagem em votações futuras.'
    },
    {
      title: '13. PROIBIDO CHORAR POR DERROTA NO DUO',
      desc: 'Se você puxou duo no canal ・ 𝗱𝘂𝗼 𝟭 e perdeu o elo, resolva na mão limpa. Proibido abrir votação de impeachment do parceiro no chat geral.'
    },
    {
      title: '14. O SUB DONO NUNCA ESTÁ ERRADO',
      desc: 'Caso o Sub Dono esteja visivelmente equivocado, consulte a regra 9 e finja demência. A sobrevivência na panelinha depende da sua capacidade de concordar com absurdos.'
    },
    {
      title: '15. SE FOR CAIR DA CALL, CAIA COM HONRA',
      desc: 'Proibido sumir no meio da discussão dizendo que a internet caiu. Se for puxar o cabo da tomada, assuma publicamente que tomou pavor.'
    }
  ]);

  const preset = SYMBOL_PRESETS.find((p) => p.id === selectedSymbol) || SYMBOL_PRESETS[0];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentRulesEmbed = {
    title: '📜 REGRAS DO SERVIDOR PANELEIRO [DOG_CYB]',
    description: 'Diretrizes oficiais para evitar suspensão imediata e rebaixamento para Beta.',
    color: '#5865F2',
    fields: rules.map((r) => ({
      name: r.title,
      value: r.desc,
      inline: false
    })),
    footer: {
      text: 'PanelBot Security System • Moderação Ativa'
    },
    timestamp: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Estilização de Fontes & Embeds</h2>
            <p className="text-xs text-[#949ba4] mt-0.5">
              Gere nomes de canais com negrito unicode e configure os embeds de regras engraçadas do servidor.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Unicode Channel Generator */}
        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#5865F2]" />
            <span>Gerador de Canais com Negrito & Ponto Chinês</span>
          </h3>

          <div>
            <label className="text-xs text-[#b5bac1] block mb-1">
              Digite o nome base do canal:
            </label>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Ex: sms, entrada, plaquinhas, buscar-ip"
              className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
            />
          </div>

          <div>
            <label className="text-xs text-[#b5bac1] block mb-2">
              Escolha o Símbolo / Ponto Chinês:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {SYMBOL_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedSymbol(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedSymbol === p.id
                      ? 'bg-[#35373c] border-[#5865F2] text-white font-bold'
                      : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] hover:bg-[#2b2d31]'
                  }`}
                >
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-[11px] font-mono text-[#5865F2] mt-0.5">
                    {p.prefix}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formats Output List */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
              Resultados Prontos para Copiar:
            </label>

            {[
              { label: 'Negrito Sem Serifa (Bold Sans)', val: `${preset.prefix}${toUnicodeBoldSans(testText)}` },
              { label: 'Negrito Com Serifa (Bold Serif)', val: `${preset.prefix}${toUnicodeBoldSerif(testText)}` },
              { label: 'Small Caps Estilizado', val: `${preset.prefix}${toSmallCaps(testText)}` },
              { label: 'Texto Padrão com Símbolo', val: `${preset.prefix}${testText}` },
              { label: 'Barra Dupla Clássica', val: `〢・${toUnicodeBoldSans(testText)}` },
              { label: 'Ideograma Japonês Zen', val: `々・${toUnicodeBoldSans(testText)}` }
            ].map((variant, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-[#1e1f22] border border-[#232428] rounded-xl"
              >
                <div>
                  <div className="text-[11px] text-[#949ba4]">{variant.label}</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {variant.val}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(variant.val, `var_${i}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#2b2d31] hover:bg-[#5865F2] text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === `var_${i}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#23a55a]" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hilarious Rules Embed Live Preview */}
        <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#5865F2]" />
              <span>Preview do Embed Oficial das Regras</span>
            </h3>
            <span className="text-[11px] text-[#23a55a] font-mono">Disparado no /load</span>
          </div>

          <p className="text-xs text-[#949ba4]">
            Este é o visual exato que os membros verão no canal <code className="text-[#5865F2]">#regras</code> quando o bot executar o template:
          </p>

          <div className="p-2 bg-[#1e1f22] rounded-xl border border-[#232428]">
            <DiscordEmbedView embed={currentRulesEmbed} />
          </div>

          <div className="text-[11px] text-[#949ba4] bg-[#1e1f22] p-3 rounded-xl border border-[#232428] space-y-1">
            <div className="font-bold text-white">✨ Regras incluídas no dog_cyb:</div>
            <div>• "Não alimente o macaco" (clássica zoeira paneleira)</div>
            <div>• "Não faça sopa às 2 da manhã" (fiscalização de barulho em call)</div>
            <div>• "Respeite os Deuses e Alfas"</div>
            <div>• "Buscar IP estritamente no canal certo"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

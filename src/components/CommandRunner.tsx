import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Shield,
  Volume2,
  Hash,
  Copy,
  Check,
  Server,
  Lock,
  MessageSquare,
  Megaphone
} from 'lucide-react';
import {
  TEMPLATE_DOG_CYB,
  AVAILABLE_TEMPLATES,
  SYMBOL_PRESETS,
  toUnicodeBoldSans,
  toUnicodeBoldSerif,
  toSmallCaps
} from '../data/templates';
import { DiscordGuild } from '../types/discord';

interface CommandRunnerProps {
  currentGuild: DiscordGuild;
  onRunLoadTemplate: (
    templateId: string,
    options: {
      symbolStyle: string;
      fontStyle: 'boldSans' | 'boldSerif' | 'smallCaps' | 'default';
      purgeExisting: boolean;
      useRealApi?: boolean;
    }
  ) => Promise<void>;
  isExecuting: boolean;
  logs: string[];
}

export const CommandRunner: React.FC<CommandRunnerProps> = ({
  currentGuild,
  onRunLoadTemplate,
  isExecuting,
  logs
}) => {
  const [templateId, setTemplateId] = useState('dog');
  const [symbolStyle, setSymbolStyle] = useState('chinese_dot');
  const [fontStyle, setFontStyle] = useState<'boldSans' | 'boldSerif' | 'smallCaps' | 'default'>('boldSans');
  const [purgeExisting, setPurgeExisting] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [useRealApi, setUseRealApi] = useState(true);
  const [isRegisteringSlash, setIsRegisteringSlash] = useState(false);
  const [regFeedback, setRegFeedback] = useState<string | null>(null);

  const selectedPreset = SYMBOL_PRESETS.find((s) => s.id === symbolStyle) || SYMBOL_PRESETS[0];

  const formatPreview = (name: string) => {
    let base = name;
    if (fontStyle === 'boldSans') base = toUnicodeBoldSans(name);
    else if (fontStyle === 'boldSerif') base = toUnicodeBoldSerif(name);
    else if (fontStyle === 'smallCaps') base = toSmallCaps(name);
    return `${selectedPreset.prefix}${base}`;
  };

  const handleExecute = () => {
    onRunLoadTemplate(templateId, {
      symbolStyle,
      fontStyle,
      purgeExisting,
      useRealApi
    });
  };

  const copySlashCommand = () => {
    navigator.clipboard.writeText(`/load [id]:${templateId}`);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleRegisterOnDiscord = async () => {
    setIsRegisteringSlash(true);
    setRegFeedback(null);
    try {
      const res = await fetch('/api/discord/commands/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: currentGuild.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegFeedback(`✅ Comando /load [id]:dog registrado com sucesso no Discord! Já está visível.`);
      } else {
        setRegFeedback(`⚠️ ${data.error || 'Erro ao registrar comando'}`);
      }
    } catch (e: any) {
      setRegFeedback(`❌ Erro: ${e.message}`);
    } finally {
      setIsRegisteringSlash(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining /load [id]:dog */}
      <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#35373c]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-lg shadow-[#5865F2]/20 shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">Comando /load [id]:dog</h2>
                <span className="text-[11px] bg-[#5865F2] text-white font-mono font-bold px-2 py-0.5 rounded shadow">
                  [id]: dog
                </span>
                <span className="text-[10px] bg-[#23a55a]/20 text-[#23a55a] font-mono px-2 py-0.5 rounded font-bold">
                  VARIÁVEL AUTOMÁTICA
                </span>
                <span className="text-[10px] bg-[#35373c] text-[#dbdee1] font-mono px-2 py-0.5 rounded">
                  SÓ PONTOS CHINESES
                </span>
              </div>
              <p className="text-xs text-[#949ba4] mt-0.5">
                Executa a purga total dos canais antigos e recria a estrutura com nomes em negrito, regras em 2 embeds, canais de anúncios e leitura protegidos, e fórum de plaquinhas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleRegisterOnDiscord}
              disabled={isRegisteringSlash}
              className="px-3.5 py-2 rounded-xl bg-[#23a55a] hover:bg-[#1f924f] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRegisteringSlash ? 'Registrando...' : 'Registrar no Discord API'}</span>
            </button>

            <button
              type="button"
              onClick={copySlashCommand}
              className="px-3.5 py-2 rounded-xl bg-[#1e1f22] hover:bg-[#35373c] border border-[#3f4147] text-xs font-mono text-white flex items-center gap-2 transition-all"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-[#23a55a]" /> : <Copy className="w-3.5 h-3.5 text-[#949ba4]" />}
              <span>/load [id]:{templateId}</span>
            </button>

            <button
              type="button"
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#5865F2]/25 transition-all disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executando /load...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Executar no Servidor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {regFeedback && (
          <div className="text-xs bg-[#1e1f22] border border-[#3f4147] p-3 rounded-xl text-white flex items-center justify-between">
            <span>{regFeedback}</span>
            <span className="text-[10px] text-[#949ba4]">Instantâneo no Discord</span>
          </div>
        )}


        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {/* 1. Template Identifier */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
              1. Identificador do Template (id)
            </label>
            <div className="space-y-1.5">
              {AVAILABLE_TEMPLATES.map((tmpl) => (
                <label
                  key={tmpl.id}
                  onClick={() => setTemplateId(tmpl.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    templateId === tmpl.id
                      ? 'bg-[#35373c] border-[#5865F2] text-white ring-1 ring-[#5865F2]'
                      : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] hover:bg-[#2e3035]'
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    checked={templateId === tmpl.id}
                    onChange={() => setTemplateId(tmpl.id)}
                    className="mt-0.5 text-[#5865F2] focus:ring-[#5865F2]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <span>vari: {tmpl.id}</span>
                      <span className="text-[10px] bg-[#23a55a]/20 text-[#23a55a] px-1.5 py-0.2 rounded font-sans">
                        Oficial
                      </span>
                    </div>
                    <div className="text-[11px] text-[#949ba4] mt-0.5 line-clamp-2">
                      {tmpl.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Real Discord API execution checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 p-2.5 bg-[#1e1f22] rounded-xl border border-[#3f4147] cursor-pointer hover:border-[#5865F2] transition-colors text-xs">
                <input
                  type="checkbox"
                  checked={useRealApi}
                  onChange={(e) => setUseRealApi(e.target.checked)}
                  className="rounded bg-[#2b2d31] border-[#3f4147] text-[#5865F2] focus:ring-[#5865F2]"
                />
                <div>
                  <span className="text-white font-medium block">
                    Modo API Discord Real
                  </span>
                  <span className="text-[10px] text-[#949ba4]">
                    Usa o token e guild ID configurados nas variáveis de ambiente (.env)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Símbolos: Apenas Pontos Chineses */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
              2. Ponto Chinês (Sem Emojis)
            </label>
            <div className="space-y-1.5">
              {SYMBOL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSymbolStyle(preset.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                    symbolStyle === preset.id
                      ? 'bg-[#35373c] border-[#5865F2] text-white font-medium'
                      : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] hover:bg-[#2e3035]'
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                  <span className="font-mono text-white text-[11px] bg-[#2b2d31] px-1.5 py-0.5 rounded">
                    {preset.prefix}𝘀𝗺𝘀
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-semibold text-[#949ba4] block mb-1">
                Tipografia em Negrito:
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'boldSans', label: 'Negrito (𝘀𝗺𝘀)' },
                  { id: 'boldSerif', label: 'Serifado (𝐬𝐦𝐬)' },
                  { id: 'smallCaps', label: 'Caps (ꜱᴍꜱ)' },
                  { id: 'default', label: 'Padrão (sms)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFontStyle(item.id as any)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      fontStyle === item.id
                        ? 'bg-[#5865F2]/20 border-[#5865F2] text-white font-bold'
                        : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] hover:bg-[#2e3035]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Preview com tipos de canal */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
              3. Visualização da Estrutura Criada
            </label>
            <div className="bg-[#1e1f22] p-3 rounded-xl border border-[#232428] space-y-1.5 font-mono text-xs text-[#dbdee1]">
              <div className="text-[11px] text-[#949ba4] pb-1 border-b border-[#2e3035] font-sans flex items-center justify-between">
                <span>Categorias & Canais:</span>
                <span className="text-[#23a55a]">Zero Emojis</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#80848e]" />
                  <span>{formatPreview('entrada')}</span>
                </span>
                <span className="text-[10px] text-[#949ba4]">Leitura</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#80848e]" />
                  <span>{formatPreview('saindo')}</span>
                </span>
                <span className="text-[10px] text-[#949ba4]">Leitura</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#80848e]" />
                  <span>{formatPreview('regras')}</span>
                </span>
                <span className="text-[10px] text-[#949ba4]">Embed</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-[#f0b232]" />
                  <span>{formatPreview('anuncios')}</span>
                </span>
                <span className="text-[10px] text-[#f0b232]">Anúncios</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>{formatPreview('plaquinhas')}</span>
                </span>
                <span className="text-[10px] text-[#5865F2]">Fórum</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>{formatPreview('sms')}</span>
                </span>
                <span className="text-[10px] text-[#23a55a]">Liberado</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>{formatPreview('buscar-ip')}</span>
                </span>
                <span className="text-[10px] text-[#e74c3c]">Dox Fake</span>
              </div>
              <div className="text-[11px] text-[#949ba4] pt-1 border-t border-[#2e3035]">
                {formatPreview('duo 1')} · {formatPreview('call 1')} · {formatPreview('gf 1')} · {formatPreview('musica 1')} · {formatPreview('afk 1')}
              </div>
            </div>

            {/* Purge / Nuke Checkbox */}
            <label className="flex items-center gap-2 p-2.5 bg-[#1e1f22] rounded-xl border border-[#3f4147] cursor-pointer hover:border-[#5865F2] transition-colors text-xs">
              <input
                type="checkbox"
                checked={purgeExisting}
                onChange={(e) => setPurgeExisting(e.target.checked)}
                className="rounded bg-[#2b2d31] border-[#3f4147] text-[#5865F2] focus:ring-[#5865F2]"
              />
              <span className="text-white font-medium">
                Apagar todos os canais antes de criar (Nuke & Rebuild)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Terminal Logs Execution View */}
      <div className="bg-[#1e1f22] border border-[#232428] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 bg-[#18191c] border-b border-[#232428] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#949ba4]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ed4245]" />
              <div className="w-3 h-3 rounded-full bg-[#f0b232]" />
              <div className="w-3 h-3 rounded-full bg-[#23a55a]" />
            </div>
            <span className="ml-2 text-white font-bold">Terminal /load dog_cyb</span>
            <span>—</span>
            <span>{currentGuild.name}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isExecuting ? (
              <span className="text-[#f0b232] flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#f0b232] animate-ping" />
                PROCESSANDO PROTOCOLO
              </span>
            ) : (
              <span className="text-[#23a55a] flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PRONTO
              </span>
            )}
          </div>
        </div>

        {/* Console Content */}
        <div className="p-4 font-mono text-xs max-h-64 overflow-y-auto space-y-1.5 bg-[#111214] text-[#dbdee1]">
          {logs.length === 0 ? (
            <div className="text-[#949ba4] italic py-4 text-center">
              Aguardando comando. Clique em "Executar no Servidor" ou envie <code className="text-[#5865F2]">/load dog_cyb</code> no chat para iniciar o processo.
            </div>
          ) : (
            logs.map((log, index) => {
              const isError = log.includes('ERR') || log.includes('Falha');
              const isSuccess = log.includes('✅') || log.includes('Sucesso') || log.includes('concluído');
              const isWarning = log.includes('⚠️') || log.includes('Purgando');

              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${
                    isError
                      ? 'text-[#ed4245]'
                      : isSuccess
                      ? 'text-[#23a55a]'
                      : isWarning
                      ? 'text-[#f0b232]'
                      : 'text-[#dbdee1]'
                  }`}
                >
                  <span className="text-[#4e5058] select-none">
                    [{String(index + 1).padStart(2, '0')}]
                  </span>
                  <span>{log}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

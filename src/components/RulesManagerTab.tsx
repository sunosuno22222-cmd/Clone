import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Send,
  Plus,
  Sparkles,
  Shield,
  Volume2,
  Lock,
  Flame,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { PANELEIRO_RULES_LIST, PaneleiroRule, BOT_AVATAR } from '../data/templates';
import { DiscordEmbedView } from './DiscordEmbedView';

interface RulesManagerTabProps {
  onPublishRulesToDiscord?: (rules: PaneleiroRule[]) => void;
  onNavigateToDiscord?: () => void;
}

export const RulesManagerTab: React.FC<RulesManagerTabProps> = ({
  onPublishRulesToDiscord,
  onNavigateToDiscord
}) => {
  const [rules, setRules] = useState<PaneleiroRule[]>(PANELEIRO_RULES_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedRuleId, setCopiedRuleId] = useState<number | null>(null);
  const [publishedToast, setPublishedToast] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'embeds'>('cards');

  // Add rule modal state
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPunishment, setNewPunishment] = useState('');
  const [newCategory, setNewCategory] = useState<'convivencia' | 'hierarquia' | 'calls' | 'shitpost' | 'seguranca'>('convivencia');

  // Filtered rules
  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.punishment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: `Todas (${rules.length})`, icon: BookOpen },
    { id: 'convivencia', label: 'Convivência & Caos', icon: Flame },
    { id: 'hierarquia', label: 'Hierarquia & Poder', icon: Shield },
    { id: 'calls', label: 'Calls & Voz', icon: Volume2 },
    { id: 'shitpost', label: 'Shitpost & Zueira', icon: Sparkles },
    { id: 'seguranca', label: 'Segurança & Dox', icon: Lock }
  ];

  // Copy all rules formatted for Discord Markdown
  const handleCopyAll = () => {
    const markdown = rules
      .map(
        (r) =>
          `**${r.title}**\n${r.description}\n*⚖️ Punição: ${r.punishment}*\n`
      )
      .join('\n');
    navigator.clipboard.writeText(markdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy single rule
  const handleCopySingle = (rule: PaneleiroRule) => {
    const text = `**${rule.title}**\n${rule.description}\n*⚖️ Punição: ${rule.punishment}*`;
    navigator.clipboard.writeText(text);
    setCopiedRuleId(rule.id);
    setTimeout(() => setCopiedRuleId(null), 2000);
  };

  // Add new rule
  const handleAddCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const nextId = rules.length + 1;
    const catLabels: Record<string, string> = {
      convivencia: 'Convivência & Caos',
      hierarquia: 'Hierarquia & Poder',
      calls: 'Calls & Voz',
      shitpost: 'Shitpost & Zueira',
      seguranca: 'Segurança & Dox'
    };

    const newRuleItem: PaneleiroRule = {
      id: nextId,
      category: newCategory,
      categoryLabel: catLabels[newCategory] || 'Geral',
      title: `${nextId}. ${newTitle.toUpperCase().trim()}`,
      description: newDesc.trim(),
      punishment: newPunishment.trim() || 'Mute preventivo de 24 horas.'
    };

    const updated = [...rules, newRuleItem];
    setRules(updated);
    setIsAddingRule(false);
    setNewTitle('');
    setNewDesc('');
    setNewPunishment('');

    if (onPublishRulesToDiscord) {
      onPublishRulesToDiscord(updated);
    }
  };

  // Publish / Dispatch to Discord
  const handlePublish = () => {
    if (onPublishRulesToDiscord) {
      onPublishRulesToDiscord(rules);
    }
    setPublishedToast(true);
    setTimeout(() => setPublishedToast(false), 3000);
  };

  // Build live embed previews
  const part1Embed = {
    title: '📜 CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 1/2',
    description: 'Regulamento oficial do covil. Siga rigorosamente para evitar rebaixamento imediato a Beta ou deportação para o AFK.',
    color: '#5865F2',
    thumbnail: { url: BOT_AVATAR },
    fields: rules.slice(0, 15).map((r) => ({
      name: r.title,
      value: `${r.description}\n*⚖️ Punição: ${r.punishment}*`,
      inline: false
    })),
    footer: {
      text: `PanelBot Security Protocol • 1 a 15 de ${rules.length} regras • dog_cyb`,
      icon_url: BOT_AVATAR
    },
    timestamp: 'Hoje às 04:20'
  };

  const part2Embed = {
    title: '⚡ CÓDIGO PENAL PANELEIRO [DOG_CYB] • PARTE 2/2',
    description: 'Diretrizes complementares de voz, shitpost, microfones e segurança de sobrevivência na panelinha.',
    color: '#9B59B6',
    thumbnail: { url: BOT_AVATAR },
    fields: rules.slice(15, 30).map((r) => ({
      name: r.title,
      value: `${r.description}\n*⚖️ Punição: ${r.punishment}*`,
      inline: false
    })),
    footer: {
      text: `PanelBot Security Protocol • 16 a ${rules.length} de ${rules.length} regras • dog_cyb`,
      icon_url: BOT_AVATAR
    },
    timestamp: 'Hoje às 04:20'
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1e1f22] via-[#2b2d31] to-[#1e1f22] p-6 rounded-2xl border border-[#35373c] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[#5865F2]/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30">
                <BookOpen className="w-3.5 h-3.5" />
                CÓDIGO PENAL PANELEIRO
              </span>
              <span className="text-xs bg-[#23a55a]/20 text-[#23a55a] font-mono px-2 py-0.5 rounded font-bold border border-[#23a55a]/30">
                {rules.length} REGRAS ATIVAS
              </span>
              <span className="text-xs bg-[#f0b232]/20 text-[#f0b232] font-mono px-2 py-0.5 rounded font-bold border border-[#f0b232]/30 hidden sm:inline">
                CANAL #REGRAS · APENAS LEITURA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Regulamento Oficial da Panelinha
            </h1>
            <p className="text-sm text-[#949ba4] mt-1 max-w-2xl leading-relaxed">
              Diretrizes indispensáveis inspiradas no meme &quot;não alimente o macaco&quot; e &quot;não faça sopa às 2 da manhã&quot;.
              Todas as regras são enviadas em embeds com borda colorida e aviso de punições no canal <strong>・ 𝗿𝗲𝗴𝗿𝗮𝘀</strong>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2b2d31] hover:bg-[#35373c] text-white border border-[#3f4147] text-xs font-semibold shadow-sm transition-all"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-[#23a55a]" />
                  <span className="text-[#23a55a]">Copiado para Discord!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#949ba4]" />
                  <span>Copiar Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsAddingRule(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2] text-[#c9cdfb] hover:text-white border border-[#5865F2]/30 text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nova Regra</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#23a55a] hover:bg-[#1f934f] text-white text-xs font-bold shadow-lg shadow-[#23a55a]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Disparar no #regras</span>
            </button>
          </div>
        </div>

        {/* Success toast if published */}
        {publishedToast && (
          <div className="mt-4 p-3 rounded-xl bg-[#23a55a]/20 border border-[#23a55a]/40 text-xs text-[#23a55a] font-medium flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>
                As {rules.length} regras foram atualizadas com sucesso no canal <strong>・ 𝗿𝗲𝗴𝗿𝗮𝘀</strong> do Discord!
              </span>
            </div>
            {onNavigateToDiscord && (
              <button
                type="button"
                onClick={onNavigateToDiscord}
                className="underline hover:text-white font-bold ml-2"
              >
                Ver no Chat ao Vivo →
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Controls: Search, Categories, and Mode Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#80848e] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por macaco, sopa, clt, duo, doritos, fone, pix..."
            className="w-full bg-[#1e1f22] text-white placeholder-[#80848e] text-xs rounded-xl pl-10 pr-4 py-2.5 border border-[#2b2d31] focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#1e1f22] p-1 rounded-xl border border-[#2b2d31] self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'cards'
                ? 'bg-[#5865F2] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            Lista de Regras ({filteredRules.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('embeds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'embeds'
                ? 'bg-[#5865F2] text-white shadow-sm'
                : 'text-[#949ba4] hover:text-white'
            }`}
          >
            Visualizar Embeds Discord
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#5865F2]/20 border-[#5865F2] text-white font-semibold'
                  : 'bg-[#1e1f22] border-[#2b2d31] text-[#949ba4] hover:text-white hover:border-[#3f4147]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Content: Cards View or Embed Preview */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRules.map((rule) => {
            const isCopied = copiedRuleId === rule.id;

            return (
              <div
                key={rule.id}
                className="bg-[#2b2d31] rounded-2xl border border-[#35373c] p-4 flex flex-col justify-between hover:border-[#5865F2]/50 transition-all shadow-md group"
              >
                <div>
                  {/* Card Header: Category & Copy */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1e1f22] text-[#949ba4] border border-[#35373c]">
                      {rule.categoryLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(rule)}
                      title="Copiar regra individual para Discord"
                      className="text-[#80848e] hover:text-white p-1 rounded hover:bg-[#35373c] transition-colors"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-[#23a55a]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-[#c9cdfb] transition-colors">
                    {rule.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#dbdee1] mt-2 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                {/* Punishment Badge */}
                <div className="mt-4 pt-3 border-t border-[#35373c]/70 flex items-start gap-2 text-[11px] text-[#f23f43] bg-[#f23f43]/5 p-2.5 rounded-xl border border-[#f23f43]/20">
                  <Scale className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#f23f43]" />
                  <div>
                    <span className="font-bold text-[#f23f43] uppercase text-[10px] tracking-wider block">
                      PUNIÇÃO DO CÓDIGO PENAL
                    </span>
                    <span className="text-[#dbdee1]">{rule.punishment}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRules.length === 0 && (
            <div className="col-span-full py-12 text-center bg-[#1e1f22] rounded-2xl border border-[#2b2d31]">
              <AlertTriangle className="w-8 h-8 text-[#f0b232] mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-white">Nenhuma regra encontrada</h4>
              <p className="text-xs text-[#949ba4] mt-1">
                Tente buscar por outros termos como &quot;macaco&quot;, &quot;sopa&quot;, &quot;fone&quot; ou limpe os filtros.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 px-3 py-1.5 bg-[#2b2d31] hover:bg-[#35373c] text-white text-xs rounded-lg transition-colors"
              >
                Limpar Busca
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Embed Preview Mode */
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-4 bg-[#2b2d31] rounded-2xl border border-[#35373c]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#5865F2] uppercase tracking-wider">
                Embed Parte 1 de 2 • Convivência, Macaco, Sopa e Hierarquia
              </span>
              <span className="text-[11px] text-[#949ba4]">15 Campos (Regras 1 a 15)</span>
            </div>
            <DiscordEmbedView embed={part1Embed} />
          </div>

          <div className="p-4 bg-[#2b2d31] rounded-2xl border border-[#35373c]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#9B59B6] uppercase tracking-wider">
                Embed Parte 2 de 2 • Microfones, Calls, Shitpost & Segurança
              </span>
              <span className="text-[11px] text-[#949ba4]">15 Campos (Regras 16 a 30)</span>
            </div>
            <DiscordEmbedView embed={part2Embed} />
          </div>
        </div>
      )}

      {/* 4. Modal: Add Custom Rule */}
      {isAddingRule && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#313338] border border-[#3f4147] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5865F2]" />
                <h3 className="text-lg font-bold text-white">Adicionar Regra Personalizada</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="text-[#949ba4] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#b5bac1] mb-1">
                  Título da Regra (Ex: NÃO COMA PASTEL DE MIC ABERTO)
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nome engraçado da regra..."
                  className="w-full bg-[#1e1f22] text-white text-xs rounded-xl px-3 py-2.5 border border-[#3f4147] focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#b5bac1] mb-1">
                  Categoria
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#1e1f22] text-white text-xs rounded-xl px-3 py-2.5 border border-[#3f4147] focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
                >
                  <option value="convivencia">Convivência & Caos</option>
                  <option value="hierarquia">Hierarquia & Poder</option>
                  <option value="calls">Calls & Voz</option>
                  <option value="shitpost">Shitpost & Zueira</option>
                  <option value="seguranca">Segurança & Dox</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#b5bac1] mb-1">
                  Descrição Cômica e Contexto da Panelinha
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explique o motivo absurdo pelo qual esta regra existe..."
                  className="w-full bg-[#1e1f22] text-white text-xs rounded-xl px-3 py-2 border border-[#3f4147] focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#b5bac1] mb-1">
                  Punição / Castigo Moral
                </label>
                <input
                  type="text"
                  required
                  value={newPunishment}
                  onChange={(e) => setNewPunishment(e.target.value)}
                  placeholder="Ex: Mute de 48h e banho de água fria no AFK"
                  className="w-full bg-[#1e1f22] text-white text-xs rounded-xl px-3 py-2.5 border border-[#3f4147] focus:outline-none focus:ring-1 focus:ring-[#5865F2]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#949ba4] hover:text-white hover:bg-[#35373c] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-lg shadow-[#5865F2]/20 transition-all"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

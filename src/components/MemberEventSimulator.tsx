import React, { useState } from 'react';
import { UserPlus, UserMinus, Sparkles, Send, Check, ShieldAlert, Image, Dice5 } from 'lucide-react';
import { DiscordEmbedView } from './DiscordEmbedView';

interface MemberEventSimulatorProps {
  onTriggerEvent: (type: 'join' | 'leave', username: string, avatarUrl: string) => void;
  isExecuting?: boolean;
}

export const MemberEventSimulator: React.FC<MemberEventSimulatorProps> = ({
  onTriggerEvent,
  isExecuting
}) => {
  const [targetName, setTargetName] = useState('Kapeta_666');
  const [avatarSeed, setAvatarSeed] = useState('kapeta_seed');
  const [eventType, setEventType] = useState<'join' | 'leave'>('join');

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  const randomizeUser = () => {
    const randomSeeds = ['kapeta_alpha', 'beta_choroso', 'doido_da_call', 'troldog', 'ze_panela', 'cyber_doggo'];
    const randomNames = ['Kapeta_666', 'Beta_Desesperado', 'Alfa_Noturno', 'Shitposter_Pro', 'Viciado_em_GF', 'Membro_X'];
    const rIdx = Math.floor(Math.random() * randomSeeds.length);
    setAvatarSeed(randomSeeds[rIdx]);
    setTargetName(randomNames[rIdx]);
  };

  const previewEmbed =
    eventType === 'join'
      ? {
          title: '🔥 BEM-VINDO, KAPETA!',
          description: `Mais um doido entrou na panelinha! <@${targetName}> acabou de brotar nos portões do servidor.`,
          color: '#2ECC71',
          thumbnail: { url: avatarUrl },
          fields: [
            {
              name: '📜 Regras da Casa',
              value: 'Vá agora em <#regras> ler o regulamento antes de fazer besteira.',
              inline: true
            },
            {
              name: '🏷️ Plaquinhas no Fórum',
              value: 'Acesse o canal de fórum <#plaquinhas> para resgatar sua insígnia.',
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
          description: `O fdpt <@${targetName}> não aguentou a pressão e vazou do servidor. Espero que o diabo coma seu cu!`,
          color: '#ED4245',
          thumbnail: { url: avatarUrl },
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

  const handleSend = () => {
    onTriggerEvent(eventType, targetName, avatarUrl);
  };

  return (
    <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#35373c]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2ECC71]" />
            <h2 className="text-lg font-bold text-white">Sistema de Entrada & Saída Personalizado</h2>
          </div>
          <p className="text-xs text-[#949ba4] mt-0.5">
            Logs automatizados nos canais <code className="text-white font-mono">・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮</code> e{' '}
            <code className="text-white font-mono">・ 𝘀𝗮𝗶𝗻𝗱𝗼</code> com foto de perfil e mensagens zoadas.
          </p>
        </div>

        <button
          type="button"
          onClick={randomizeUser}
          className="px-3 py-1.5 bg-[#1e1f22] hover:bg-[#35373c] text-white text-xs font-semibold rounded-xl border border-[#3f4147] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Dice5 className="w-3.5 h-3.5 text-[#5865F2]" />
          <span>Sortear Usuário</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
              Tipo de Evento:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEventType('join')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  eventType === 'join'
                    ? 'bg-[#2ECC71]/15 border-[#2ECC71] text-white ring-1 ring-[#2ECC71]'
                    : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] hover:bg-[#2e3035]'
                }`}
              >
                <div className="p-2 rounded-lg bg-[#2ECC71]/20 text-[#2ECC71]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Entrada no Servidor</div>
                  <div className="text-[10px] text-[#949ba4]">"Bem-vindo, kapeta!"</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setEventType('leave')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  eventType === 'leave'
                    ? 'bg-[#ED4245]/15 border-[#ED4245] text-white ring-1 ring-[#ED4245]'
                    : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] hover:bg-[#2e3035]'
                }`}
              >
                <div className="p-2 rounded-lg bg-[#ED4245]/20 text-[#ED4245]">
                  <UserMinus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Saída do Servidor</div>
                  <div className="text-[10px] text-[#949ba4]">"O fdpt saiu..."</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-1">
              Nome do Usuário:
            </label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="Ex: Kapeta_666 ou Beta_Choroso"
              className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
            />
          </div>

          {/* User profile picture preview */}
          <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428] flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={targetName}
              className="w-12 h-12 rounded-full bg-[#2b2d31] ring-2 ring-[#5865F2]"
            />
            <div className="text-xs">
              <div className="font-bold text-white">{targetName}</div>
              <div className="text-[11px] text-[#949ba4]">Foto de perfil gerada via Discord Avatar API</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={isExecuting}
            className={`w-full py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              eventType === 'join'
                ? 'bg-[#2ECC71] hover:bg-[#25a25a] shadow-[#2ECC71]/20'
                : 'bg-[#ED4245] hover:bg-[#c0392b] shadow-[#ED4245]/20'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {eventType === 'join'
                ? 'Disparar Boas-Vindas em ・ 𝗲𝗻𝘁𝗿𝗮𝗱𝗮'
                : 'Disparar Saída em ・ 𝘀𝗮𝗶𝗻𝗱𝗼'}
            </span>
          </button>
        </div>

        {/* Live Embed Preview */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block">
            Pré-visualização do Embed que será enviado:
          </label>
          <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428]">
            <DiscordEmbedView embed={previewEmbed} />
          </div>
        </div>
      </div>
    </div>
  );
};

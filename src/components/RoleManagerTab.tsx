import React, { useState } from 'react';
import { Shield, Users, Plus, Check, Trash2, Edit3, Lock, Sparkles } from 'lucide-react';
import { DiscordRole } from '../types/discord';

interface RoleManagerTabProps {
  roles: DiscordRole[];
  onUpdateRoles: (newRoles: DiscordRole[]) => void;
}

export const RoleManagerTab: React.FC<RoleManagerTabProps> = ({ roles, onUpdateRoles }) => {
  const [selectedRole, setSelectedRole] = useState<DiscordRole>(roles[0] || {} as DiscordRole);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#5865F2');

  const handleColorChange = (roleId: string, newColor: string) => {
    const updated = roles.map((r) => (r.id === roleId ? { ...r, color: newColor } : r));
    onUpdateRoles(updated);
    if (selectedRole.id === roleId) {
      setSelectedRole({ ...selectedRole, color: newColor });
    }
  };

  const handleToggleHoist = (roleId: string) => {
    const updated = roles.map((r) => (r.id === roleId ? { ...r, hoist: !r.hoist } : r));
    onUpdateRoles(updated);
    if (selectedRole.id === roleId) {
      setSelectedRole({ ...selectedRole, hoist: !selectedRole.hoist });
    }
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    const newRole: DiscordRole = {
      id: `role_${Date.now()}`,
      name: newRoleName,
      color: newRoleColor,
      position: roles.length + 1,
      permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
      hoist: true,
      mentionable: true,
      memberCount: 0
    };
    const updated = [newRole, ...roles];
    onUpdateRoles(updated);
    setSelectedRole(newRole);
    setNewRoleName('');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#5865F2]" />
            <h2 className="text-xl font-bold text-white">Hierarquia de Cargos</h2>
            <span className="text-xs bg-[#5865F2]/20 text-[#5865F2] font-mono px-2 py-0.5 rounded">
              {roles.length} Cargos Ativos
            </span>
          </div>
          <p className="text-xs text-[#949ba4] mt-1">
            Configuração de permissões e cores para Dono, Sub Dono, Deuses, Moderadores, Alfas, Betas, Divulgador e Membro.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Cargo</span>
        </button>
      </div>

      {/* Main Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Roles list */}
        <div className="md:col-span-1 bg-[#2b2d31] border border-[#232428] rounded-2xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
          <div className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Ordem de Hierarquia</span>
            <span className="text-[10px] text-[#949ba4]">Maior Prioridade ↑</span>
          </div>

          {roles.map((role, idx) => {
            const isSelected = selectedRole?.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#35373c] border-[#5865F2] ring-1 ring-[#5865F2]'
                    : 'bg-[#1e1f22] border-[#232428] hover:bg-[#2b2d31]'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: role.color }}
                  />
                  <span
                    className="font-bold text-xs truncate"
                    style={{ color: role.color }}
                  >
                    {role.name}
                  </span>
                </div>
                <div className="text-[11px] text-[#949ba4] font-mono shrink-0">
                  {role.memberCount} membros
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Role Details & Permissions */}
        <div className="md:col-span-2 bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 space-y-6">
          {selectedRole ? (
            <>
              {/* Role Header Info */}
              <div className="flex items-center justify-between pb-4 border-b border-[#35373c]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full shadow-md"
                    style={{ backgroundColor: selectedRole.color }}
                  />
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: selectedRole.color }}
                    >
                      {selectedRole.name}
                    </h3>
                    <div className="text-xs text-[#949ba4]">
                      ID: {selectedRole.id} · Posição #{selectedRole.position}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedRole.color}
                    onChange={(e) => handleColorChange(selectedRole.id, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Mudar Cor do Cargo"
                  />
                </div>
              </div>

              {/* Quick Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Exibir Separadamente</div>
                    <div className="text-[11px] text-[#949ba4]">
                      Destacar membros deste cargo na barra lateral
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedRole.hoist}
                    onChange={() => handleToggleHoist(selectedRole.id)}
                    className="rounded bg-[#2b2d31] border-[#3f4147] text-[#5865F2] focus:ring-[#5865F2]"
                  />
                </div>

                <div className="p-3 bg-[#1e1f22] rounded-xl border border-[#232428] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Membros Atribuídos</div>
                    <div className="text-[11px] text-[#949ba4]">
                      Contagem no servidor atual
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-white bg-[#2b2d31] px-2.5 py-1 rounded-md">
                    {selectedRole.memberCount}
                  </span>
                </div>
              </div>

              {/* Permissions list */}
              <div>
                <label className="text-xs font-bold text-[#b5bac1] uppercase tracking-wider block mb-2">
                  Permissões Ativas deste Cargo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'ADMINISTRATOR', label: '👑 Administrador Total' },
                    { key: 'MANAGE_GUILD', label: '⚙️ Gerenciar Servidor' },
                    { key: 'MANAGE_ROLES', label: '🛡️ Gerenciar Cargos' },
                    { key: 'MANAGE_CHANNELS', label: '📁 Gerenciar Canais' },
                    { key: 'BAN_MEMBERS', label: '🔨 Banir Membros' },
                    { key: 'KICK_MEMBERS', label: '👢 Expulsar Membros' },
                    { key: 'MANAGE_MESSAGES', label: '🧹 Limpar e Gerenciar Mensagens' },
                    { key: 'PRIORITY_SPEAKER', label: '📢 Voz Prioritária' },
                    { key: 'MOVE_MEMBERS', label: '🔀 Mover Membros em Calls' },
                    { key: 'SEND_MESSAGES', label: '💬 Enviar Mensagens' },
                    { key: 'CONNECT', label: '🔊 Conectar em Calls' }
                  ].map((perm) => {
                    const hasPerm =
                      selectedRole.permissions?.includes('ADMINISTRATOR') ||
                      selectedRole.permissions?.includes(perm.key);

                    return (
                      <div
                        key={perm.key}
                        className={`flex items-center justify-between p-2.5 rounded-xl border ${
                          hasPerm
                            ? 'bg-[#23a55a]/10 border-[#23a55a]/30 text-white'
                            : 'bg-[#1e1f22] border-[#232428] text-[#949ba4] opacity-50'
                        }`}
                      >
                        <span className="font-medium truncate">{perm.label}</span>
                        {hasPerm && <Check className="w-3.5 h-3.5 text-[#23a55a] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-[#949ba4]">
              Selecione um cargo à esquerda para visualizar suas propriedades.
            </div>
          )}
        </div>
      </div>

      {/* Modal to add role */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#2b2d31] border border-[#232428] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Criar Novo Cargo Paneleiro</h3>
            <div>
              <label className="text-xs text-[#b5bac1] block mb-1">Nome do Cargo</label>
              <input
                type="text"
                placeholder="Ex: 👑 IMPERADOR ou 🚀 VIP"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>
            <div>
              <label className="text-xs text-[#b5bac1] block mb-1">Cor do Cargo</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newRoleColor}
                  onChange={(e) => setNewRoleColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-white">{newRoleColor}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-[#1e1f22] text-[#949ba4] hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddRole}
                className="px-5 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold"
              >
                Salvar Cargo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

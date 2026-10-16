import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Pin,
  ThumbsUp,
  Tag,
  Search,
  Filter,
  Check,
  Send,
  Sparkles
} from 'lucide-react';
import { DiscordForumPost } from '../types/discord';
import { FORUM_SAMPLE_POSTS } from '../data/templates';

interface DiscordForumViewProps {
  channelName: string;
}

export const DiscordForumView: React.FC<DiscordForumViewProps> = ({ channelName }) => {
  const [posts, setPosts] = useState<DiscordForumPost[]>(FORUM_SAMPLE_POSTS);
  const [selectedTag, setSelectedTag] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('PEDIDOS');

  const tagsList = ['TODOS', 'OFICIAL', 'ALFAS', 'DEUSES', 'PEDIDOS', 'GF', 'ZUEIRA'];

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === 'TODOS' || post.tags.includes(selectedTag);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost: DiscordForumPost = {
      id: `post_${Date.now()}`,
      title: newTitle,
      author: {
        name: 'Dog_Fundador',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dono_dog',
        roleColor: '#FEE75C',
        roleName: 'DONO'
      },
      content: newContent || 'Solicito minha plaquinha no servidor.',
      tags: [newTag],
      replyCount: 0,
      upvotes: 1,
      createdAt: 'Agora mesmo',
      pinned: false
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsCreatingPost(false);
  };

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#313338] overflow-y-auto p-4 space-y-4">
      {/* Forum Channel Header */}
      <div className="bg-[#2b2d31] p-5 rounded-2xl border border-[#232428] space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Fórum Oficial: {channelName}</h3>
                <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] font-mono px-2 py-0.5 rounded font-bold">
                  FORUM CHANNEL
                </span>
              </div>
              <p className="text-xs text-[#949ba4] mt-0.5">
                Crie postagens para solicitar plaquinhas personalizadas, insígnias de Alfas e títulos na panelinha.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-md shadow-[#5865F2]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Post / Pedido</span>
          </button>
        </div>

        {/* Tag Filters & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#35373c]">
          <div className="flex flex-wrap items-center gap-1.5">
            {tagsList.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-[#5865F2] text-white font-bold'
                    : 'bg-[#1e1f22] text-[#949ba4] hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-48">
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-[#80848e] focus:outline-none focus:border-[#5865F2]"
            />
            <Search className="w-3.5 h-3.5 text-[#80848e] absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* New Post Modal/Form */}
      {isCreatingPost && (
        <form
          onSubmit={handleCreatePost}
          className="bg-[#2b2d31] p-4 rounded-2xl border border-[#5865F2] space-y-3 shadow-lg"
        >
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5865F2]" />
            <span>Criar Solicitação de Plaquinha no Fórum</span>
          </div>

          <div>
            <label className="text-[11px] text-[#949ba4] block mb-1">Título do Post</label>
            <input
              type="text"
              placeholder="Ex: [PEDIDO] Plaquinha de Alfa Nato para Dog_Fundador"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#949ba4] block mb-1">Tag do Post</label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
              >
                <option value="PEDIDOS">PEDIDOS</option>
                <option value="ALFAS">ALFAS</option>
                <option value="DEUSES">DEUSES</option>
                <option value="GF">GF</option>
                <option value="ZUEIRA">ZUEIRA</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-[#949ba4] block mb-1">Mensagem ou Comprovação</label>
              <input
                type="text"
                placeholder="Ex: Ativo em todas as calls e no chat ・ 𝘀𝗺𝘀"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-[#1e1f22] border border-[#3f4147] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5865F2]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingPost(false)}
              className="px-3 py-1.5 rounded-xl bg-[#1e1f22] text-xs text-[#949ba4] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-semibold"
            >
              Publicar Post
            </button>
          </div>
        </form>
      )}

      {/* Forum Posts Grid */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-[#949ba4] text-xs">
            Nenhuma postagem encontrada para os filtros selecionados.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-[#2b2d31] hover:bg-[#35373c] border border-[#232428] hover:border-[#3f4147] rounded-2xl transition-all shadow-sm space-y-2 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {post.pinned && (
                    <span className="p-1 rounded bg-[#f0b232]/20 text-[#f0b232]" title="Tópico Fixado">
                      <Pin className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-white group-hover:text-[#5865F2] transition-colors">
                    {post.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1e1f22] text-[#5865F2] border border-[#5865F2]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#b5bac1] line-clamp-2 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#35373c]/50 text-xs text-[#949ba4]">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span
                    className="font-medium"
                    style={{ color: post.author.roleColor || '#ffffff' }}
                  >
                    {post.author.name}
                  </span>
                  <span>•</span>
                  <span>{post.createdAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(post.id);
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{post.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{post.replyCount} respostas</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

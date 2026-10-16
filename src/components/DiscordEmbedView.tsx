import React from 'react';
import { DiscordEmbed } from '../types/discord';

interface DiscordEmbedViewProps {
  embed: DiscordEmbed;
}

export const DiscordEmbedView: React.FC<DiscordEmbedViewProps> = ({ embed }) => {
  const color = embed.color || '#5865F2';

  // Format simple Discord markdown like <#channel> or **bold**
  const renderFormattedText = (text: string) => {
    // Simple parser for bold **text** and mentions
    const parts = text.split(/(\*\*.*?\*\*|<#.*?>)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('<#') && part.endsWith('>')) {
        const channelName = part.slice(2, -1);
        return (
          <span
            key={index}
            className="bg-[#5865F2]/20 hover:bg-[#5865F2]/40 text-[#c9cdfb] px-1 py-0.5 rounded cursor-pointer transition-colors"
          >
            #{channelName}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className="max-w-2xl bg-[#2b2d31] rounded border-l-4 p-4 my-1 text-sm text-[#dbdee1] shadow-md"
      style={{ borderLeftColor: color }}
    >
      {/* Author */}
      {embed.author && (
        <div className="flex items-center gap-2 mb-2">
          {embed.author.icon_url && (
            <img
              src={embed.author.icon_url}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span className="text-xs font-semibold text-white">
            {embed.author.name}
          </span>
        </div>
      )}

      {/* Title & Thumbnail Split */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {embed.title && (
            <h4 className="text-base font-bold text-white mb-2 leading-tight">
              {embed.title}
            </h4>
          )}
          {embed.description && (
            <div className="text-sm text-[#dbdee1] leading-relaxed whitespace-pre-line mb-3">
              {renderFormattedText(embed.description)}
            </div>
          )}
        </div>

        {embed.thumbnail?.url && (
          <div className="shrink-0 w-16 h-16 rounded overflow-hidden bg-[#1e1f22]">
            <img
              src={embed.thumbnail.url}
              alt="Embed Thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Fields */}
      {embed.fields && embed.fields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-2 border-t border-[#35373c]">
          {embed.fields.map((field, idx) => (
            <div
              key={idx}
              className={`${field.inline ? 'col-span-1' : 'col-span-1 md:col-span-2'} space-y-1`}
            >
              <div className="text-xs font-bold text-white">
                {field.name}
              </div>
              <div className="text-xs text-[#b5bac1] leading-relaxed">
                {renderFormattedText(field.value)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image if any */}
      {embed.image?.url && (
        <div className="mt-3 rounded overflow-hidden">
          <img src={embed.image.url} alt="" className="max-w-full rounded" />
        </div>
      )}

      {/* Footer */}
      {(embed.footer || embed.timestamp) && (
        <div className="flex items-center gap-2 mt-3 pt-2 text-[11px] text-[#949ba4]">
          {embed.footer?.icon_url && (
            <img
              src={embed.footer.icon_url}
              alt=""
              className="w-4 h-4 rounded-full object-cover"
            />
          )}
          <span>{embed.footer?.text}</span>
          {embed.footer && embed.timestamp && <span>•</span>}
          {embed.timestamp && (
            <span>
              {new Date(embed.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

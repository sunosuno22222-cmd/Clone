export interface DiscordRole {
  id: string;
  name: string;
  color: string;
  position: number;
  permissions: string[];
  hoist: boolean; // Display role members separately
  mentionable: boolean;
  memberCount: number;
  icon?: string;
}

export interface DiscordForumPost {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    roleColor?: string;
    roleName?: string;
  };
  content: string;
  tags: string[];
  replyCount: number;
  upvotes: number;
  createdAt: string;
  pinned?: boolean;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'category' | 'announcement' | 'forum';
  parentId?: string;
  position: number;
  topic?: string;
  userLimit?: number;
  isNsfw?: boolean;
  readOnly?: boolean;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: string;
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  fields?: DiscordEmbedField[];
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export interface DiscordMessage {
  id: string;
  channelId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    bot?: boolean;
    roleColor?: string;
    roleName?: string;
  };
  content?: string;
  embeds?: DiscordEmbed[];
  timestamp: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  ownerId: string;
  memberCount: number;
  onlineCount: number;
  channels: DiscordChannel[];
  roles: DiscordRole[];
  botConnected: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  categories: {
    name: string;
    channels: {
      name: string;
      type: 'text' | 'voice' | 'announcement' | 'forum';
      topic?: string;
      userLimit?: number;
      readOnly?: boolean;
    }[];
  }[];
  roles: {
    name: string;
    color: string;
    hoist: boolean;
    permissions: string[];
  }[];
  initialMessages: {
    channelMatch: string; // e.g. "regras", "entrada", "saindo", "buscar-ip"
    embed: DiscordEmbed;
  }[];
}

import {
  AudioLines,
  BookOpen,
  Brush,
  Clapperboard,
  Cloud,
  FileLock,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Image,
  KeyRound,
  Mail,
  MonitorPlay,
  Palette,
  PanelsTopLeft,
  PenTool,
  Presentation,
  Quote,
  RefreshCw,
  ShieldCheck,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import type { CategoryId, Tool } from '../types/library'

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  documents: FileText,
  enseigner: GraduationCap,
  collaborer: Users,
  partager: FolderOpen,
  creer: Palette,
  proteger: ShieldCheck,
}

/** One binding colour per shelf. Ivory text on the dark ones, forest text on gold. */
const bindings: Record<CategoryId, { cover: string; text: string }> = {
  documents: { cover: '#1b3a32', text: '#f9f8f3' },
  enseigner: { cover: '#1f6249', text: '#f9f8f3' },
  collaborer: { cover: '#8c5538', text: '#f9f8f3' },
  partager: { cover: '#38453f', text: '#f9f8f3' },
  creer: { cover: '#d6a85f', text: '#142d27' },
  proteger: { cover: '#336f58', text: '#f9f8f3' },
}

/** Our own visual identity for each tool: no official logo is reproduced. */
const toolIcons: Record<string, LucideIcon> = {
  libreoffice: FileText,
  cryptpad: FileLock,
  zotero: Quote,
  moodle: GraduationCap,
  kolibri: BookOpen,
  bigbluebutton: Presentation,
  jitsi: Video,
  thunderbird: Mail,
  nextcloud: Cloud,
  syncthing: RefreshCw,
  peertube: Clapperboard,
  wordpress: PanelsTopLeft,
  gimp: Image,
  inkscape: PenTool,
  krita: Brush,
  audacity: AudioLines,
  obs: MonitorPlay,
  firefox: Globe,
  keepassxc: KeyRound,
  ublock: ShieldCheck,
}

/** Each tool is a book on the Library's shelves, bound in the colour of its main category. */
export function ToolCover({ tool, size = 'md' }: { tool: Tool; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = toolIcons[tool.id] ?? BookOpen
  const { cover, text } = bindings[tool.categories[0]]
  const dimensions = { sm: 'h-24 w-17 p-2.5', md: 'h-32 w-23 p-3', lg: 'h-52 w-37 p-4' }[size]
  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 flex-col justify-between overflow-hidden rounded-l-[3px] rounded-r-lg pl-4 shadow-soft ${dimensions}`}
      style={{ background: cover, color: text }}
    >
      {/* Spine and its two gilded lines. */}
      <span className="absolute inset-y-0 left-0 w-2.5 bg-black/20" />
      <span className="absolute inset-y-0 left-3 w-px bg-white/15" />
      <Icon className={size === 'lg' ? 'size-9' : size === 'md' ? 'size-6' : 'size-5'} strokeWidth={1.6} />
      {/* Small covers sit next to the name already. */}
      {size !== 'sm' && (
        <span className={`font-display leading-tight break-words ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>{tool.name}</span>
      )}
    </span>
  )
}

/** A shelf drawn from the real catalogue: one spine per tool of the category. */
export function Shelf({ category, tools }: { category: CategoryId; tools: readonly Tool[] }) {
  const { cover } = bindings[category]
  const heights = [100, 84, 94, 76, 90, 80, 96]
  return (
    <span aria-hidden="true" className="flex h-20 items-end gap-1 border-b-4 border-forest-900/15 px-2">
      {tools.map((tool, index) => (
        <span
          key={tool.id}
          className="w-5 rounded-t-[3px] transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            height: `${heights[index % heights.length]}%`,
            background: cover,
            opacity: 1 - (index % 3) * 0.18,
            transitionDelay: `${index * 30}ms`,
          }}
        />
      ))}
    </span>
  )
}

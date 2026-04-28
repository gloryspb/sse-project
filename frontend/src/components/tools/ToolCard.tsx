import type { ToolDefinition } from '@/types/tools';

interface ToolCardProps {
  tool: ToolDefinition;
  onClick: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6 text-left transition-all duration-200 hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-black/5"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${tool.accentColor}20` }}
      >
        <Icon className="h-6 w-6" style={{ color: tool.accentColor }} />
      </div>

      <div className="flex-1">
        <h3 className="mb-1 text-foreground">{tool.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      </div>

      <div className="flex items-center gap-2 text-sm" style={{ color: tool.accentColor }}>
        Open
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

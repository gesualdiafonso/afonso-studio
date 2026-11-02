import { Cloud, Database, Monitor, PenTool, Server, Workflow, type LucideProps } from "lucide-react";
import type { TechCategoryId } from "@/content/technology";

const map = {
  frontend: Monitor,
  backend: Server,
  databases: Database,
  infrastructure: Cloud,
  automation: Workflow,
  design: PenTool,
} as const;

export function CategoryIcon({ id, ...props }: { id: TechCategoryId } & LucideProps) {
  const Icon = map[id];
  return <Icon strokeWidth={1.6} aria-hidden {...props} />;
}

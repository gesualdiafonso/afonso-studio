import {
  Building2,
  Cpu,
  FolderKanban,
  GitBranch,
  House,
  Layers,
  Lightbulb,
  MessageSquare,
  Puzzle,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { NavigationIcon as IconKey } from "@/config/navigation";

/** Icon for each navigation icon key (src/config/navigation.ts). */
const icons: Record<IconKey, LucideIcon> = {
  home: House,
  philosophy: Lightbulb,
  services: Layers,
  projects: FolderKanban,
  solutions: Puzzle,
  process: GitBranch,
  technology: Cpu,
  studio: Building2,
  contact: MessageSquare,
};

export function NavigationIcon({ icon, ...props }: { icon?: IconKey } & LucideProps) {
  const Icon = icons[icon ?? "home"];
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}

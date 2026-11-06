import {
  Activity, Bot, Calendar, Check, Clock, DoorOpen, Droplet, FileText, FlaskConical, Hand, Key,
  Lock, LogIn, RefreshCw, ScanLine, Server, Shield, Snowflake, Syringe, ThermometerSun, Users,
  Wrench, ScrollText, Globe, Cloud, Cpu, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  activity: Activity, bot: Bot, calendar: Calendar, check: Check, clock: Clock, door: DoorOpen,
  droplet: Droplet, file: FileText, flask: FlaskConical, hand: Hand, key: Key, lock: Lock,
  login: LogIn, refresh: RefreshCw, scan: ScanLine, server: Server, shield: Shield,
  snowflake: Snowflake, syringe: Syringe, thermometer: ThermometerSun, users: Users,
  wrench: Wrench, log: ScrollText, globe: Globe, cloud: Cloud, cpu: Cpu,
};

export const Icon: React.FC<{ name: string; size?: number; color?: string; strokeWidth?: number }> = ({
  name,
  size = 48,
  color = "currentColor",
  strokeWidth = 1.75,
}) => {
  const Cmp = ICONS[name];
  if (!Cmp) throw new Error(`Unknown icon "${name}". Add it to src/components/Icon.tsx.`);
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
};

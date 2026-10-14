import { uniqueId } from "lodash";
import {
  Bell,
  ChartColumn,
  House,
  KeyRound,
  LucideIcon,
  Package,
  Wallet,
} from "lucide-react";

export interface ChildItem {
  id?: number | string;
  name: string;
  icon?: LucideIcon;
  items?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  badgeContent?: string;
  isActive?: boolean;
  external?: boolean;
  isPro?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: LucideIcon;
  id?: number;
  to?: string;
  item?: MenuItem[];
  items?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  badgeContent?: string;
  isActive?: boolean;
  isPro?: boolean;
}

/** Single seller role for Pricing panel. */
export type PanelRole = "seller";

/** Seller primary nav (Pricing Phase 1). */
export const sellerNav: MenuItem[] = [
  {
    heading: "فروشگاه",
    items: [
      {
        id: uniqueId(),
        name: "خانه",
        icon: House,
        url: "/",
      },
      {
        id: uniqueId(),
        name: "محصولات و رقبا",
        icon: Package,
        url: "/products",
      },
      {
        id: uniqueId(),
        name: "هزینه‌ها",
        icon: Wallet,
        url: "/costs",
      },
      {
        id: uniqueId(),
        name: "گزارش‌ها",
        icon: ChartColumn,
        url: "/reports",
      },
      {
        id: uniqueId(),
        name: "کلید API",
        icon: KeyRound,
        url: "/api-keys",
      },
      {
        id: uniqueId(),
        name: "هشدارها",
        icon: Bell,
        url: "/alerts",
      },
    ],
  },
];

export function getNavForRole(_role?: PanelRole | string | null) {
  void _role
  return sellerNav
}

const SidebarContent: MenuItem[] = sellerNav;

export default SidebarContent;

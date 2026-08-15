import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  MessageCircle,
  Settings,
  Users,
  ChartColumn,
  ArrowUpDown,
  Box,
  type LucideIcon,
} from "lucide-react";

import { UserRole } from "@prisma/client";

export type SidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  roles?: UserRole[];
};

export const sidebarSections: {
  title: string;
  items: SidebarItem[];
}[] = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.STAFF,
        ],
      },

      {
        title: "Products",
        href: "/admin/dashboard/products",
        icon: Package,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.STAFF,
        ],
      },

      {
        title: "Orders",
        href: "/admin/dashboard/orders",
        icon: ShoppingBag,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.STAFF,
        ],
      },

      {
        title: "Brands",
        href: "/admin/dashboard/brands",
        icon: Tag,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
        ],
      },

      {
        title: "Categories",
        href: "/admin/dashboard/categories",
        icon: FolderTree,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
        ],
      },

      {
        title: "Packaging",
        href: "/admin/dashboard/packaging",
        icon: Box,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
        ],
      },

      {
        title: "Product Sorting",
        href: "/admin/dashboard/products/sort",
        icon: ArrowUpDown,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.STAFF,
        ],
      },
    ],
  },

  {
    title: "CRM",
    items: [
      {
        title: "Inquiries",
        href: "/admin/dashboard/inquiries",
        icon: MessageCircle,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
          UserRole.MANAGER,
          UserRole.STAFF,
        ],
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        title: "Users",
        href: "/admin/dashboard/users",
        icon: Users,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
        ],
      },

      {
        title: "Analytics",
        href: "/admin/dashboard/analytics",
        icon: ChartColumn,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
        ],
      },

      {
        title: "Settings",
        href: "/admin/dashboard/settings",
        icon: Settings,
        roles: [
          UserRole.OWNER,
          UserRole.ADMIN,
        ],
      },
    ],
  },
];
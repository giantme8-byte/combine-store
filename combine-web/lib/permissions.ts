import { UserRole } from "@prisma/client";

export const permissions = {
  canViewDashboard(role: UserRole) {
    return role !== UserRole.CUSTOMER;
  },

  canManageProducts(role: UserRole) {
    return role !== UserRole.CUSTOMER;
  },

  canDeleteProducts(role: UserRole) {
    return (
      role === UserRole.OWNER ||
      role === UserRole.MANAGER ||
      role === UserRole.ADMIN
    );
  },

  canManageBrands(role: UserRole) {
    return (
      role === UserRole.OWNER ||
      role === UserRole.MANAGER ||
      role === UserRole.ADMIN
    );
  },

  canManageCategories(role: UserRole) {
    return (
      role === UserRole.OWNER ||
      role === UserRole.MANAGER ||
      role === UserRole.ADMIN
    );
  },

  canManageSettings(role: UserRole) {
    return (
      role === UserRole.OWNER ||
      role === UserRole.ADMIN
    );
  },

  canManageUsers(role: UserRole) {
    return (
      role === UserRole.OWNER ||
      role === UserRole.ADMIN
    );
  },
};
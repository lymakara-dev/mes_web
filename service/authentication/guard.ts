// lib/guard.ts
type Role = 'admin' | 'editor' | 'viewer';

export const hasRole = (userRole: Role, allowed: Role[]): boolean => {
  return allowed.includes(userRole);
};

export const hasPermission = (permissions: string[], required: string): boolean => {
  return permissions.includes(required);
};

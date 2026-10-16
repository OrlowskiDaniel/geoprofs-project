export const ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
  ADMINISTRATOR: "administrator",
};

export const ROLE_LABELS = {
  [ROLES.EMPLOYEE]: "Employee",
  [ROLES.MANAGER]: "Manager",
  [ROLES.ADMINISTRATOR]: "Administrator",
};

export const PERMISSIONS = {
  VIEW_PERSONAL_DATA: "viewPersonalData",
  EDIT_PERSONAL_DATA: "editPersonalData",
  REQUEST_LEAVE: "requestLeave",
  VIEW_AUDIT_TRAIL: "viewAuditTrail",
  MANAGE_USERS: "manageUsers",
  ASSIGN_ROLES: "assignRoles",
};

const rolePermissions = {
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_PERSONAL_DATA,
    PERMISSIONS.EDIT_PERSONAL_DATA,
    PERMISSIONS.REQUEST_LEAVE,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_PERSONAL_DATA,
    PERMISSIONS.EDIT_PERSONAL_DATA,
    PERMISSIONS.REQUEST_LEAVE,
  ],
  [ROLES.ADMINISTRATOR]: [
    PERMISSIONS.VIEW_PERSONAL_DATA,
    PERMISSIONS.EDIT_PERSONAL_DATA,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_AUDIT_TRAIL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.ASSIGN_ROLES,
  ],
};

export function hasPermission(user, permission) {
  return (user?.roles ?? []).some((role) =>
    (rolePermissions[role] ?? []).includes(permission)
  );
}

export function hasValidRoles(roles) {
  const supportedRoles = Object.values(ROLES);

  return (
    Array.isArray(roles) &&
    roles.length > 0 &&
    roles.every((role) => supportedRoles.includes(role))
  );
}
export type AppRole = "admin" | "employee" | "intern";

/** Where each kind of user lands after login. */
export const homePath = (role?: string | null): string => {
  switch (role) {
    case "admin":
      return "/crm/dashboard";
    case "employee":
      return "/employee";
    case "intern":
      return "/intern";
    default:
      return "/account";
  }
};

/** Pick the highest role from a list of role rows. */
export const pickRole = (roles: { role: string }[] | null | undefined): AppRole | null => {
  if (!roles?.length) return null;
  if (roles.some((r) => r.role === "admin")) return "admin";
  if (roles.some((r) => r.role === "employee")) return "employee";
  if (roles.some((r) => r.role === "intern")) return "intern";
  return null;
};

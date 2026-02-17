const { user, role } = useAuth();

console.log("USER:", user?.email);
console.log("ROLE:", role);

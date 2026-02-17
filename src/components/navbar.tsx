const { user, role } = useAuth();
{role === "admin" && (
  <DropdownItem onClick={() => navigate("/admin")}>
    Admin Dashboard
  </DropdownItem>
)}

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Trash2, Users } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all their data?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <div className="page-wrapper" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper" style={{ padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="dash-header fade-in" style={{ marginBottom: "2rem" }}>
          <h1 className="section-title">
            <ShieldCheck size={32} style={{ display: "inline", verticalAlign: "middle", color: "var(--color-primary)" }} /> Admin Portal
          </h1>
          <p className="section-subtitle">Manage Farmers and Platform Statistics</p>
        </div>

        <div className="glass-card dash-section fade-in">
          <h2 className="dash-section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={20} /> Registered Farmers ({users.length})
          </h2>
          
          {users.length === 0 ? (
            <p className="empty-text">No farmers registered yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <th style={{ padding: "12px" }}>Name</th>
                    <th style={{ padding: "12px" }}>Email</th>
                    <th style={{ padding: "12px" }}>Role</th>
                    <th style={{ padding: "12px" }}>Joined</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: "12px" }}>{u.email}</td>
                      <td style={{ padding: "12px" }}>
                        <span className="badge badge-success">{u.role}</span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--color-text-dim)" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button 
                          onClick={() => handleDelete(u._id)}
                          style={{
                            background: "transparent", border: "none", color: "var(--color-warning)", cursor: "pointer", padding: "4px"
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

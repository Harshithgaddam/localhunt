import React, { useEffect, useState } from "react";
import api from '../../api';
import "./Settings.css";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
          confirmPassword: "",
        });
      }).catch((err) => {
        console.error("Failed to load user data:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage("❌ Passwords do not match!");
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        "/api/auth/update",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Account updated successfully!");
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2>⚙️ Account Settings</h2>
        <p>Manage your account details, preferences, and password.</p>

        <form onSubmit={handleSubmit} className="settings-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message && <p className="status-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Settings;

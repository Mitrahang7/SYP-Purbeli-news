import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { loginUser } from "../services/auth";
import { toast } from 'react-hot-toast';
import "../styles/Login.css";

export default function Login({ onSuccess }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(formData);
      toast.success("Successfully logged in!");
      if (onSuccess) onSuccess(); // 🔥 close modal + update app state
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(" ")
        : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-form__error">{error}</div>}

      <div className="auth-form__field">
        <User className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-form__field">
        <Lock className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? (
          <span className="auth-form__spinner" />
        ) : (
          <>
            Sign In <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
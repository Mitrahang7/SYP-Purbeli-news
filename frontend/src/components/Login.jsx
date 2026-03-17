import React, { useState } from "react";
import axios from "axios";
import { User, Lock, ArrowRight } from "lucide-react";
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
      const res = await axios.post("http://26.4.110.75:8000/api/login/", formData);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(" ")
        : "Cannot connect to server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>

      {error && (
        <div className="auth-form__error">{error}</div>
      )}

      <div className="auth-form__field">
        <User className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
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
          onChange={handleChange}
          value={formData.password}
          required
        />
      </div>

      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? (
          <span className="auth-form__spinner" />
        ) : (
          <>
            Sign In
            <ArrowRight size={18} className="auth-form__arrow" />
          </>
        )}
      </button>

    </form>
  );
}
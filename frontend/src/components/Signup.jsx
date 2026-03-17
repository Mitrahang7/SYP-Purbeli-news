import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, MapPin, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import "../styles/Signup.css";

export default function Signup({ onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    city: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://26.4.110.75:8000/api/register/", formData);
      console.log("User registered:", res.data);
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
        <Mail className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          value={formData.email}
          required
        />
      </div>

      <div className="auth-form__field">
        <MapPin className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          value={formData.city}
          required
        />
      </div>

      <div className="auth-form__field">
        <Phone className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
          value={formData.phone_number}
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

      <div className="auth-form__field">
        <ShieldCheck className="auth-form__icon" size={18} />
        <input
          className="auth-form__input"
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={formData.confirm_password}
          required
        />
      </div>

      <button className="auth-form__submit" type="submit" disabled={loading}>
        {loading ? (
          <span className="auth-form__spinner" />
        ) : (
          <>
            Create Account
            <ArrowRight size={18} className="auth-form__arrow" />
          </>
        )}
      </button>

    </form>
  );
}
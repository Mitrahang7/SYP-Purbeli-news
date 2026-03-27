import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

// LOGIN → JWT
export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE}/token/`, data);

  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);
  localStorage.setItem("is_staff", res.data.is_staff);
  localStorage.setItem("is_author", res.data.is_author);
  localStorage.setItem("username", res.data.username);

  return res.data;
};

// REGISTER
export const registerUser = async (data) => {
  return await axios.post(`${API_BASE}/register/`, data);
};

// GET TOKEN
export const getToken = () => {
  return localStorage.getItem("access_token");
};

// IS STAFF — check localStorage flag, then decode JWT payload
export const isStaff = () => {
  // If explicitly stored as "true", user is staff
  if (localStorage.getItem("is_staff") === "true") return true;

  // Always try to decode from JWT token (works for existing sessions)
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Django REST Simple JWT includes is_staff when embedded via get_token
    // is_superuser is also always available in Django's default user model
    return payload.is_staff === true || payload.is_superuser === true;
  } catch {
    return false;
  }
};

// IS AUTHOR — check localStorage flag, then decode JWT payload
export const isAuthor = () => {
  if (localStorage.getItem("is_author") === "true") return true;

  const token = localStorage.getItem("access_token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.is_author === true;
  } catch {
    return false;
  }
};

// GET USERNAME
export const getUsername = () => {
  return localStorage.getItem("username");
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("is_staff");
  localStorage.removeItem("is_author");
  localStorage.removeItem("username");
};
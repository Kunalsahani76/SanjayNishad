import { useState } from "react";
import api from "../api";

const pageText = {
  en: {
    admin: "Admin",
    login: "Login",
    email: "Email",
    password: "Password",
    failed: "Login failed",
  },
  hi: {
    admin: "एडमिन",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    failed: "लॉगिन असफल रहा",
  },
};

export default function Login({ language = "en" }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const text = pageText[language];

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/upload";
    } catch (error) {
      setMessage(error.response?.data?.message || text.failed);
    }
  };

  return (
    <section className="panel narrow">
      <div className="section-heading">
        <p>{text.admin}</p>
        <h1>{text.login}</h1>
      </div>

      <form className="form" onSubmit={submit}>
        <label>
          {text.email}
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          {text.password}
          <input name="password" type="password" value={form.password} onChange={update} required />
        </label>
        <button type="submit">{text.login}</button>
      </form>

      {message && <p className="status error">{message}</p>}
    </section>
  );
}

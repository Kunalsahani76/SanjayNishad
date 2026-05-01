import { useState } from "react";
import api from "../api";

const pageText = {
  en: {
    admin: "Admin",
    signup: "Signup",
    name: "Name",
    email: "Email",
    password: "Password",
    complete: "Signup complete. You can login now.",
    failed: "Signup failed",
  },
  hi: {
    admin: "एडमिन",
    signup: "साइन अप",
    name: "नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    complete: "साइन अप पूरा हुआ. अब आप लॉगिन कर सकते हैं.",
    failed: "साइन अप असफल रहा",
  },
};

export default function Signup({ language = "en" }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const text = pageText[language];

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/auth/signup", form);
      setMessage(text.complete);
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || text.failed);
    }
  };

  return (
    <section className="panel narrow">
      <div className="section-heading">
        <p>{text.admin}</p>
        <h1>{text.signup}</h1>
      </div>

      <form className="form" onSubmit={submit}>
        <label>
          {text.name}
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          {text.email}
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          {text.password}
          <input name="password" type="password" value={form.password} onChange={update} required />
        </label>
        <button type="submit">{text.signup}</button>
      </form>

      {message && <p className="status">{message}</p>}
    </section>
  );
}

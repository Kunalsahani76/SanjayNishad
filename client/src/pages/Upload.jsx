import { useState } from "react";
import api from "../api";

const pageText = {
  en: {
    heading: "Upload Your News",
    loginHint: "login to upload news video",
    emailPhone: "Email / Phone",
    password: "Password",
    forgot: "forgot password ?",
    upload: "Upload",
    title: "Title",
    description: "Description",
    mediaUrl: "Media URL",
    type: "Type",
    video: "Video",
    image: "Image",
    text: "Text",
    live: "Mark as live",
    uploaded: "News uploaded",
    loginFailed: "Login failed",
    uploadFailed: "Upload failed",
  },
  hi: {
    heading: "अपनी खबर अपलोड करें",
    loginHint: "समाचार वीडियो अपलोड करने के लिए लॉगिन करें",
    emailPhone: "ईमेल / फोन",
    password: "पासवर्ड",
    forgot: "पासवर्ड भूल गए?",
    upload: "अपलोड",
    title: "शीर्षक",
    description: "विवरण",
    mediaUrl: "मीडिया URL",
    type: "प्रकार",
    video: "वीडियो",
    image: "इमेज",
    text: "टेक्स्ट",
    live: "लाइव के रूप में मार्क करें",
    uploaded: "समाचार अपलोड हो गया",
    loginFailed: "लॉगिन असफल रहा",
    uploadFailed: "अपलोड असफल रहा",
  },
};

export default function Upload({ language = "en" }) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [form, setForm] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    type: "video",
    isLive: false,
  });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const text = pageText[language];

  const updateLogin = (event) => {
    setLoginForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post("/auth/login", loginForm);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || text.loginFailed);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/news", form);
      setForm({ title: "", description: "", mediaUrl: "", type: "video", isLive: false });
      setMessage(text.uploaded);
    } catch (error) {
      setMessage(error.response?.data?.message || text.uploadFailed);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="upload-page">
        <div className="upload-card">
          <h1>{text.heading}</h1>
          <form className="form login-form" onSubmit={login}>
            <div className="upload-icon" aria-hidden="true">▶</div>
            <h2>{text.loginHint}</h2>
            <label>
              {text.emailPhone}
              <input
                name="email"
                type="email"
                value={loginForm.email}
                onChange={updateLogin}
                placeholder="name@example.com"
                required
              />
            </label>
            <label>
              {text.password}
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={updateLogin}
                placeholder="........"
                required
              />
            </label>
            <a className="forgot-link" href="/login">{text.forgot}</a>
            <button type="submit">{text.upload}</button>
          </form>
          {message && <p className="status error">{message}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="upload-page">
      <div className="upload-card wide">
        <h1>{text.heading}</h1>

        <form className="form" onSubmit={submit}>
          <label>
            {text.title}
            <input name="title" value={form.title} onChange={update} required />
          </label>
          <label>
            {text.description}
            <textarea name="description" value={form.description} onChange={update} />
          </label>
          <label>
            {text.mediaUrl}
            <input name="mediaUrl" value={form.mediaUrl} onChange={update} placeholder="VIDEO_URL" />
          </label>
          <label>
            {text.type}
            <select name="type" value={form.type} onChange={update}>
              <option value="video">{text.video}</option>
              <option value="image">{text.image}</option>
              <option value="text">{text.text}</option>
            </select>
          </label>
          <label className="checkbox">
            <input name="isLive" type="checkbox" checked={form.isLive} onChange={update} />
            {text.live}
          </label>
          <button type="submit">{text.upload}</button>
        </form>

        {message && <p className="status">{message}</p>}
      </div>
    </section>
  );
}

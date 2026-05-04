import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Voting from "./pages/Voting";
import "./App.css";

const translations = {
  en: {
    languageLabel: "Language editions",
    date: "FRIDAY, 1 MAY, 2026",
    home: "Home",
    live: "Live",
    searchNews: "Search news",
    searchPlaceholder: "Search Video News, Topic,",
    quickActions: "Quick actions",
    voting: "VOTING",
    upload: "UPLOAD",
    login: "Login",
    aqi: "AQI",
    weatherLabel: "weather",
  },
  hi: {
    languageLabel: "भाषा संस्करण",
    date: "शुक्रवार, 1 मई, 2026",
    home: "होम",
    live: "लाइव",
    searchNews: "समाचार खोजें",
    searchPlaceholder: "वीडियो समाचार, विषय खोजें",
    quickActions: "त्वरित विकल्प",
    voting: "वोटिंग",
    upload: "अपलोड",
    login: "लॉगिन",
    aqi: "AQI",
    weatherLabel: "मौसम",
  },
};

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[language];
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  return (
    <>
      <header className={`app-header ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="top-header">
          <WeatherInfo language={language} labels={t} />

          <nav className="language-nav" aria-label={t.languageLabel}>
            <button
              className={language === "en" ? "active" : ""}
              type="button"
              onClick={() => setLanguage("en")}
            >
              ENGLISH
            </button>
            <button
              className={language === "hi" ? "active" : ""}
              type="button"
              onClick={() => setLanguage("hi")}
            >
              हिन्दी
            </button>
          </nav>

          <time className="today-date" dateTime="2026-05-01">{t.date}</time>

          <div className="top-actions">
            <a className="social-link facebook" href="#facebook" aria-label="Facebook">f</a>
            <a className="social-link instagram" href="#instagram" aria-label="Instagram">◎</a>
            <a className="social-link x-link" href="#x" aria-label="X">X</a>
            <a className="social-link whatsapp" href="#whatsapp" aria-label="WhatsApp">●</a>
            <a className="social-link youtube" href="#youtube" aria-label="YouTube">▶</a>
            <NavLink className="login-chip" to="/login">{t.login}</NavLink>
          </div>
        </div>

        <div className="main-header">
          <button
            className="hamburger-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>

          <NavLink className="brand" to="/" onClick={closeMenu}>BHARATNEWS</NavLink>

          <button
            className="mobile-language-button"
            type="button"
            onClick={() => setLanguage((current) => (current === "hi" ? "en" : "hi"))}
          >
            {language === "hi" ? "EN" : "हिंदी"}
          </button>

          <nav className="primary-nav" aria-label="Primary navigation">
            <NavLink to="/" onClick={closeMenu}>{t.home}</NavLink>
            <NavLink to="/voting" onClick={closeMenu}>{t.live}</NavLink>
          </nav>

          <form className="site-search" role="search">
            <button type="submit" aria-label={t.searchNews}>⌕</button>
            <input aria-label={t.searchNews} placeholder={t.searchPlaceholder} />
          </form>

          <nav className="action-nav" aria-label={t.quickActions}>
            <NavLink to="/voting" onClick={closeMenu}><span aria-hidden="true">▱</span> {t.voting}</NavLink>
            <NavLink to="/upload" onClick={closeMenu}><span aria-hidden="true">↥</span> {t.upload}</NavLink>
            <NavLink className="icon-link" to="/login" aria-label={t.login} onClick={closeMenu}>◎</NavLink>
          </nav>

          <div className="mobile-menu-panel">
            <WeatherInfo language={language} labels={t} />
            <time className="today-date" dateTime="2026-05-01">{t.date}</time>
            <div className="top-actions">
              <a className="social-link facebook" href="#facebook" aria-label="Facebook">f</a>
              <a className="social-link instagram" href="#instagram" aria-label="Instagram">◎</a>
              <a className="social-link x-link" href="#x" aria-label="X">X</a>
              <a className="social-link whatsapp" href="#whatsapp" aria-label="WhatsApp">●</a>
              <a className="social-link youtube" href="#youtube" aria-label="YouTube">▶</a>
              <NavLink className="login-chip" to="/login" onClick={closeMenu}>{t.login}</NavLink>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/voting" element={<Voting language={language} />} />
          <Route path="/upload" element={<Upload language={language} />} />
          <Route path="/login" element={<Login language={language} />} />
          <Route path="/signup" element={<Signup language={language} />} />
        </Routes>
      </main>
    </>
  );
}

function WeatherInfo({ labels }) {
  const [weather, setWeather] = useState({
    city: "Detecting location",
    temperature: null,
    aqi: null,
    status: "loading",
  });

  useEffect(() => {
    const fallbackLocation = {
      latitude: 19.076,
      longitude: 72.8777,
      city: "Mumbai",
    };

    const loadWeather = async ({ latitude, longitude, city: fallbackCity }) => {
      try {
        const [forecastRes, airRes, placeRes] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
          ),
          fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
          ),
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          ),
        ]);

        if (!forecastRes.ok || !airRes.ok) {
          throw new Error("Weather data unavailable");
        }

        const [forecast, air, place] = await Promise.all([
          forecastRes.json(),
          airRes.json(),
          placeRes.ok ? placeRes.json() : Promise.resolve({}),
        ]);

        const city =
          place.city ||
          place.locality ||
          place.principalSubdivision ||
          fallbackCity;

        setWeather({
          city,
          temperature: Math.round(forecast.current.temperature_2m),
          aqi: Math.round(air.current.us_aqi),
          status: "ready",
        });
      } catch {
        setWeather((current) => ({
          ...current,
          city: fallbackCity,
          status: "error",
        }));
      }
    };

    if (!navigator.geolocation) {
      loadWeather(fallbackLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeather({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: "Your location",
        });
      },
      () => loadWeather(fallbackLocation),
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 8000 }
    );
  }, []);

  const temperature =
    weather.temperature === null ? "--" : `${weather.temperature} °C`;
  const aqi = weather.aqi === null ? "--" : weather.aqi;

  return (
    <div className="weather-chip" aria-label={`${weather.city} ${labels.weatherLabel}`}>
      <span className="weather-icon" aria-hidden="true">☁</span>
      <span>
        {weather.city} | {temperature} | {labels.aqi} <strong>{aqi}</strong>
      </span>
    </div>
  );
}

export default App;

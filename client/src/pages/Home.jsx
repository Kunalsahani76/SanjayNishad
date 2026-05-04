import { useEffect, useState } from "react";
import api from "../api";
import heroVideo from "../videos/sanjaysir.mp4";

const newsCopy = {
  title: {
    en: "Inside the New Tech Hub: Bangalore's Next Big Leap in Semiconductors",
    hi: "नए टेक हब के अंदर: सेमीकंडक्टर में बेंगलुरु की अगली बड़ी छलांग",
  },
  description: {
    en: "Inside the new tech hub Bangalore's next big leap in semiconductor.",
    hi: "नए टेक हब में सेमीकंडक्टर क्षेत्र में बेंगलुरु की अगली बड़ी छलांग.",
  },
};

const demoNews = [
  {
    _id: "demo-1",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
    type: "video",
    isLive: true,
  },
  {
    _id: "demo-2",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
    type: "video",
  },
  {
    _id: "demo-3",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
    type: "video",
  },
  {
    _id: "demo-4",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=900&q=80",
    type: "video",
  },
  {
    _id: "demo-5",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
    type: "video",
  },
  {
    _id: "demo-6",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=900&q=80",
    type: "video",
  },
  {
    _id: "demo-7",
    title: newsCopy.title.en,
    titleHi: newsCopy.title.hi,
    description: newsCopy.description.en,
    descriptionHi: newsCopy.description.hi,
    mediaUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
    type: "video",
  },
];

const pageText = {
  en: {
    loading: "Loading news...",
    live: "Live",
    watching: "2.4M watching",
    started: "Started 42 minutes ago",
    views: "2.4M",
    age: "42 minutes ago",
    loadMore: "Load More News",
  },
  hi: {
    loading: "समाचार लोड हो रहे हैं...",
    live: "लाइव",
    watching: "2.4M देख रहे हैं",
    started: "42 मिनट पहले शुरू हुआ",
    views: "2.4M",
    age: "42 मिनट पहले",
    loadMore: "और समाचार देखें",
  },
};

function localText(item, field, language) {
  if (language === "hi" && item[`${field}Hi`]) {
    return item[`${field}Hi`];
  }

  return item[field];
}

export default function Home({ language = "en" }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const text = pageText[language];

  useEffect(() => {
    api
      .get("/news")
      .then((res) => setNews(res.data))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleNews = news.length > 0 ? news : demoNews;
  const [featured, ...cards] = visibleNews;

  return (
    <section className="news-page">
      {loading && <p className="muted">{text.loading}</p>}

      {featured && (
        <article className="featured-news video-feature">
          <HeroVideo />
          <div className="news-overlay">
            {featured.isLive && <span className="live-badge">{text.live}</span>}
            <h1>{localText(featured, "title", language)}</h1>
            {featured.description && <p>{localText(featured, "description", language)}</p>}
            <div className="news-meta">
              <span>◉ {text.watching}</span>
              <span>◷ {text.started}</span>
            </div>
          </div>
        </article>
      )}

      <div className="news-grid">
        {cards.map((item) => (
          <article className="news-card" key={item._id}>
            <Media item={item} />
            <div className="card-play" aria-hidden="true">▶</div>
            <div className="news-overlay">
              <h2>{localText(item, "title", language)}</h2>
              {item.description && <p>{localText(item, "description", language)}</p>}
              <div className="news-meta">
                <span>◉ {text.views}</span>
                <span>◷ {text.age}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button className="load-more" type="button">{text.loadMore}</button>
    </section>
  );
}

function HeroVideo() {
  return (
    <video src={heroVideo} autoPlay controls loop muted playsInline />
  );
}

function Media({ item }) {
  if (!item.mediaUrl) {
    return <div className="media-fallback" />;
  }

  if (item.type === "video" && !item.mediaUrl.includes("images.unsplash.com")) {
    return <video src={item.mediaUrl} controls />;
  }

  return <img src={item.mediaUrl} alt="" />;
}

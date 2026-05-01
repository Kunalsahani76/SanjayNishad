import { useState } from "react";
import api from "../api";
import fatehImage from "../assets/Fateh Bahadur Singh.jpg";
import jitendraImage from "../assets/जितेंद्र कुमार जैसवाल.jpg";
import mahendraImage from "../assets/Mahendra Pal Singh.jpg";
import rajeshImage from "../assets/Rajesh Tripathi.jpg";
import sarvanImage from "../assets/Sarvan Kumar Nishad.jpg";
import vimleshImage from "../assets/Vimlesh Paswan.jpg";

const candidates = [
  {
    id: "fateh",
    name: "Fateh Bahadur Singh",
    nameHi: "फतेह बहादुर सिंह",
    area: "Caimpiyarganj",
    areaHi: "कैम्पियरगंज",
    party: "BJP",
    image: fatehImage,
  },
  {
    id: "mahendra",
    name: "Mahendra Pal Singh",
    nameHi: "महेन्द्र पाल सिंह",
    area: "Pipraich",
    areaHi: "पिपराइच",
    party: "BJP",
    image: mahendraImage,
  },
  {
    id: "sarvan",
    name: "Sarvan Kumar Nishad",
    nameHi: "सरवन कुमार निषाद",
    area: "Chauri Chaura",
    areaHi: "चौरी चौरा",
    party: "BJP",
    image: sarvanImage,
  },
  {
    id: "jitendra",
    name: "Jitendra Kumar Jaiswal",
    nameHi: "जितेंद्र कुमार जैसवाल",
    area: "Gorakhpur",
    areaHi: "गोरखपुर (पिपराइच क्षेत्र)",
    party: "BJP",
    image: jitendraImage,
  },
  {
    id: "vimlesh",
    name: "Vimlesh Paswan",
    nameHi: "विमलेश पासवान",
    area: "Bansgaon",
    areaHi: "बांसगांव",
    party: "BJP",
    image: vimleshImage,
  },
  {
    id: "rajesh",
    name: "Rajesh Tripathi",
    nameHi: "राजेश त्रिपाठी",
    area: "Chillupar",
    areaHi: "चिल्लूपार",
    party: "BJP",
    image: rajeshImage,
  },
];

const pageText = {
  en: {
    heading: "Vote Your Local (MLA)",
    area: "Area",
    party: "Party",
    vote: "Vote",
    voted: "Voted!",
    failed: "Could not submit vote",
  },
  hi: {
    heading: "अपने स्थानीय विधायक को वोट दें",
    area: "क्षेत्र",
    party: "पार्टी",
    vote: "वोट दें",
    voted: "वोट हो गया!",
    failed: "वोट जमा नहीं हो सका",
  },
};

function localText(candidate, field, language) {
  if (language === "hi" && candidate[`${field}Hi`]) {
    return candidate[`${field}Hi`];
  }

  return candidate[field];
}

export default function Voting({ language = "en" }) {
  const [message, setMessage] = useState("");
  const text = pageText[language];

  const vote = async (id) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : localStorage.getItem("guestUserId");
      const finalUserId = userId || crypto.randomUUID();

      if (!userId) {
        localStorage.setItem("guestUserId", finalUserId);
      }

      await api.post("/vote", { userId: finalUserId, candidateId: id });
      setMessage(text.voted);
    } catch (error) {
      setMessage(error.response?.data?.message || text.failed);
    }
  };

  return (
    <section className="voting-page">
      <h1>{text.heading}</h1>

      <div className="candidate-list">
        {candidates.map((candidate) => (
          <article className="candidate-card" key={candidate.id}>
            <div className="candidate-media">
              <img
                src={candidate.image}
                alt=""
              />
              <div className="candidate-info">
                <h2>{localText(candidate, "name", language)}</h2>
                <p>{text.area}: {localText(candidate, "area", language)}</p>
                <p>{text.party}: {candidate.party}</p>
              </div>
            </div>
            <button type="button" onClick={() => vote(candidate.id)}>{text.vote}</button>
          </article>
        ))}
      </div>

      {message && <p className="status">{message}</p>}
    </section>
  );
}

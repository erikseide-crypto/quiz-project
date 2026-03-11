"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type PersonalityKey = "bold-adventurer" | "social-butterfly" | "artisan-snob" | "indulgent-treat";

interface Personality {
  name: string;
  tagline: string;
  coffee: string;
  image: string;
  color: string;
  glow: string;
}

interface Answer {
  text: string;
  emoji: string;
  personality: PersonalityKey;
}

interface Question {
  text: string;
  answers: Answer[];
}

const personalities: Record<PersonalityKey, Personality> = {
  "bold-adventurer": {
    name: "The Bold Adventurer",
    tagline: "You live life at full intensity — no half measures, no decaf.",
    coffee: "Double Espresso",
    image: "/espresso.jpg",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.4)",
  },
  "social-butterfly": {
    name: "The Social Butterfly",
    tagline: "Coffee is your love language, and you share it freely.",
    coffee: "Cappuccino",
    image: "/cappuccino.jpg",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.4)",
  },
  "artisan-snob": {
    name: "The Artisan Snob",
    tagline: "You know your single origins and you're not afraid to say so.",
    coffee: "Pour-Over",
    image: "/pour-over.jpg",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.4)",
  },
  "indulgent-treat": {
    name: "The Indulgent Treat",
    tagline: "Life is short. Add whipped cream.",
    coffee: "Mocha with Whip",
    image: "/mocha.jpg",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
  },
};

const questions: Question[] = [
  {
    text: "How do you start your morning?",
    answers: [
      { text: "Jump straight out of bed ready to conquer the day", emoji: "⚡", personality: "bold-adventurer" },
      { text: "Text the group chat and make plans", emoji: "📱", personality: "social-butterfly" },
      { text: "Read, journal, and ease in slowly", emoji: "📖", personality: "artisan-snob" },
      { text: "Hit snooze twice and treat yourself to a slow start", emoji: "😴", personality: "indulgent-treat" },
    ],
  },
  {
    text: "Pick your ideal weekend activity:",
    answers: [
      { text: "Rock climbing or hiking somewhere remote", emoji: "🧗", personality: "bold-adventurer" },
      { text: "Brunch with a big group of friends", emoji: "🥂", personality: "social-butterfly" },
      { text: "Visiting a farmers market or craft fair", emoji: "🛍️", personality: "artisan-snob" },
      { text: "Cozy movie marathon with snacks", emoji: "🍿", personality: "indulgent-treat" },
    ],
  },
  {
    text: "What's your go-to work style?",
    answers: [
      { text: "Intense focus sessions, then reward yourself", emoji: "🎯", personality: "bold-adventurer" },
      { text: "Collaborative — you love bouncing ideas around", emoji: "💬", personality: "social-butterfly" },
      { text: "Methodical and research-driven", emoji: "🔬", personality: "artisan-snob" },
      { text: "Comfortable environment first, then work happens", emoji: "🛋️", personality: "indulgent-treat" },
    ],
  },
  {
    text: "How do you order at a new restaurant?",
    answers: [
      { text: "Whatever sounds the most extreme or unusual", emoji: "🌶️", personality: "bold-adventurer" },
      { text: "Ask the server for their personal recommendation", emoji: "🤝", personality: "social-butterfly" },
      { text: "Research the menu beforehand and order the best-rated dish", emoji: "⭐", personality: "artisan-snob" },
      { text: "Whatever sounds the most comforting or indulgent", emoji: "🍰", personality: "indulgent-treat" },
    ],
  },
  {
    text: "What describes your travel style?",
    answers: [
      { text: "Backpacking with minimal planning — adventure awaits", emoji: "🎒", personality: "bold-adventurer" },
      { text: "Group tour so everyone gets to experience it together", emoji: "🚌", personality: "social-butterfly" },
      { text: "Deep-dive into one place's culture and history", emoji: "🏛️", personality: "artisan-snob" },
      { text: "Luxury resort where you can truly relax", emoji: "🏖️", personality: "indulgent-treat" },
    ],
  },
  {
    text: "How do you take your coffee normally?",
    answers: [
      { text: "Black — anything else is weakness", emoji: "☕", personality: "bold-adventurer" },
      { text: "With oat milk and a sprinkle of cinnamon — Instagram-ready", emoji: "📸", personality: "social-butterfly" },
      { text: "Brewed at the perfect temperature with filtered water", emoji: "🌡️", personality: "artisan-snob" },
      { text: "Extra syrup, whipped cream, the works", emoji: "🎉", personality: "indulgent-treat" },
    ],
  },
];

type Screen = "intro" | "quiz" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<PersonalityKey, number>>({
    "bold-adventurer": 0,
    "social-butterfly": 0,
    "artisan-snob": 0,
    "indulgent-treat": 0,
  });
  const [result, setResult] = useState<PersonalityKey | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("result") as PersonalityKey | null;
    if (r && r in personalities) {
      setResult(r);
      setScreen("result");
    }
  }, []);

  function handleStart() {
    setScreen("quiz");
    setCurrentQuestion(0);
    setScores({ "bold-adventurer": 0, "social-butterfly": 0, "artisan-snob": 0, "indulgent-treat": 0 });
    setResult(null);
  }

  function handleAnswer(personality: PersonalityKey) {
    const newScores = { ...scores, [personality]: scores[personality] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const winner = (Object.keys(newScores) as PersonalityKey[]).reduce((a, b) =>
        newScores[a] >= newScores[b] ? a : b
      );
      setResult(winner);
      setScreen("result");
      window.history.replaceState({}, "", `?result=${winner}`);
    }
  }

  function handleRetake() {
    setScreen("intro");
    setResult(null);
    window.history.replaceState({}, "", window.location.pathname);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (screen === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "600px" }}>
          <p style={{ color: "#f59e0b", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
            ☕ Basecamp Coffee
          </p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem" }}>
            What&apos;s Your<br />
            <span style={{ background: "linear-gradient(135deg, #ef4444, #ec4899, #8b5cf6, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Coffee Personality?
            </span>
          </h1>
          <p style={{ color: "#888", fontSize: "1.125rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Answer 6 quick questions and we&apos;ll reveal which brew was made for you.
          </p>
          <button
            onClick={handleStart}
            style={{
              background: "linear-gradient(135deg, #ef4444, #ec4899)",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "1rem 2.5rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
              boxShadow: "0 0 30px rgba(239,68,68,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = "scale(1.05)";
              (e.target as HTMLElement).style.boxShadow = "0 0 50px rgba(239,68,68,0.6)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = "scale(1)";
              (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(239,68,68,0.4)";
            }}
          >
            ☕ Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  if (screen === "quiz") {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion) / questions.length) * 100;

    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "640px" }}>
          {/* Progress */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: "#666", fontSize: "0.8rem" }}>Question {currentQuestion + 1} of {questions.length}</span>
              <span style={{ color: "#666", fontSize: "0.8rem" }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: "9999px", height: "6px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #ef4444, #ec4899, #8b5cf6, #f59e0b)",
                  borderRadius: "9999px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 style={{ color: "#ffffff", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 700, marginBottom: "1.5rem", lineHeight: 1.3 }}>
            {q.text}
          </h2>

          {/* Answers */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {q.answers.map((answer, i) => {
              const p = personalities[answer.personality];
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(answer.personality)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #222",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    color: "#ccc",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s",
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.background = `${p.color}18`;
                    el.style.borderColor = p.color;
                    el.style.color = "#fff";
                    el.style.boxShadow = `0 0 20px ${p.glow}`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.borderColor = "#222";
                    el.style.color = "#ccc";
                    el.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{answer.emoji}</span>
                  <span>{answer.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result" && result) {
    const p = personalities[result];

    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "520px", textAlign: "center" }}>
          <p style={{ color: p.color, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Your Coffee Personality
          </p>

          {/* Portrait image */}
          <div style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto 1.5rem",
            border: `3px solid ${p.color}`,
            boxShadow: `0 0 40px ${p.glow}`,
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Image
              src={p.image}
              alt={p.name}
              width={180}
              height={180}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              onError={() => {}}
            />
          </div>

          <h1 style={{ color: "#ffffff", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
            {p.name}
          </h1>

          <p style={{ color: "#888", fontSize: "1rem", marginBottom: "1.5rem", lineHeight: 1.6, fontStyle: "italic" }}>
            &ldquo;{p.tagline}&rdquo;
          </p>

          {/* Coffee recommendation */}
          <div style={{
            background: `${p.color}12`,
            border: `1px solid ${p.color}`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "2rem",
            boxShadow: `0 0 30px ${p.glow}`,
          }}>
            <p style={{ color: "#888", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
              Your Perfect Brew
            </p>
            <p style={{ color: p.color, fontSize: "1.5rem", fontWeight: 800 }}>{p.coffee}</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleCopyLink}
              style={{
                background: copied ? `${p.color}22` : "transparent",
                color: copied ? p.color : "#fff",
                border: `1px solid ${copied ? p.color : "#555"}`,
                borderRadius: "9999px",
                padding: "0.75rem 2rem",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.15s",
                fontWeight: 600,
              }}
            >
              {copied ? "✓ Copied!" : "🔗 Share Result"}
            </button>

            <button
              onClick={handleRetake}
              style={{
                background: "transparent",
                color: "#888",
                border: "1px solid #333",
                borderRadius: "9999px",
                padding: "0.75rem 2rem",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = "#fff";
                (e.target as HTMLElement).style.borderColor = "#666";
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = "#888";
                (e.target as HTMLElement).style.borderColor = "#333";
              }}
            >
              ↺ Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

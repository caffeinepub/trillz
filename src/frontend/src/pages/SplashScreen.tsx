import { Compass, LogIn, MapPin, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  onGetStarted: (name: string) => void;
  onLogin: (name: string) => boolean;
}

export function SplashScreen({ onGetStarted, onLogin }: Props) {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const switchTab = (t: "signup" | "login") => {
    setTab(t);
    setName("");
    setError("");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(
        tab === "signup"
          ? "Please enter your name to continue"
          : "Please enter your name to log in",
      );
      return;
    }
    setError("");
    if (tab === "signup") {
      onGetStarted(name.trim());
    } else {
      const ok = onLogin(name.trim());
      if (!ok) setError("No account found with that name");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.14 0.05 240) 0%, oklch(0.20 0.055 230) 40%, oklch(0.25 0.06 220) 70%, oklch(0.22 0.07 210) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.7 0.1 236) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.68 0.175 54)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.47 0.14 145)" }}
      />

      <div className="relative z-10 flex flex-col items-center px-8 max-w-sm w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-3 mb-4"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-orange"
            style={{ background: "oklch(0.68 0.175 54)" }}
          >
            <Compass size={28} className="text-white" />
          </div>
          <h1 className="font-display text-6xl font-extrabold tracking-tight text-white">
            Trillz
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-trillz-dim text-lg text-center mb-2"
        >
          Explore India's Hidden Gems
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-2 text-trillz-dim text-sm mb-12"
        >
          <MapPin size={14} className="text-trillz-orange" />
          <span>Gokarna · Rishikesh · Ladakh · Dehradun</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
          className="w-full flex gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2"
        >
          {[
            {
              img: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=400",
              name: "Gokarna",
            },
            {
              img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
              name: "Rishikesh",
            },
            {
              img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
              name: "Ladakh",
            },
          ].map((d) => (
            <div
              key={d.name}
              className="relative flex-shrink-0 w-28 h-36 rounded-2xl overflow-hidden shadow-card"
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-semibold">
                {d.name}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.6 }}
          className="w-full flex flex-col gap-3"
        >
          {/* Tab toggle */}
          <div
            className="w-full flex rounded-2xl p-1 mb-1"
            style={{ background: "oklch(0.18 0.045 236)" }}
          >
            <button
              type="button"
              onClick={() => switchTab("signup")}
              data-ocid="splash.signup.tab"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  tab === "signup" ? "oklch(0.68 0.175 54)" : "transparent",
                color: tab === "signup" ? "white" : "oklch(0.55 0.05 236)",
              }}
            >
              <UserPlus size={15} />
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => switchTab("login")}
              data-ocid="splash.login.tab"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  tab === "login" ? "oklch(0.68 0.175 54)" : "transparent",
                color: tab === "login" ? "white" : "oklch(0.55 0.05 236)",
              }}
            >
              <LogIn size={15} />
              Log In
            </button>
          </div>

          <input
            type="text"
            placeholder={
              tab === "signup" ? "Enter your name" : "Your account name"
            }
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            data-ocid="splash.name.input"
            className="w-full px-4 py-3.5 rounded-2xl text-white placeholder-trillz-dim/60 text-base font-medium outline-none focus:ring-2 focus:ring-trillz-orange/60 transition-all"
            style={{
              background: "oklch(0.22 0.055 236)",
              border: "1px solid oklch(0.30 0.06 236)",
            }}
          />
          {error && (
            <p
              className="text-red-400 text-xs px-1"
              data-ocid="splash.name.error_state"
            >
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            data-ocid="splash.get_started.primary_button"
            className="w-full py-4 rounded-2xl font-display font-bold text-lg text-white shadow-orange transition-all duration-200 active:scale-95 hover:brightness-110 flex items-center justify-center gap-3"
            style={{ background: "oklch(0.68 0.175 54)" }}
          >
            {tab === "signup" ? (
              <>
                <UserPlus size={20} /> Create Account
              </>
            ) : (
              <>
                <LogIn size={20} /> Log In
              </>
            )}
          </button>
          {tab === "signup" && (
            <p className="text-trillz-dim/60 text-xs text-center">
              No password needed — start exploring instantly
            </p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-trillz-dim text-xs text-center"
        >
          Join thousands of travelers discovering India
        </motion.p>
      </div>
    </div>
  );
}

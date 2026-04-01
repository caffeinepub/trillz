import { Globe, MapPin, Navigation, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { StarRating } from "../components/StarRating";
import { destinations } from "../data/destinations";
import { useTranslations } from "../hooks/useTranslations";
import type { AppView } from "../types";

interface Props {
  onNavigate: (view: AppView, params?: Record<string, string>) => void;
}

function openMapsWithDirections(
  query: string,
  setLoading: (v: boolean) => void,
) {
  const encoded = encodeURIComponent(query);
  const fallback = () =>
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      "_blank",
    );

  if (!navigator.geolocation) {
    fallback();
    return;
  }

  setLoading(true);

  const timer = setTimeout(() => {
    setLoading(false);
    fallback();
  }, 5000);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      clearTimeout(timer);
      setLoading(false);
      const { latitude, longitude } = pos.coords;
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encoded}`,
        "_blank",
      );
    },
    () => {
      clearTimeout(timer);
      setLoading(false);
      fallback();
    },
    { timeout: 5000 },
  );
}

export function Explore({ onNavigate }: Props) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [navLoading, setNavLoading] = useState<number | null>(null);

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.state.toLowerCase().includes(query.toLowerCase()) ||
      d.tagline.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "oklch(0.18 0.045 236)" }}
    >
      <div className="px-5 pt-12 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-white mb-1"
        >
          {t.exploreIndia} 🗺️
        </motion.h1>
        <p className="text-trillz-dim text-sm">{t.discoverBreathtaking}</p>
      </div>

      <div className="px-5 mb-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-trillz-dim"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${t.searchDestinations}...`}
            data-ocid="explore.search.search_input"
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-white placeholder-trillz-dim/50 focus:outline-none focus:ring-2 focus:ring-trillz-orange/50"
            style={{
              background: "oklch(0.22 0.055 236)",
              border: "1px solid oklch(0.32 0.06 236)",
            }}
          />
        </div>
      </div>

      <div className="px-5">
        {filtered.length === 0 ? (
          <div className="text-center py-12" data-ocid="explore.empty_state">
            <p className="text-trillz-dim">
              No destinations found for "{query}"
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden shadow-card cursor-pointer active:scale-[0.99] transition-transform"
                style={{ background: "oklch(0.22 0.055 236)" }}
                data-ocid={`explore.item.${i + 1}`}
                onClick={() =>
                  onNavigate("destinationDetail", { destinationId: dest.id })
                }
              >
                <div className="relative h-44">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-display font-bold text-xl">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                      <MapPin size={11} />
                      <span>{dest.state}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StarRating rating={dest.rating} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-trillz-dim text-sm mb-3">{dest.tagline}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dest.languages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          background: "oklch(0.28 0.09 220)",
                          color: "oklch(0.78 0.12 220)",
                        }}
                      >
                        <Globe size={10} />
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "oklch(0.47 0.14 145)" }}
                      data-ocid={`explore.view.button.${i + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate("destinationDetail", {
                          destinationId: dest.id,
                        });
                      }}
                    >
                      {t.viewDetails}
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1.5 disabled:opacity-60"
                      style={{ background: "oklch(0.55 0.18 240)" }}
                      data-ocid={`explore.navigate.button.${i + 1}`}
                      disabled={navLoading === i}
                      onClick={(e) => {
                        e.stopPropagation();
                        openMapsWithDirections(
                          `${dest.name} ${dest.state} India`,
                          (v) => setNavLoading(v ? i : null),
                        );
                      }}
                    >
                      <Navigation size={14} />
                      {navLoading === i ? "..." : t.navigate}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

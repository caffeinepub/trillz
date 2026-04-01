import {
  ArrowLeft,
  Bike,
  Car,
  CheckCircle,
  Globe,
  Hotel,
  MapPin,
  MessageCircle,
  Navigation,
  Star,
  Utensils,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { StarRating } from "../components/StarRating";
import type { Destination } from "../data/destinations";
import type { AppView } from "../types";

interface Props {
  destination: Destination;
  onBack: () => void;
  onNavigate: (view: AppView, params?: Record<string, string>) => void;
  onMarkArrived: (destId: string) => void;
  arrivedAt: string[];
}

type Tab = "hotels" | "restaurants" | "activities" | "languages";

function openMapsWithDirections(
  query: string,
  setLoading?: (v: boolean) => void,
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

  setLoading?.(true);

  const timer = setTimeout(() => {
    setLoading?.(false);
    fallback();
  }, 5000);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      clearTimeout(timer);
      setLoading?.(false);
      const { latitude, longitude } = pos.coords;
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encoded}`,
        "_blank",
      );
    },
    () => {
      clearTimeout(timer);
      setLoading?.(false);
      fallback();
    },
    { timeout: 5000 },
  );
}

export function DestinationDetail({
  destination,
  onBack,
  onNavigate,
  onMarkArrived,
  arrivedAt,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("hotels");
  const [navLoading, setNavLoading] = useState<string | null>(null);
  const isArrived = arrivedAt.includes(destination.id);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "hotels", label: "Hotels", icon: <Hotel size={14} /> },
    { id: "restaurants", label: "Eat", icon: <Utensils size={14} /> },
    { id: "activities", label: "Activities", icon: <Zap size={14} /> },
    { id: "languages", label: "Languages", icon: <Globe size={14} /> },
  ];

  function navigate(key: string, query: string) {
    if (navLoading) return;
    openMapsWithDirections(query, (v) => setNavLoading(v ? key : null));
  }

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "oklch(0.18 0.045 236)" }}
    >
      <div className="relative h-72">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.045_236)] via-black/30 to-transparent" />
        <button
          type="button"
          onClick={onBack}
          data-ocid="detail.back.button"
          className="absolute top-12 left-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: "rgba(11,46,78,0.7)" }}
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-white">
                {destination.name}
              </h1>
              <div className="flex items-center gap-1 text-white/70 text-sm mt-0.5">
                <MapPin size={13} />
                <span>{destination.state}</span>
              </div>
            </div>
            <StarRating rating={destination.rating} size={16} />
          </div>
          <p className="text-white/80 text-sm mt-1">{destination.tagline}</p>
        </div>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              onNavigate("groupChat", { destinationId: destination.id })
            }
            data-ocid="detail.join_chat.primary_button"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-white text-sm transition-all"
            style={{ background: "oklch(0.68 0.175 54)" }}
          >
            <MessageCircle size={15} /> Join Chat
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isArrived) onMarkArrived(destination.id);
              onNavigate("atDestination", { destinationId: destination.id });
            }}
            data-ocid="detail.arrived.toggle"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-white text-sm transition-all"
            style={{
              background: isArrived
                ? "oklch(0.47 0.14 145)"
                : "oklch(0.27 0.065 236)",
            }}
          >
            <CheckCircle size={15} />
            {isArrived ? "Arrived ✓" : "Mark Arrived"}
          </button>
          <button
            type="button"
            onClick={() =>
              navigate("main", `${destination.name} ${destination.state} India`)
            }
            disabled={navLoading === "main"}
            data-ocid="detail.navigate.primary_button"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-white text-sm transition-all disabled:opacity-60"
            style={{ background: "oklch(0.55 0.18 240)" }}
          >
            <Navigation size={15} />
            {navLoading === "main" ? "..." : "Navigate"}
          </button>
        </div>

        <div
          className="flex rounded-2xl p-1"
          style={{ background: "oklch(0.22 0.055 236)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`detail.${tab.id}.tab`}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id ? "text-white shadow" : "text-trillz-dim"
              }`}
              style={
                activeTab === tab.id
                  ? { background: "oklch(0.47 0.14 145)" }
                  : {}
              }
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "hotels" && (
            <div className="flex flex-col gap-3">
              {destination.hotels.map((hotel, hi) => (
                <div
                  key={hotel.name}
                  className="rounded-2xl p-4"
                  style={{ background: "oklch(0.22 0.055 236)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{hotel.name}</h3>
                      <span
                        className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs"
                        style={{
                          background: "oklch(0.27 0.065 236)",
                          color: "oklch(0.72 0.025 236)",
                        }}
                      >
                        {hotel.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-trillz-yellow text-trillz-yellow"
                        />
                        <span className="text-trillz-yellow text-sm font-semibold">
                          {hotel.rating}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `hotel-${hi}`,
                            `${hotel.name} ${destination.name} India`,
                          )
                        }
                        disabled={navLoading === `hotel-${hi}`}
                        data-ocid={`detail.hotel.navigate.button.${hi + 1}`}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-60"
                        style={{ background: "oklch(0.55 0.18 240)" }}
                      >
                        <Navigation size={11} />
                        {navLoading === `hotel-${hi}` ? "..." : "Map"}
                      </button>
                    </div>
                  </div>
                  {hotel.dorm && (
                    <div className="flex flex-col gap-0.5 text-sm">
                      <span className="text-trillz-dim">
                        Dorm:{" "}
                        <span className="text-trillz-orange font-semibold">
                          {hotel.dorm}
                        </span>
                      </span>
                      <span className="text-trillz-dim">
                        Private:{" "}
                        <span className="text-trillz-orange font-semibold">
                          {hotel.private}
                        </span>
                      </span>
                    </div>
                  )}
                  {hotel.price && (
                    <p className="text-trillz-orange font-bold">
                      {hotel.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "restaurants" && (
            <div className="flex flex-col gap-3">
              {destination.restaurants.map((r, ri) => (
                <div
                  key={r.name}
                  className="rounded-2xl p-4"
                  style={{ background: "oklch(0.22 0.055 236)" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{r.name}</h3>
                      <p className="text-trillz-dim text-xs mt-0.5">
                        {r.cuisine}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-trillz-yellow text-trillz-yellow"
                        />
                        <span className="text-trillz-yellow text-sm font-semibold">
                          {r.rating}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `rest-${ri}`,
                            `${r.name} ${destination.name} India`,
                          )
                        }
                        disabled={navLoading === `rest-${ri}`}
                        data-ocid={`detail.restaurant.navigate.button.${ri + 1}`}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-60"
                        style={{ background: "oklch(0.55 0.18 240)" }}
                      >
                        <Navigation size={11} />
                        {navLoading === `rest-${ri}` ? "..." : "Map"}
                      </button>
                    </div>
                  </div>
                  <p className="text-trillz-orange font-semibold text-sm mt-2">
                    {r.priceRange}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "activities" && (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {destination.activities.map((act) => (
                  <span
                    key={act}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ background: "oklch(0.68 0.175 54)" }}
                  >
                    {act}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {destination.activities.map((act) => (
                  <div
                    key={act}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: "oklch(0.22 0.055 236)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.27 0.065 236)" }}
                    >
                      <Zap size={18} className="text-trillz-orange" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{act}</p>
                      <p className="text-trillz-dim text-xs">
                        Popular activity in {destination.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "languages" && (
            <div>
              <p className="text-trillz-dim text-sm mb-4">
                Languages spoken at this destination
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {destination.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white flex items-center gap-1.5"
                    style={{ background: "oklch(0.38 0.12 220)" }}
                  >
                    <Globe size={13} />
                    {lang}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {destination.languages.map((lang, li) => (
                  <div
                    key={lang}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: "oklch(0.22 0.055 236)" }}
                    data-ocid={`detail.language.item.${li + 1}`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.28 0.09 220)" }}
                    >
                      <Globe
                        size={18}
                        style={{ color: "oklch(0.72 0.17 220)" }}
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{lang}</p>
                      <p className="text-trillz-dim text-xs">
                        Spoken in {destination.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div>
          <h2 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Bike size={18} className="text-trillz-orange" /> Vehicle Rentals
          </h2>
          <div className="flex flex-col gap-3">
            {destination.rentals.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ background: "oklch(0.22 0.055 236)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.27 0.065 236)" }}
                  >
                    {r.type === "Car" ? (
                      <Car size={18} className="text-trillz-orange" />
                    ) : (
                      <Bike size={18} className="text-trillz-orange" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{r.name}</p>
                    <p className="text-trillz-orange text-sm font-semibold">
                      {r.price}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "oklch(0.47 0.14 145)" }}
                >
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { LogOut, MapPin, MessageCircle, Star } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "../hooks/useTranslations";
import type { Trip, User } from "../types";

interface Props {
  user: User;
  trips: Trip[];
  onLogout: () => void;
}

export function Profile({ user, trips, onLogout }: Props) {
  const t = useTranslations();
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const arrivedCount = trips.filter((t) => t.status === "Arrived").length;
  const planningCount = trips.filter((t) => t.status === "Planning").length;

  const stats = [
    {
      label: t.totalTrips,
      value: trips.length,
      icon: <MapPin size={18} className="text-trillz-orange" />,
    },
    {
      label: t.arrived,
      value: arrivedCount,
      icon: <Star size={18} className="text-trillz-yellow" />,
    },
    {
      label: t.planning,
      value: planningCount,
      icon: <MessageCircle size={18} className="text-trillz-green" />,
    },
  ];

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "oklch(0.18 0.045 236)" }}
    >
      <div
        className="h-36 relative"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.055 236) 0%, oklch(0.27 0.065 236) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="px-5 -mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center font-display font-bold text-3xl text-white shadow-card border-4"
            style={{
              background: "oklch(0.68 0.175 54)",
              borderColor: "oklch(0.18 0.045 236)",
            }}
          >
            {initials}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <h1 className="font-display text-2xl font-bold text-white">
            {user.displayName}
          </h1>
          <p className="text-trillz-dim text-xs mt-0.5">
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </motion.div>
      </div>

      <div className="px-5 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: "oklch(0.22 0.055 236)" }}
              data-ocid={`profile.stat.item.${i + 1}`}
            >
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <p className="font-display text-2xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-trillz-dim text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {trips.length > 0 && (
        <div className="px-5 mt-6">
          <h2 className="font-display text-lg font-bold text-white mb-3">
            {t.recentTrips}
          </h2>
          <div className="flex flex-col gap-2">
            {trips.slice(0, 5).map((trip, i) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "oklch(0.22 0.055 236)" }}
                data-ocid={`profile.trip.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-trillz-orange" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {trip.name}
                    </p>
                    <p className="text-trillz-dim text-xs">
                      {trip.from} → {trip.to}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    trip.status === "Arrived"
                      ? "bg-green-700/80 text-white"
                      : "bg-trillz-orange/80 text-white"
                  }`}
                >
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 mt-8">
        <button
          type="button"
          onClick={onLogout}
          data-ocid="profile.logout.button"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-red-400 border border-red-800/40 bg-red-900/20 transition-all active:scale-95"
        >
          <LogOut size={18} /> {t.logOut}
        </button>
      </div>

      <div className="px-5 mt-6 pb-4 text-center">
        <p className="text-trillz-dim/50 text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

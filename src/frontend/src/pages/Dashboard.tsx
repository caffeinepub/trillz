import {
  CheckCircle,
  Clock,
  Compass,
  Eye,
  Globe,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { StarRating } from "../components/StarRating";
import { destinations } from "../data/destinations";
import { useTranslations } from "../hooks/useTranslations";
import type { AppView, Trip, User } from "../types";

interface Props {
  user: User;
  trips: Trip[];
  onDeleteTrip: (id: string) => void;
  onNavigate: (view: AppView, params?: Record<string, string>) => void;
}

export function Dashboard({ user, trips, onDeleteTrip, onNavigate }: Props) {
  const t = useTranslations();
  const firstName = user.displayName.split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t.goodMorning : hour < 17 ? t.goodAfternoon : t.goodEvening;

  return (
    <div
      className="pb-24 min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.15 0.045 236) 0%, oklch(0.18 0.045 236) 100%)",
      }}
    >
      <div className="px-5 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-trillz-dim text-sm">{greeting},</p>
              <h1 className="font-display text-2xl font-bold text-white">
                {firstName} 👋
              </h1>
            </div>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg"
              style={{ background: "oklch(0.68 0.175 54)" }}
            >
              {firstName[0].toUpperCase()}
            </div>
          </div>
        </motion.div>
      </div>

      {trips.length > 0 ? (
        <section className="px-5" data-ocid="trips.section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-white">
              {t.myTrips}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("tripPlanner")}
              data-ocid="trips.plan.primary_button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: "oklch(0.68 0.175 54)" }}
            >
              <Plus size={15} />
              {t.newTrip}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {trips.map((trip, i) => {
              const dest = destinations.find(
                (d) => d.id === trip.destinationId,
              );
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl overflow-hidden shadow-card"
                  style={{ background: "oklch(0.22 0.055 236)" }}
                  data-ocid={`trips.item.${i + 1}`}
                >
                  {dest && (
                    <div className="relative h-28">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <h3 className="text-white font-bold text-base">
                          {trip.name}
                        </h3>
                        <div className="flex items-center gap-1 text-white/70 text-xs">
                          <MapPin size={11} />
                          <span>
                            {trip.from} → {trip.to}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            trip.status === "Arrived"
                              ? "bg-green-600/90 text-white"
                              : "bg-trillz-orange/90 text-white"
                          }`}
                        >
                          {trip.status === "Arrived" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={11} /> {t.arrived}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {t.planning}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 p-3">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate("destinationDetail", {
                          destinationId: trip.destinationId,
                        })
                      }
                      data-ocid={`trips.view.button.${i + 1}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
                      style={{ background: "oklch(0.47 0.14 145)" }}
                    >
                      <Eye size={14} />
                      {t.viewDetails}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTrip(trip.id)}
                      data-ocid={`trips.delete.button.${i + 1}`}
                      className="w-10 flex items-center justify-center rounded-xl text-red-400 border border-red-800/40 bg-red-900/20 transition-all hover:bg-red-900/40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-white">
              {t.discoverDestinations}
            </h2>
            <Compass size={20} className="text-trillz-orange" />
          </div>
          <p className="text-trillz-dim text-sm mb-5">{t.noTripsYet}</p>
          <div className="flex flex-col gap-4">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden shadow-card cursor-pointer active:scale-[0.99] transition-transform"
                style={{ background: "oklch(0.22 0.055 236)" }}
                data-ocid={`dest.item.${i + 1}`}
                onClick={() =>
                  onNavigate("destinationDetail", { destinationId: dest.id })
                }
              >
                <div className="relative h-40">
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
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <MapPin size={11} />
                      <span>{dest.state}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StarRating rating={dest.rating} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-trillz-dim text-sm mb-2">{dest.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dest.languages.slice(0, 2).map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{
                          background: "oklch(0.28 0.09 220)",
                          color: "oklch(0.78 0.12 220)",
                        }}
                      >
                        <Globe size={9} />
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
                    style={{ background: "oklch(0.47 0.14 145)" }}
                    data-ocid={`dest.view.button.${i + 1}`}
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("tripPlanner")}
            data-ocid="dashboard.plan_trip.primary_button"
            className="w-full mt-6 py-4 rounded-2xl font-display font-bold text-lg text-white shadow-orange transition-all active:scale-95"
            style={{ background: "oklch(0.68 0.175 54)" }}
          >
            {t.planYourFirstTrip}
          </button>
        </section>
      )}
    </div>
  );
}

import { ArrowLeft, Bike, Car, MapPin, Phone, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Destination } from "../data/destinations";
import { useTranslations } from "../hooks/useTranslations";

interface Props {
  destination: Destination;
  onBack: () => void;
}

export function AtDestination({ destination, onBack }: Props) {
  const t = useTranslations();
  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "oklch(0.18 0.045 236)" }}
    >
      <div className="relative h-48">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.045_236)] to-transparent" />
        <button
          type="button"
          onClick={onBack}
          data-ocid="atdest.back.button"
          className="absolute top-12 left-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: "rgba(11,46,78,0.7)" }}
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="absolute bottom-3 left-4">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{ background: "oklch(0.47 0.14 145)" }}
          >
            <MapPin size={11} /> You're in {destination.name}!
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-6">
        <section>
          <h2 className="font-display text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Bike size={20} className="text-trillz-orange" /> {t.vehicleRentals}
          </h2>
          <div className="flex flex-col gap-3">
            {destination.rentals.map((r) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ background: "oklch(0.22 0.055 236)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.27 0.065 236)" }}
                  >
                    {r.type === "Car" ? (
                      <Car size={22} className="text-trillz-orange" />
                    ) : (
                      <Bike size={22} className="text-trillz-orange" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{r.name}</p>
                    <p className="text-trillz-dim text-xs">{r.type} Rental</p>
                    <p className="text-trillz-orange font-bold text-sm mt-0.5">
                      {r.price}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "oklch(0.47 0.14 145)" }}
                >
                  <Phone size={14} /> Call
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-white mb-3">
            🏨 {t.hotelBookings}
          </h2>
          <div className="flex flex-col gap-3">
            {destination.hotels.map((h) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-4"
                style={{ background: "oklch(0.22 0.055 236)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{h.name}</h3>
                    <span className="text-trillz-dim text-xs">{h.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      size={12}
                      className="fill-trillz-yellow text-trillz-yellow"
                    />
                    <span className="text-trillz-yellow text-sm font-semibold">
                      {h.rating}
                    </span>
                  </div>
                </div>
                {h.dorm && (
                  <div className="text-sm">
                    <span className="text-trillz-dim">Dorm: </span>
                    <span className="text-trillz-orange font-semibold">
                      {h.dorm}
                    </span>
                    <span className="text-trillz-dim ml-2">Private: </span>
                    <span className="text-trillz-orange font-semibold">
                      {h.private}
                    </span>
                  </div>
                )}
                {h.price && (
                  <p className="text-trillz-orange font-bold">{h.price}</p>
                )}
                <button
                  type="button"
                  className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "oklch(0.47 0.14 145)" }}
                >
                  Book Now
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Zap size={20} className="text-trillz-orange" />{" "}
            {t.mustDoActivities}
          </h2>
          <div className="flex flex-col gap-3">
            {destination.activities.slice(0, 3).map((act, i) => (
              <motion.div
                key={act}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "oklch(0.22 0.055 236)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-lg"
                  style={{ background: "oklch(0.68 0.175 54)" }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-white font-semibold">{act}</p>
                  <p className="text-trillz-dim text-xs">
                    Top pick in {destination.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

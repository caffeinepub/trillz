import {
  ArrowLeft,
  Calculator,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Plane,
  Train,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import {
  destinations,
  indiaLocations,
  mockTransportOptions,
} from "../data/destinations";
import { useTranslations } from "../hooks/useTranslations";
import type { AppView, Trip } from "../types";

interface Props {
  onBack: () => void;
  onSaveTrip: (trip: Trip) => void;
  onNavigate: (view: AppView, params?: Record<string, string>) => void;
}

const ACCOMMODATION = [
  { label: "Budget", subLabel: "₹500/night", rate: 500 },
  { label: "Mid-range", subLabel: "₹2,000/night", rate: 2000 },
  { label: "Luxury", subLabel: "₹6,000/night", rate: 6000 },
];

const TRANSPORT = [
  { label: "Bus", subLabel: "₹300/day", rate: 300, flat: false },
  { label: "Train", subLabel: "₹500/day", rate: 500, flat: false },
  { label: "Flight", subLabel: "₹3,000 flat", rate: 3000, flat: true },
];

const FOOD = [
  { label: "Budget", subLabel: "₹300/day/person", rate: 300 },
  { label: "Mid-range", subLabel: "₹600/day/person", rate: 600 },
  { label: "Fine Dining", subLabel: "₹1,500/day/person", rate: 1500 },
];

const ACTIVITIES = [
  { label: "Basic", subLabel: "₹500/day", rate: 500 },
  { label: "Adventure", subLabel: "₹1,500/day", rate: 1500 },
  { label: "Premium", subLabel: "₹3,000/day", rate: 3000 },
];

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function TripPlanner({ onBack, onSaveTrip, onNavigate }: Props) {
  const t = useTranslations();
  const [tripName, setTripName] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Budget calculator state
  const [budgetOpen, setBudgetOpen] = useState(true);
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [accomIdx, setAccomIdx] = useState(0);
  const [transportIdx, setTransportIdx] = useState(0);
  const [foodIdx, setFoodIdx] = useState(0);
  const [activityIdx, setActivityIdx] = useState(0);

  const daysId = useId();
  const peopleId = useId();

  const budget = useMemo(() => {
    const accom = ACCOMMODATION[accomIdx].rate * days;
    const transport = TRANSPORT[transportIdx].flat
      ? TRANSPORT[transportIdx].rate * people
      : TRANSPORT[transportIdx].rate * days * people;
    const food = FOOD[foodIdx].rate * days * people;
    const activities = ACTIVITIES[activityIdx].rate * days;
    const total = accom + transport + food + activities;
    return { accom, transport, food, activities, total };
  }, [days, people, accomIdx, transportIdx, foodIdx, activityIdx]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName.trim() || !from.trim() || !to.trim()) {
      setError("Please fill all fields.");
      return;
    }
    const destId =
      destinations.find((d) => d.name.toLowerCase() === to.toLowerCase())?.id ||
      destinations[0].id;
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: tripName,
      from,
      to,
      destinationId: destId,
      status: "Planning",
      createdAt: new Date().toISOString(),
    };
    onSaveTrip(newTrip);
    setSaved(true);
    setError("");
  };

  const mapsUrl =
    from && to
      ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&mode=driving`
      : null;

  const cardStyle = { background: "oklch(0.22 0.055 236)" };
  const inputStyle = {
    background: "oklch(0.27 0.065 236)",
    border: "1px solid oklch(0.32 0.06 236)",
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "oklch(0.18 0.045 236)" }}
    >
      <div className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "oklch(0.22 0.055 236)" }}
          data-ocid="planner.back.button"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="font-display text-2xl font-bold text-white">
          {t.planATrip}
        </h1>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Trip Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={cardStyle}
        >
          <form
            onSubmit={handleSave}
            className="flex flex-col gap-4"
            data-ocid="planner.form"
          >
            <div>
              <label
                htmlFor="trip-name"
                className="block text-sm font-medium text-trillz-dim mb-1.5"
              >
                Trip Name
              </label>
              <input
                id="trip-name"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g. Beach Escape 2026"
                data-ocid="planner.tripname.input"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-trillz-dim/50 focus:outline-none focus:ring-2 focus:ring-trillz-orange/50"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="trip-from"
                className="block text-sm font-medium text-trillz-dim mb-1.5"
              >
                From (City)
              </label>
              <input
                id="trip-from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. Mumbai, Delhi"
                data-ocid="planner.from.input"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-trillz-dim/50 focus:outline-none focus:ring-2 focus:ring-trillz-orange/50"
                style={inputStyle}
              />
            </div>
            <div>
              <label
                htmlFor="trip-to"
                className="block text-sm font-medium text-trillz-dim mb-1.5"
              >
                Destination
              </label>
              <select
                id="trip-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                data-ocid="planner.to.select"
                className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-trillz-orange/50 cursor-pointer"
                style={inputStyle}
              >
                <option value="" disabled>
                  Select a destination in India
                </option>
                {indiaLocations.map((loc) => (
                  <option key={`${loc.name}-${loc.state}`} value={loc.name}>
                    {loc.name}, {loc.state}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p
                className="text-red-400 text-sm"
                data-ocid="planner.error_state"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={saved}
              data-ocid="planner.save.primary_button"
              className="w-full py-4 rounded-2xl font-display font-bold text-lg text-white transition-all active:scale-95 shadow-orange disabled:opacity-50"
              style={{ background: "oklch(0.68 0.175 54)" }}
            >
              {saved ? `${t.tripSaved} ✓` : t.saveTrip}
            </button>
          </form>
        </motion.div>

        {/* Map */}
        {mapsUrl && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden shadow-card"
          >
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={cardStyle}
            >
              <MapPin size={16} className="text-trillz-orange" />
              <span className="text-white font-semibold text-sm">
                {from} → {to}
              </span>
            </div>
            <iframe
              src={mapsUrl}
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Route Map"
              data-ocid="planner.map.canvas_target"
            />
          </motion.div>
        )}

        {/* Budget Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={cardStyle}
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => setBudgetOpen((v) => !v)}
            data-ocid="budget.toggle"
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.68 0.175 54 / 0.18)" }}
              >
                <Calculator
                  size={16}
                  style={{ color: "oklch(0.68 0.175 54)" }}
                />
              </div>
              <span className="font-display font-bold text-white text-lg">
                {t.tripBudgetCalculator}
              </span>
            </div>
            {budgetOpen ? (
              <ChevronUp size={18} className="text-trillz-dim" />
            ) : (
              <ChevronDown size={18} className="text-trillz-dim" />
            )}
          </button>

          <AnimatePresence>
            {budgetOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-5 pb-5 flex flex-col gap-5">
                  {/* Days + People */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={daysId}
                        className="block text-xs font-medium text-trillz-dim mb-1.5"
                      >
                        Number of Days
                      </label>
                      <input
                        id={daysId}
                        type="number"
                        min={1}
                        max={30}
                        value={days}
                        onChange={(e) =>
                          setDays(
                            Math.max(1, Math.min(30, Number(e.target.value))),
                          )
                        }
                        data-ocid="budget.days.input"
                        className="w-full px-3 py-2.5 rounded-xl text-white text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-trillz-orange/50"
                        style={inputStyle}
                      />
                      <p className="text-trillz-dim text-xs mt-1 text-center">
                        days
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor={peopleId}
                        className="block text-xs font-medium text-trillz-dim mb-1.5"
                      >
                        Number of People
                      </label>
                      <div className="relative">
                        <input
                          id={peopleId}
                          type="number"
                          min={1}
                          max={20}
                          value={people}
                          onChange={(e) =>
                            setPeople(
                              Math.max(1, Math.min(20, Number(e.target.value))),
                            )
                          }
                          data-ocid="budget.people.input"
                          className="w-full px-3 py-2.5 rounded-xl text-white text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-trillz-orange/50"
                          style={inputStyle}
                        />
                        <Users
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-trillz-dim pointer-events-none"
                        />
                      </div>
                      <p className="text-trillz-dim text-xs mt-1 text-center">
                        people
                      </p>
                    </div>
                  </div>

                  {/* Option selects */}
                  <div className="flex flex-col gap-3">
                    <BudgetSelect
                      label="Accommodation"
                      options={ACCOMMODATION}
                      value={accomIdx}
                      onChange={setAccomIdx}
                      ocid="budget.accom.select"
                      inputStyle={inputStyle}
                    />
                    <BudgetSelect
                      label="Transport"
                      options={TRANSPORT}
                      value={transportIdx}
                      onChange={setTransportIdx}
                      ocid="budget.transport.select"
                      inputStyle={inputStyle}
                    />
                    <BudgetSelect
                      label="Food"
                      options={FOOD}
                      value={foodIdx}
                      onChange={setFoodIdx}
                      ocid="budget.food.select"
                      inputStyle={inputStyle}
                    />
                    <BudgetSelect
                      label="Activities"
                      options={ACTIVITIES}
                      value={activityIdx}
                      onChange={setActivityIdx}
                      ocid="budget.activities.select"
                      inputStyle={inputStyle}
                    />
                  </div>

                  {/* Breakdown Grid */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "oklch(0.27 0.065 236)" }}
                  >
                    <p className="text-trillz-dim text-xs font-semibold uppercase tracking-wider mb-3">
                      Cost Breakdown
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <BreakdownCard
                        label="🏨 Accommodation"
                        amount={budget.accom}
                      />
                      <BreakdownCard
                        label="🚌 Transport"
                        amount={budget.transport}
                      />
                      <BreakdownCard label="🍽️ Food" amount={budget.food} />
                      <BreakdownCard
                        label="🎯 Activities"
                        amount={budget.activities}
                      />
                    </div>
                  </div>

                  {/* Total */}
                  <div
                    className="rounded-xl p-5 flex flex-col items-center gap-1"
                    style={{
                      background: "oklch(0.68 0.175 54 / 0.12)",
                      border: "1px solid oklch(0.68 0.175 54 / 0.3)",
                    }}
                    data-ocid="budget.total.card"
                  >
                    <p className="text-trillz-dim text-sm font-medium">
                      Estimated Total
                    </p>
                    <p
                      className="font-display font-bold text-4xl"
                      style={{ color: "oklch(0.68 0.175 54)" }}
                    >
                      {formatINR(budget.total)}
                    </p>
                    <p className="text-trillz-dim text-xs">
                      for {people} {people === 1 ? "person" : "people"} · {days}{" "}
                      {days === 1 ? "day" : "days"}
                    </p>
                    <p className="text-trillz-dim text-xs mt-0.5">
                      ≈ {formatINR(Math.round(budget.total / people))} per
                      person
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Flights */}
        <div>
          <h2 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Plane size={18} className="text-trillz-orange" /> {t.flights}
          </h2>
          <div className="flex flex-col gap-3">
            {mockTransportOptions.flights.map((f) => (
              <motion.div
                key={`${f.airline}-${f.from}-${f.to}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={cardStyle}
              >
                <div>
                  <p className="text-white font-semibold">{f.airline}</p>
                  <p className="text-trillz-dim text-xs mt-0.5">
                    {f.from} → {f.to}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-trillz-dim text-xs">
                      <Clock size={11} />
                      {f.duration}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-trillz-orange font-bold text-lg">
                    {f.price}
                  </p>
                  <a
                    href={f.link}
                    className="text-xs text-trillz-green underline"
                  >
                    Book
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trains */}
        <div>
          <h2 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Train size={18} className="text-trillz-orange" /> {t.trains}
          </h2>
          <div className="flex flex-col gap-3">
            {mockTransportOptions.trains.map((t) => (
              <motion.div
                key={`${t.name}-${t.from}-${t.to}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={cardStyle}
              >
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-trillz-dim text-xs mt-0.5">
                    {t.from} → {t.to}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-trillz-dim text-xs">
                      <Clock size={11} />
                      {t.duration}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-trillz-orange font-bold text-lg">
                    {t.price}
                  </p>
                  <a
                    href={t.link}
                    className="text-xs text-trillz-green underline"
                  >
                    Book
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {saved && (
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            data-ocid="planner.go_home.button"
            className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all"
            style={{ background: "oklch(0.47 0.14 145)" }}
          >
            View My Trips →
          </button>
        )}
      </div>
    </div>
  );
}

interface BudgetSelectProps {
  label: string;
  options: { label: string; subLabel: string }[];
  value: number;
  onChange: (idx: number) => void;
  ocid: string;
  inputStyle: React.CSSProperties;
}

function BudgetSelect({
  label,
  options,
  value,
  onChange,
  ocid,
  inputStyle,
}: BudgetSelectProps) {
  const selectId = useId();
  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-xs font-medium text-trillz-dim mb-1.5"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-ocid={ocid}
        className="w-full px-4 py-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-trillz-orange/50 cursor-pointer"
        style={inputStyle}
      >
        {options.map((opt, idx) => (
          <option key={opt.label} value={idx}>
            {opt.label} — {opt.subLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function BreakdownCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-0.5"
      style={{ background: "oklch(0.22 0.055 236)" }}
    >
      <p className="text-trillz-dim text-xs">{label}</p>
      <p className="text-white font-bold text-base">{formatINR(amount)}</p>
    </div>
  );
}

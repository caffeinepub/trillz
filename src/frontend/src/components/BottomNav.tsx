import { Compass, Home, MapIcon, MessageCircle, User } from "lucide-react";
import { useTranslations } from "../hooks/useTranslations";
import type { AppView } from "../types";

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function BottomNav({ currentView, onNavigate }: Props) {
  const t = useTranslations();

  const tabs = [
    { view: "dashboard" as AppView, icon: Home, label: t.home },
    { view: "tripPlanner" as AppView, icon: MapIcon, label: t.planTrip },
    { view: "explore" as AppView, icon: Compass, label: t.explore },
    { view: "groupChat" as AppView, icon: MessageCircle, label: t.chat },
    { view: "profile" as AppView, icon: User, label: t.profile },
  ];

  const isActive = (view: AppView) => {
    if (
      view === "dashboard" &&
      (currentView === "dashboard" ||
        currentView === "destinationDetail" ||
        currentView === "atDestination")
    )
      return true;
    return currentView === view;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      data-ocid="bottom_nav"
    >
      <div className="w-full max-w-md bg-[oklch(0.15_0.04_236)] border-t border-[oklch(0.28_0.06_236)] flex">
        {tabs.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            type="button"
            onClick={() => onNavigate(view)}
            data-ocid={`nav.${view}.link`}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all duration-200 ${
              isActive(view)
                ? "text-trillz-orange"
                : "text-trillz-dim hover:text-foreground"
            }`}
          >
            <Icon size={20} strokeWidth={isActive(view) ? 2.5 : 1.8} />
            <span
              className={`text-[10px] font-medium ${isActive(view) ? "font-semibold" : ""}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

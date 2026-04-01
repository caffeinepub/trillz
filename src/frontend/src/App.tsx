import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { destinations } from "./data/destinations";
import { AtDestination } from "./pages/AtDestination";
import { Dashboard } from "./pages/Dashboard";
import { DestinationDetail } from "./pages/DestinationDetail";
import { Explore } from "./pages/Explore";
import { GroupChat } from "./pages/GroupChat";
import { LanguageSelect } from "./pages/LanguageSelect";
import { Profile } from "./pages/Profile";
import { SplashScreen } from "./pages/SplashScreen";
import { TripPlanner } from "./pages/TripPlanner";
import type { AppView, Trip, User } from "./types";

function loadLocalUser(): User | null {
  try {
    const raw = localStorage.getItem("trillz_user");
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // ignore
  }
  return null;
}

function loadAccounts(): User[] {
  try {
    const raw = localStorage.getItem("trillz_accounts");
    if (raw) return JSON.parse(raw) as User[];
  } catch {
    // ignore
  }
  return [];
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(loadLocalUser);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(() =>
    loadLocalUser() ? "dashboard" : "splash",
  );
  const [navParams, setNavParams] = useState<Record<string, string>>({});
  const [trips, setTrips] = useState<Trip[]>(() => {
    const user = loadLocalUser();
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`trillz_trips_${user.principal}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [arrivedAt, setArrivedAt] = useState<string[]>(() => {
    const user = loadLocalUser();
    if (!user) return [];
    try {
      const saved = localStorage.getItem(`trillz_arrived_${user.principal}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const navigate = (newView: AppView, params: Record<string, string> = {}) => {
    setNavParams(params);
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleGetStarted = (name: string) => {
    const id = `local_${Date.now()}`;
    const user: User = {
      principal: id,
      displayName: name,
      createdAt: new Date().toISOString(),
    };
    // Store pending user, go to language select
    setPendingUser(user);
    navigate("languageSelect");
  };

  const handleLogin = (name: string): boolean => {
    const accounts = loadAccounts();
    const found = accounts.find(
      (u) => u.displayName.toLowerCase() === name.toLowerCase(),
    );
    if (!found) return false;
    // Go to language select before dashboard
    setPendingUser(found);
    navigate("languageSelect");
    return true;
  };

  const handleLanguageContinue = (language: string) => {
    if (!pendingUser) return;
    const userWithLang: User = { ...pendingUser, language };
    localStorage.setItem("trillz_user", JSON.stringify(userWithLang));
    // Add to accounts list if new user
    const accounts = loadAccounts();
    const exists = accounts.find((u) => u.principal === userWithLang.principal);
    if (!exists) {
      accounts.push(userWithLang);
      localStorage.setItem("trillz_accounts", JSON.stringify(accounts));
    } else {
      const updated = accounts.map((u) =>
        u.principal === userWithLang.principal ? userWithLang : u,
      );
      localStorage.setItem("trillz_accounts", JSON.stringify(updated));
    }
    // Load saved trips if returning user
    try {
      const savedTrips = localStorage.getItem(
        `trillz_trips_${userWithLang.principal}`,
      );
      if (savedTrips) setTrips(JSON.parse(savedTrips));
    } catch {
      /* ignore */
    }
    try {
      const savedArrived = localStorage.getItem(
        `trillz_arrived_${userWithLang.principal}`,
      );
      if (savedArrived) setArrivedAt(JSON.parse(savedArrived));
    } catch {
      /* ignore */
    }
    setCurrentUser(userWithLang);
    setPendingUser(null);
    navigate("dashboard");
  };

  const handleSaveTrip = (trip: Trip) => {
    if (!currentUser) return;
    setTrips((prev) => {
      const updated = [...prev, trip];
      localStorage.setItem(
        `trillz_trips_${currentUser.principal}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const handleDeleteTrip = (id: string) => {
    if (!currentUser) return;
    setTrips((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(
        `trillz_trips_${currentUser.principal}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const handleMarkArrived = (destId: string) => {
    if (!currentUser) return;
    setArrivedAt((prev) => {
      if (prev.includes(destId)) return prev;
      const updated = [...prev, destId];
      localStorage.setItem(
        `trillz_arrived_${currentUser.principal}`,
        JSON.stringify(updated),
      );
      setTrips((prevTrips) => {
        const updated2 = prevTrips.map((t) =>
          t.destinationId === destId ? { ...t, status: "Arrived" as const } : t,
        );
        localStorage.setItem(
          `trillz_trips_${currentUser.principal}`,
          JSON.stringify(updated2),
        );
        return updated2;
      });
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("trillz_user");
    setCurrentUser(null);
    setTrips([]);
    setArrivedAt([]);
    navigate("splash");
  };

  const currentDest = destinations.find(
    (d) => d.id === navParams.destinationId,
  );

  const showBottomNav =
    !!currentUser && view !== "splash" && view !== "languageSelect";

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ background: "oklch(0.14 0.04 236)" }}
    >
      <div className="w-full max-w-md relative">
        {view === "splash" && (
          <SplashScreen onGetStarted={handleGetStarted} onLogin={handleLogin} />
        )}

        {view === "languageSelect" && (
          <LanguageSelect onContinue={handleLanguageContinue} />
        )}

        {view === "dashboard" && currentUser && (
          <Dashboard
            user={currentUser}
            trips={trips}
            onDeleteTrip={handleDeleteTrip}
            onNavigate={navigate}
          />
        )}

        {view === "tripPlanner" && (
          <TripPlanner
            onBack={() => navigate("dashboard")}
            onSaveTrip={handleSaveTrip}
            onNavigate={navigate}
          />
        )}

        {view === "destinationDetail" && currentDest && (
          <DestinationDetail
            destination={currentDest}
            onBack={() => navigate("dashboard")}
            onNavigate={navigate}
            onMarkArrived={handleMarkArrived}
            arrivedAt={arrivedAt}
          />
        )}

        {view === "groupChat" && currentDest && currentUser && (
          <GroupChat
            destination={currentDest}
            currentUser={currentUser}
            onBack={() =>
              navigate("destinationDetail", { destinationId: currentDest.id })
            }
          />
        )}

        {view === "atDestination" && currentDest && (
          <AtDestination
            destination={currentDest}
            onBack={() =>
              navigate("destinationDetail", { destinationId: currentDest.id })
            }
          />
        )}

        {view === "profile" && currentUser && (
          <Profile user={currentUser} trips={trips} onLogout={handleLogout} />
        )}

        {view === "explore" && <Explore onNavigate={navigate} />}

        {showBottomNav && (
          <BottomNav
            currentView={view}
            onNavigate={(v) => {
              if (v === "groupChat") {
                navigate("groupChat", { destinationId: destinations[0].id });
              } else {
                navigate(v);
              }
            }}
          />
        )}

        <Toaster />
      </div>
    </div>
  );
}

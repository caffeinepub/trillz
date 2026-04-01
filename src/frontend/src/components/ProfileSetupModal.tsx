import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onComplete: (displayName: string) => void;
}

export function ProfileSetupModal({ open, onComplete }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync, isPending } = useSaveCallerUserProfile();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setError("");
    try {
      await mutateAsync({ name: trimmed });
      onComplete(trimmed);
    } catch {
      setError("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="border-0 p-0 max-w-sm mx-auto"
        style={{
          background: "oklch(0.14 0.04 236)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
        data-ocid="profile_setup.dialog"
        // Prevent closing by backdrop click during setup
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-7"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.22 0.055 236)" }}
            >
              👋
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Welcome to Trillz!
              </h2>
              <p className="text-trillz-dim text-xs">
                Let's set up your profile
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="flex flex-col gap-4"
            data-ocid="profile_setup.modal"
          >
            <div>
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-trillz-dim mb-2"
              >
                What should fellow travelers call you?
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya, Ravi, The Explorer"
                data-ocid="profile_setup.input"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-trillz-dim/50 focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: "oklch(0.22 0.055 236)",
                  border: "1px solid oklch(0.32 0.06 236)",
                  // @ts-ignore
                  "--tw-ring-color": "oklch(0.68 0.175 54 / 0.5)",
                }}
              />
              {error && (
                <p
                  className="text-red-400 text-xs mt-1.5"
                  data-ocid="profile_setup.error_state"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              data-ocid="profile_setup.submit_button"
              className="w-full py-3.5 rounded-2xl font-display font-bold text-base text-white transition-all duration-200 active:scale-95 hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "oklch(0.68 0.175 54)" }}
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Saving..." : "Start Exploring"}
            </button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

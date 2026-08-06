"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TrackForm() {
  const router = useRouter();
  const [ticket, setTicket] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = ticket.trim().toUpperCase();
    if (value) router.push(`/track/${value}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={ticket}
        onChange={(e) => setTicket(e.target.value)}
        placeholder="e.g. FB-7K2M9A"
        maxLength={12}
        autoFocus
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={!ticket.trim()}
        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Track
      </button>
    </form>
  );
}

import { useEffect, useState } from "react";
import { progressService } from "../services/progress.service";

export function useProgress() {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadProgress() {
    setLoading(true);
    setError(null);

    try {
      const data = await progressService.getProgress();
      setProgressEntries(data);
    } catch {
      setError("Could not load progress.");
    } finally {
      setLoading(false);
    }
  }

  async function addProgress(payload) {
    const created = await progressService.createProgress(payload);
    setProgressEntries((prev) => [...prev, created]);
    return created;
  }

  async function editProgress(id, payload) {
    const updated = await progressService.updateProgress(id, payload);

    setProgressEntries((prev) =>
      prev.map((entry) =>
        Number(entry.progressId) === Number(id) ? updated : entry
      )
    );

    return updated;
  }

  async function removeProgress(id) {
    await progressService.deleteProgress(id);

    setProgressEntries((prev) =>
      prev.filter((entry) => Number(entry.progressId) !== Number(id))
    );
  }

  useEffect(() => {
    loadProgress();
  }, []);

  return {
    progressEntries,
    loading,
    error,
    loadProgress,
    addProgress,
    editProgress,
    removeProgress,
  };
}
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import { useProgress } from "../hooks/useProgress";
import ProgressCard from "../components/ProgressCard";
import ProgressChart from "../components/ProgressChart";
import styles from "./ProgressPage.module.css";

export default function ProgressPage() {
  const { progressEntries, loading, error } = useProgress();

  return (
    <div className={styles.page}>
      <SectionHeader title="Progress" breadcrumb="Home > Progress > Weekly Progress" />

      <div className={styles.body}>
        {loading && <EmptyState message="Loading progress..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && progressEntries.length === 0 && (
          <EmptyState message="No progress entries yet." />
        )}

        {!loading && !error && progressEntries.length > 0 && (
          <>
            <ProgressChart entries={progressEntries} />
            <div className={styles.grid}>
              {progressEntries.map((entry) => (
                <ProgressCard key={entry.progressId} entry={entry} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
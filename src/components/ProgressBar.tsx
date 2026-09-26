import { motion } from "motion/react"

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  )
}

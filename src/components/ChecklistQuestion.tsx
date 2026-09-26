import { useState } from "react"
import { ChevronLeft, HelpCircle, RotateCcw } from "lucide-react"
import { motion } from "motion/react"
import type { ChecklistNode } from "../data/types"
import { GlossedText } from "./GlossedText"

export function ChecklistQuestion({
  node,
  canGoBack,
  onContinue,
  onBack,
  onReset,
}: {
  node: ChecklistNode
  canGoBack: boolean
  onContinue: (nextId: string, label: string) => void
  onBack: () => void
  onReset: () => void
}) {
  const [showHelp, setShowHelp] = useState(false)
  const [checked, setChecked] = useState<boolean[]>(() => node.items.map(() => false))
  const [confirmed, setConfirmed] = useState(false)
  const [locked, setLocked] = useState(false)

  const checkedCount = checked.filter(Boolean).length
  const allChecked = checkedCount === node.items.length && confirmed

  function toggle(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  function handleContinue() {
    if (locked) return
    setLocked(true)
    const label = allChecked
      ? `Checked all ${node.items.length} identifiers, confirmed no re-identification risk`
      : `Checked ${checkedCount} of ${node.items.length} identifiers${confirmed ? "" : ", re-identification risk not confirmed"}`
    onContinue(allChecked ? node.allCheckedNext : node.notAllCheckedNext, label)
  }

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/60"
    >
      {node.eyebrow && (
        <p className="mb-3 text-xs font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
          {node.eyebrow}
        </p>
      )}

      {node.intro && (
        <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {node.intro}
        </p>
      )}

      <h2 className="text-lg font-semibold text-balance text-slate-900 sm:text-xl dark:text-slate-50">
        <GlossedText text={node.text} />
      </h2>

      {node.help && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <HelpCircle className="h-4 w-4" />
            {showHelp ? "Hide explanation" : "What does this mean?"}
          </button>
          {showHelp && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
            >
              {node.help}
            </motion.p>
          )}
        </div>
      )}

      <ul className="mt-5 space-y-2">
        {node.items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                disabled={locked}
                className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span><GlossedText text={item} /></span>
            </label>
          </li>
        ))}
      </ul>

      <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={() => setConfirmed((v) => !v)}
          disabled={locked}
          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
        />
        <span><GlossedText text={node.confirmText} /></span>
      </label>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {checkedCount} of {node.items.length} identifiers checked
        {confirmed ? ", knowledge confirmation checked" : ""}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={locked}
          onClick={handleContinue}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-60"
        >
          Continue
        </button>
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
      </div>
    </motion.div>
  )
}

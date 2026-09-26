import { useState } from "react"
import { ChevronLeft, HelpCircle, RotateCcw } from "lucide-react"
import { motion } from "motion/react"
import type { QuestionNode } from "../data/types"
import { GlossedText } from "./GlossedText"

export function QuestionCard({
  node,
  canGoBack,
  onAnswer,
  onBack,
  onReset,
}: {
  node: QuestionNode
  canGoBack: boolean
  onAnswer: (nextId: string, label: string) => void
  onBack: () => void
  onReset: () => void
}) {
  const [showHelp, setShowHelp] = useState(false)
  const [locked, setLocked] = useState(false)

  function handleAnswer(nextId: string, label: string) {
    if (locked) return
    setLocked(true)
    onAnswer(nextId, label)
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

      <div className="mt-6 flex flex-col gap-3">
        {node.answers.map((answer) => (
          <button
            key={answer.label}
            type="button"
            disabled={locked}
            onClick={() => handleAnswer(answer.next, answer.label)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:border-blue-400 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-60 sm:text-base dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
          >
            <GlossedText text={answer.label} />
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
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

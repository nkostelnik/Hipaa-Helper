import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { TreeStep } from "../data/types"

export function AnswerTrail({ steps }: { steps: TreeStep[] }) {
  const [expanded, setExpanded] = useState(false)

  if (steps.length === 0) return null

  return (
    <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="no-print flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300"
      >
        Your answers ({steps.length})
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <ol
        className={`hidden space-y-3 border-t border-slate-200 px-4 py-4 text-sm print:block print:border-0 print:px-0 print:py-0 dark:border-slate-800 ${
          expanded ? "!block" : ""
        }`}
      >
        {steps.map((step, i) => (
          <li key={`${step.nodeId}-${i}`}>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {i + 1}. {step.questionText}
            </p>
            <p className="mt-0.5 text-slate-500 dark:text-slate-400">
              Answer: {step.answerLabel}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

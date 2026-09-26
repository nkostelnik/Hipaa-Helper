import { CheckCircle2, Printer, RotateCcw, ShieldAlert } from "lucide-react"
import { motion } from "motion/react"
import type { ResultNode, TreeStep } from "../data/types"
import { AnswerTrail } from "./AnswerTrail"

export function ResultCard({
  node,
  steps,
  flags,
  onReset,
}: {
  node: ResultNode
  steps: TreeStep[]
  flags: Record<string, boolean>
  onReset: () => void
}) {
  const generatedOn = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8 print:border-0 print:shadow-none dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/60"
    >
      <div className="hidden print:mb-6 print:block">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
          HIPAA Helper: BAA determination
        </p>
        <p className="text-xs text-slate-400">Generated {generatedOn}</p>
      </div>

      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            node.baaRequired
              ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-400"
              : "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-400"
          }`}
        >
          {node.baaRequired ? (
            <ShieldAlert className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-balance text-slate-900 sm:text-xl dark:text-slate-50">
            {node.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base dark:text-slate-400">
            {node.summary}
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {node.explanation}
      </p>

      <div className="mt-5">
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          Legal citations
        </h3>
        <ul className="mt-2 space-y-1.5">
          {node.citations.map((c) => (
            <li key={c.cite} className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-mono text-slate-800 dark:text-slate-200">{c.cite}</span>
              {c.note && <span className="text-slate-500 dark:text-slate-500"> - {c.note}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          Next steps
        </h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4">
          {node.nextSteps.map((step) => (
            <li key={step} className="text-sm text-slate-600 dark:text-slate-400">
              {step}
            </li>
          ))}
        </ul>
      </div>

      {flags.isSubcontractor && node.baaRequired && (
        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
          <strong>Subcontractor note:</strong> Because the other organization is
          itself a business associate rather than the covered entity, any BAA
          here would be between your organization and that business associate,
          not directly with the covered entity. Subcontractors of a business
          associate are themselves treated as business associates under 45 CFR
          § 160.103, so the same requirement carries down the chain.
        </div>
      )}

      <AnswerTrail steps={steps} />

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
          Start over
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-800"
        >
          <Printer className="h-4 w-4" />
          Print / save summary
        </button>
      </div>

      <p className="no-print mt-4 text-xs text-slate-400 dark:text-slate-500">
        This tool provides general educational guidance, not legal advice.
        For a specific relationship, confirm with privacy counsel.
      </p>
    </motion.div>
  )
}

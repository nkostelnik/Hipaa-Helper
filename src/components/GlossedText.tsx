import type { ReactNode } from "react"
import { glossaryTerms, type GlossaryEntry } from "../data/glossary"

// Sorted longest-pattern-first so a combined alternation prefers a longer,
// more specific phrase (e.g. "business associate agreement") over a shorter
// one it contains (e.g. "business associate") when both could start at the
// same position.
const sortedTerms = [...glossaryTerms].sort((a, b) => b.pattern.length - a.pattern.length)
const combinedRegex = new RegExp(`\\b(?:${sortedTerms.map((t) => t.pattern).join("|")})\\b`, "gi")

function findEntry(matched: string): GlossaryEntry | undefined {
  return glossaryTerms.find((g) => new RegExp(`^(?:${g.pattern})$`, "i").test(matched))
}

function GlossaryTerm({ termText, entry }: { termText: string; entry: GlossaryEntry }) {
  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        className="cursor-help font-bold underline decoration-2 underline-offset-2 decoration-blue-400 outline-none dark:decoration-blue-500"
      >
        {termText}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 max-w-[80vw] -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-xs font-normal normal-case text-slate-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <span className="block leading-relaxed">{entry.definition}</span>
        <span className="mt-1.5 block font-mono text-[10px] text-slate-500 dark:text-slate-400">
          {entry.citation}
        </span>
      </span>
    </span>
  )
}

/** Renders text with any HIPAA-defined terms bolded, underlined, and given a
 * hover/focus tooltip with the definition and citation. Falls back to plain
 * text when nothing matches. */
export function GlossedText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  combinedRegex.lastIndex = 0
  while ((match = combinedRegex.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const entry = findEntry(match[0])
    if (entry) {
      nodes.push(<GlossaryTerm key={key++} termText={match[0]} entry={entry} />)
    } else {
      nodes.push(match[0])
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  return <>{nodes}</>
}

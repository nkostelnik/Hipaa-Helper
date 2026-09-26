import { Building2 } from "lucide-react"

/** Small persistent card that names the user's own HIPAA classification
 * (health care provider, health plan, clearinghouse, or business associate)
 * once the entity-classification questions have determined it. Renders
 * nothing until then. */
export function EntityBadge({ flags }: { flags: Record<string, boolean> }) {
  if (!flags.classified) return null

  const label = flags.isUserBA
    ? "Business Associate"
    : flags.entityIsProvider
      ? "Health Care Provider"
      : flags.entityIsHealthPlan
        ? "Health Plan"
        : flags.entityIsClearinghouse
          ? "Health Care Clearinghouse"
          : "Covered Entity"

  const kindNote = flags.isUserBA
    ? "not a covered entity yourself"
    : "a covered entity"

  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm dark:border-blue-900 dark:bg-blue-950/40">
      <Building2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
      <span className="text-blue-900 dark:text-blue-200">
        You're a <span className="font-semibold">{label}</span>
        <span className="text-blue-700/80 dark:text-blue-300/80"> ({kindNote})</span>
      </span>
    </div>
  )
}

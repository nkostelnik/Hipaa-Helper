export interface GlossaryEntry {
  /** Regex source (no boundary anchors), case-insensitive. May itself be an
   * alternation, e.g. "health care clearinghouse|clearinghouse". */
  pattern: string
  definition: string
  citation: string
}

/**
 * Terms defined by HIPAA that show up in question or answer text. Anything
 * matching one of these gets bolded, underlined, and given a hover/focus
 * tooltip with the definition and citation, via <GlossedText>.
 *
 * Kept intentionally short and only for terms actually likely to appear in
 * plain-language question and answer text, not every term HIPAA defines.
 */
export const glossaryTerms: GlossaryEntry[] = [
  {
    pattern: "business associate agreement|BAA",
    definition:
      "Short for Business Associate Agreement: the written contract required before PHI can be shared with a business associate or subcontractor, covering permitted uses, safeguards, breach notification, and related terms.",
    citation: "45 CFR § 164.504(e)",
  },
  {
    pattern: "business associate",
    definition:
      "A person or entity that creates, receives, maintains, or transmits protected health information to perform a function, activity, or service on behalf of a covered entity, or on behalf of another business associate.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "covered entity",
    definition:
      "A health plan, a health care clearinghouse, or a health care provider who transmits health information electronically in connection with certain standard transactions, like billing.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "health care provider",
    definition:
      "A provider of medical or health services, and any other person or organization who furnishes, bills, or is paid for health care in the normal course of business.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "health care clearinghouse|clearinghouse",
    definition:
      "An entity that processes health information it receives from another entity into a standard format, or the reverse, such as a billing service or repricing company.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "health plan",
    definition:
      "An individual or group plan that provides or pays the cost of medical care, including a group health plan, a health insurance issuer, an HMO, Medicare, Medicaid, and similar programs.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "workforce",
    definition:
      "Employees, volunteers, trainees, and other persons whose conduct, in the performance of work, is under the direct control of a covered entity or business associate, whether or not they are paid.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "subcontractor",
    definition:
      "A person to whom a business associate delegates a function, activity, or service involving protected health information, other than as a member of the business associate's own workforce.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "protected health information|\\bPHI\\b",
    definition:
      "Individually identifiable health information that is transmitted or maintained in any form by a covered entity or its business associate.",
    citation: "45 CFR § 160.103",
  },
  {
    pattern: "de-identified|de-identification",
    definition:
      "Health information that no longer identifies an individual, and for which there is no reasonable basis to believe it could be used to identify one.",
    citation: "45 CFR § 164.514(a)",
  },
  {
    pattern: "Safe Harbor method|Safe Harbor",
    definition:
      "One of two ways to de-identify data: removing all 18 listed categories of identifiers for the individual and their relatives, employers, and household members, with no actual knowledge that what remains could still identify someone.",
    citation: "45 CFR § 164.514(b)(2)",
  },
  {
    pattern: "actual knowledge",
    definition:
      "Under the Safe Harbor method, the organization does not meet the standard if it actually knows the remaining information could be used, alone or with other data, to identify the individual, even after removing every listed identifier.",
    citation: "45 CFR § 164.514(b)(2)(ii)",
  },
]

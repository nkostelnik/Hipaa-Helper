import type { TreeNode } from "./types"

/**
 * HIPAA Business Associate Agreement (BAA) decision tree.
 *
 * This encodes the analysis HHS uses under the HIPAA Privacy and Security
 * Rules for deciding whether a Business Associate Agreement is required:
 *   0. Is the user's own organization a health care provider, a health
 *      plan, or a health care clearinghouse, i.e. a covered entity? Asked
 *      as three separate plain factual yes/no questions, one category at
 *      a time, each with its definition built into the question itself,
 *      rather than one combined question or a self-diagnosis of "are you
 *      a business associate" (deciding that is the point of the tool, not
 *      something to ask the user to already know). Saying no to all three
 *      leads to a fourth, equally factual question, whether the user does
 *      work involving health information on behalf of a covered entity or
 *      another business associate, which is what actually makes someone a
 *      business associate rather than something to assume by elimination.
 *      Saying no to that too routes to result_not_covered, since HIPAA's
 *      business associate rules don't reach an organization that is
 *      neither. Each "yes" answer is followed by a one-line confirmation
 *      ("OK, sounds like you're a health care provider") before moving
 *      on, so the user sees their
 *      classification land before the substantive questions start.
 *   1. Is protected health information (PHI) involved at all?
 *   2. Is the recipient part of the covered entity's own workforce?
 *   3. Does the recipient perform a function or service on behalf of the
 *      covered entity (or a business associate) that involves PHI, or is
 *      this actually a treatment disclosure or a permitted public-interest
 *      disclosure?
 *   4. If it's a service, does a narrow exception apply: the conduit
 *      exception, the financial institution payment-processing exception,
 *      de-identified data (Safe Harbor's 18 identifiers), or is this
 *      actually a group health plan / plan sponsor arrangement, governed
 *      by its own certification process instead of a BAA?
 *
 * The uncommon exceptions (conduit, payment processing, de-identification,
 * plan sponsor) are offered together as a single plain-language multiple
 * choice question rather than four separate yes/no questions, so a normal
 * vendor relationship reaches its answer in about four short questions
 * instead of walking through every edge case first. Legal terms of art
 * (business associate, workforce, conduit, Safe Harbor, plan sponsor) are
 * kept out of the question text itself and explained in help text or
 * citations instead.
 *
 * Whether the user's own organization is a covered entity or a business
 * associate (set as the isUserBA flag on step 0) doesn't change which
 * result node the rest of the tree lands on, it only changes how
 * result_baa_required is explained: a covered entity's BAA runs straight
 * to its vendor, a business associate's runs to its subcontractor, but
 * the requirement itself is the same either way. See the isUserBA check
 * in ResultCard.tsx.
 *
 * This is educational guidance, not legal advice. It simplifies real
 * edge cases so they can be reasoned through in plain language; anything
 * routed to "result_unclear" or flagged as close should go to counsel.
 */
export const startNodeId = "isProvider"

export const decisionTree: Record<string, TreeNode> = {
  isProvider: {
    id: "isProvider",
    type: "question",
    eyebrow: "About your organization",
    intro: "Let's find out who you are in this picture, one category at a time.",
    text: "Are you a health care provider: someone who provides medical or health services and bills or is paid for them in the normal course of business, like a doctor's office, hospital, clinic, or pharmacy?",
    answers: [
      { label: "Yes, that's us", next: "confirmProvider" },
      { label: "No, that's not us", next: "isHealthPlan" },
    ],
  },

  isHealthPlan: {
    id: "isHealthPlan",
    type: "question",
    eyebrow: "About your organization",
    intro: "Not a health care provider. Let's check the next category.",
    text: "Are you a health plan: an individual or group plan that provides or pays the cost of medical care, like a health insurer, an HMO, Medicare, Medicaid, or a similar program?",
    answers: [
      { label: "Yes, that's us", next: "confirmHealthPlan" },
      { label: "No, that's not us", next: "isClearinghouse" },
    ],
  },

  isClearinghouse: {
    id: "isClearinghouse",
    type: "question",
    eyebrow: "About your organization",
    intro: "Not a health plan either. One more category to check.",
    text: "Are you a health care clearinghouse: an entity that processes health information it receives from another entity into a standard format, or the reverse, such as a billing or repricing service?",
    answers: [
      { label: "Yes, that's us", next: "confirmClearinghouse" },
      { label: "No, none of those describe us", next: "isBusinessAssociate" },
    ],
  },

  isBusinessAssociate: {
    id: "isBusinessAssociate",
    type: "question",
    eyebrow: "About your organization",
    intro: "Not a covered entity, then. Let's check one more thing before moving on.",
    text: "Do you perform a function, activity, or service involving health information on behalf of a health care provider, health plan, or clearinghouse, or on behalf of another business associate that already works for one of those, things like billing, IT, consulting, transcription, or software?",
    help: "This is what actually makes an organization a business associate: not being a covered entity yourself, but doing work that involves health information on behalf of one, whether directly or one step removed through another vendor.",
    answers: [
      { label: "Yes, that's us", next: "confirmBA" },
      { label: "No, that's not us either", next: "result_not_covered" },
    ],
  },

  confirmProvider: {
    id: "confirmProvider",
    type: "question",
    text: "OK, sounds like you're a health care provider.",
    answers: [{ label: "Continue", next: "start", flags: { isUserBA: false } }],
  },

  confirmHealthPlan: {
    id: "confirmHealthPlan",
    type: "question",
    text: "OK, sounds like you're a health plan.",
    answers: [{ label: "Continue", next: "start", flags: { isUserBA: false } }],
  },

  confirmClearinghouse: {
    id: "confirmClearinghouse",
    type: "question",
    text: "OK, sounds like you're a health care clearinghouse.",
    answers: [{ label: "Continue", next: "start", flags: { isUserBA: false } }],
  },

  confirmBA: {
    id: "confirmBA",
    type: "question",
    text: "OK, sounds like you're a business associate rather than a covered entity yourself.",
    answers: [{ label: "Continue", next: "start", flags: { isUserBA: true } }],
  },

  start: {
    id: "start",
    type: "question",
    eyebrow: "Step 1 of 5",
    intro: "Let's find out whether patient health information is even part of what you're sharing with them.",
    text: "Will they see, use, or store any of your patients' health information, things like medical records, diagnoses, treatment notes, or insurance claims?",
    help: "This includes things like patient names linked to diagnoses, treatment notes, billing records, appointment details, or insurance claims. It does not include health information that has had all identifying details stripped out.",
    answers: [
      { label: "Yes, it involves that kind of health information", next: "workforce" },
      { label: "No, or I'm not sure it counts as health information", next: "result_no_phi" },
    ],
  },

  workforce: {
    id: "workforce",
    type: "question",
    eyebrow: "Step 2 of 5",
    intro: "Let's find out whether they're on your team or outside it.",
    text: "Is this person actually part of your own team, an employee, intern, or volunteer working under your direct supervision, rather than a separate outside company?",
    help: "Think of this broadly: it covers anyone who works under your organization's direct supervision, paid or not. It does not cover an outside company or independent contractor, even a long-term one.",
    answers: [
      { label: "Yes, they're part of our own team", next: "result_workforce" },
      { label: "No, they're a separate outside party", next: "whyTheyHaveIt" },
    ],
  },

  whyTheyHaveIt: {
    id: "whyTheyHaveIt",
    type: "question",
    eyebrow: "Step 3 of 5",
    intro: "Let's find out why they have this information in the first place.",
    text: "Which of these best describes why this person or company has, or will have, this information?",
    help: "Pick the one that fits best. \"Paid work for us\" covers anything from billing and IT to consulting, transcription, or software that stores patient data. If none of these quite fit, choose the last option and this tool will flag it for a closer look.",
    answers: [
      {
        label: "They're doing paid work for us that touches this data, like billing, IT, consulting, transcription, or software",
        next: "exceptions",
      },
      {
        label: "They're another doctor, clinic, or hospital who will also be treating this same patient, for example a referral",
        next: "result_treatment",
      },
      {
        label: "They're a government agency, court, or independent researcher with their own legal right to it, not doing work for us",
        next: "result_public_interest",
      },
      { label: "None of these describe it", next: "result_unclear" },
    ],
  },

  exceptions: {
    id: "exceptions",
    type: "question",
    eyebrow: "Step 4 of 5",
    intro: "Let's rule out a few special situations before we go further.",
    text: "A few uncommon situations change the answer. Does any of these describe this specific relationship? If not, just choose the last option.",
    help: "These are all narrow, specific situations. If you're not sure any of them really fits, they probably don't, choose \"None of these.\"",
    answers: [
      {
        label: "They only transport or briefly pass the data through, without any real ability to look at it, like a mail courier, delivery service, or an internet provider just carrying the traffic",
        next: "result_conduit",
      },
      {
        label: "They're a bank or payment processor whose only role is handling a payment the patient or member directly initiated, like a credit card charge",
        next: "result_financial",
      },
      {
        label: "All identifying details (name, address, birth date, ID numbers, and so on) have already been stripped out, so it can't be traced back to a specific person",
        next: "deidentifiedChecklist",
      },
      {
        label: "They're actually the employer that sponsors our health plan, and they need this data to help run the plan itself",
        next: "planSponsorCert",
      },
      {
        label: "None of these, it's a normal vendor or service relationship",
        next: "result_baa_required",
      },
    ],
  },

  planSponsorCert: {
    id: "planSponsorCert",
    type: "question",
    eyebrow: "Step 5 of 5",
    intro: "Let's check whether the paperwork is already in place.",
    text: "Have the health plan's plan documents been amended to include the required certifications, such as restricting the employer's use of this data to plan administration, prohibiting employment decisions based on it, and keeping it walled off from the employer's other functions?",
    help: "This amendment-and-certification process is what HIPAA requires here instead of a standard Business Associate Agreement.",
    answers: [
      { label: "Yes, the plan documents are amended and certified", next: "result_plan_sponsor_ok" },
      { label: "No, or I'm not sure", next: "result_plan_sponsor_needed" },
    ],
  },

  deidentifiedChecklist: {
    id: "deidentifiedChecklist",
    type: "checklist",
    eyebrow: "Step 5 of 5",
    intro: "Let's confirm the data is genuinely de-identified.",
    text: "HIPAA has a specific test for this, called the Safe Harbor method. Data only counts as de-identified once every one of these has been removed for the individual and for their relatives, employers, and household members. Check off each one that has actually been removed:",
    help: "Removing just a name usually isn't enough. If even one of these categories remains and could point back to a specific person, the data is still PHI and this exception doesn't apply.",
    items: [
      "Names",
      "Geographic subdivisions smaller than a state (street address, city, county, precinct, ZIP code)",
      "All elements of dates (other than year) tied to an individual: birth date, admission date, discharge date, date of death, and ages over 89",
      "Telephone numbers",
      "Fax numbers",
      "Email addresses",
      "Social Security numbers",
      "Medical record numbers",
      "Health plan beneficiary numbers",
      "Account numbers",
      "Certificate or license numbers",
      "Vehicle identifiers and serial numbers, including license plates",
      "Device identifiers and serial numbers",
      "Web URLs",
      "IP addresses",
      "Biometric identifiers, including fingerprints and voiceprints",
      "Full-face photographs and comparable images",
      "Any other unique identifying number, characteristic, or code",
    ],
    confirmText:
      "The organization also has no actual knowledge that the remaining information could still be used, alone or combined with other data, to identify the person.",
    allCheckedNext: "result_deidentified",
    notAllCheckedNext: "result_baa_required",
  },

  result_no_phi: {
    id: "result_no_phi",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: this doesn't involve protected health information",
    summary: "A Business Associate Agreement is only required when protected health information (PHI) is involved. Based on your answer, it isn't here.",
    explanation:
      "HIPAA's Privacy and Security Rules, and the BAA requirement in particular, are triggered by the use or disclosure of protected health information, meaning individually identifiable health information held or transmitted by a covered entity or its business associate. If no such information is involved, there is no business associate relationship to document, regardless of how the parties otherwise relate to each other.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definitions of \"protected health information\" and \"business associate\"" },
      { cite: "45 CFR § 164.502(a)", note: "general rule limiting uses and disclosures of PHI" },
    ],
    nextSteps: [
      "Double-check that no identifiable health data (even indirectly, like a name plus an appointment time) is actually changing hands.",
      "If the answer is close, treat the data as PHI and re-run this tool, or ask counsel to confirm.",
    ],
  },

  result_not_covered: {
    id: "result_not_covered",
    type: "result",
    baaRequired: false,
    title: "HIPAA's business associate rules may not reach your organization",
    summary: "A Business Associate Agreement is only ever required from a covered entity or a business associate. Based on your answers, your organization is neither, so HIPAA doesn't require you to get one from this outside party, though that classification is worth double-checking.",
    explanation:
      "HIPAA's business associate rules attach only to covered entities (health care providers who bill electronically, health plans, and health care clearinghouses) and their business associates (organizations performing a function, activity, or service involving health information on behalf of one). An organization that is neither doesn't have a HIPAA-driven duty to sign a BAA with its own vendors, even if those vendors happen to touch health-related data. That said, this classification is easy to get wrong: an app, platform, or service that handles health information on behalf of a covered entity, even informally, without a fee, or without fully realizing it, can become a business associate in its own right. Don't rely on this result alone if there's any real chance your organization is doing work for a covered entity or another business associate.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definitions of \"covered entity\" and \"business associate\"" },
      { cite: "45 CFR § 164.502(e)(1)(i)-(ii)", note: "the BAA requirement runs from a covered entity or a business associate to its own vendor" },
    ],
    nextSteps: [
      "Double-check that your organization isn't unintentionally acting as a business associate, for example by receiving health information to perform a function on behalf of a covered entity.",
      "If you're not sure, treat this as a case for a quick check with privacy counsel rather than a final answer.",
    ],
  },

  result_plan_sponsor_ok: {
    id: "result_plan_sponsor_ok",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: this is a certified plan sponsor arrangement",
    summary: "A group health plan may share PHI with its plan sponsor for plan administration once the plan documents are amended and certified, this substitutes for a Business Associate Agreement.",
    explanation:
      "HIPAA treats a group health plan's disclosures to its own plan sponsor as a special case, governed by plan document amendments and a certification from the plan sponsor rather than a standard BAA. Once those safeguards are in place (restricting use to plan administration, barring employment-related decisions based on the data, and firewalling it from the employer's other functions), the plan may share the data described in those documents.",
    citations: [
      { cite: "45 CFR § 164.504(f)", note: "requirements for group health plan disclosures to a plan sponsor" },
    ],
    nextSteps: [
      "Confirm the actual data being shared matches what the amended plan documents describe, expanding the data flow later may require updating the certification.",
      "Revisit this periodically, plan sponsor personnel and use cases change.",
    ],
  },

  result_plan_sponsor_needed: {
    id: "result_plan_sponsor_needed",
    type: "result",
    baaRequired: true,
    title: "Action needed: plan document amendment and certification required, not a standard BAA",
    summary: "A group health plan cannot share this data with its plan sponsor for plan administration until the plan documents are amended and the plan sponsor certifies compliance.",
    explanation:
      "This is not a business associate relationship, so a standard BAA is not the right tool. Instead, HIPAA requires the plan documents to be amended to include specific restrictions, and the plan sponsor must certify it will comply with them, before this kind of plan-administration data can be shared.",
    citations: [
      { cite: "45 CFR § 164.504(f)", note: "requirements for group health plan disclosures to a plan sponsor" },
    ],
    nextSteps: [
      "Work with counsel to amend the plan documents and obtain the plan sponsor's certification before sharing this data.",
      "In the meantime, limit what's shared to the narrow categories HIPAA allows without this certification, such as enrollment and disenrollment information.",
    ],
  },

  result_workforce: {
    id: "result_workforce",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: this is an internal workforce member",
    summary: "Employees, volunteers, and trainees under an organization's direct control are part of its own workforce, not a separate business associate.",
    explanation:
      "A Business Associate Agreement documents a relationship between two separate legal entities. Members of a covered entity's own workforce are already bound by that organization's HIPAA policies, training, and sanctions, so no separate contract is required. This holds even if the workforce member routinely handles PHI as part of their job.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definition of \"workforce\"" },
      { cite: "45 CFR § 164.530(b), (c)", note: "training and safeguard duties an organization owes its own workforce" },
    ],
    nextSteps: [
      "Confirm the person is truly under this organization's direct control, and not, say, an independent contractor or staffing-agency worker treated as outside personnel.",
      "Make sure they've received HIPAA workforce training, which is required regardless of the BAA question.",
    ],
  },

  result_treatment: {
    id: "result_treatment",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: this is a treatment disclosure",
    summary: "Sharing PHI between health care providers for the treatment of the same patient falls under HIPAA's treatment exception, not the business associate rules.",
    explanation:
      "HIPAA allows covered entities to disclose PHI for treatment purposes, including referrals and coordination of care between providers, without a Business Associate Agreement. The rationale is that a treating provider is not performing a service on behalf of the referring provider. This exception is limited to genuine treatment coordination; if the same party is also handling billing, hosting, or another administrative function, that separate function may still require a BAA.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definition of \"business associate\" excludes a health care provider receiving disclosures from a covered entity concerning the treatment of the individual" },
      { cite: "45 CFR § 164.506(c)", note: "permitted uses and disclosures for treatment" },
    ],
    nextSteps: [
      "If this same outside party will also provide a non-treatment service (billing, analytics, storage), evaluate that separately, it likely does need a BAA.",
      "Keep this disclosure limited to what's needed for the patient's treatment.",
    ],
  },

  result_public_interest: {
    id: "result_public_interest",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: this is a permitted public-interest or research disclosure",
    summary: "Disclosures to public health authorities, oversight agencies, courts, or researchers under a recognized exception are permitted directly by HIPAA and don't create a business associate relationship.",
    explanation:
      "A public health authority investigating an outbreak, a court enforcing a valid order, or a researcher relying on an authorization, an IRB or privacy board waiver, or a limited data set agreement is not performing a function on your organization's behalf, they're exercising independent authority or a standalone HIPAA exception. That means the business associate rules, including the BAA requirement, don't apply to that disclosure. A limited data set shared for research, public health, or health care operations still needs a separate, lighter-weight data use agreement, which is not the same thing as a BAA.",
    citations: [
      { cite: "45 CFR § 164.512", note: "uses and disclosures for public health, judicial, law enforcement, and research purposes that don't require authorization or a BAA" },
      { cite: "45 CFR § 164.514(e)", note: "limited data sets and the data use agreement requirement" },
    ],
    nextSteps: [
      "If this same outside party will also perform a paid service for your organization involving other PHI, evaluate that role separately.",
      "If a limited data set is involved, put a data use agreement in place, it's required even though it isn't a BAA.",
    ],
  },

  result_deidentified: {
    id: "result_deidentified",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: the data meets the Safe Harbor de-identification standard",
    summary: "Information that meets HIPAA's Safe Harbor standard is no longer protected health information, so the business associate rules don't apply to it.",
    explanation:
      "HIPAA offers two ways to de-identify data: an expert formally certifies the re-identification risk is very small, or the organization strips all 18 Safe Harbor identifier categories and has no actual knowledge the remaining data could still identify someone. Based on your checklist, that standard is met here. Once data is properly de-identified, it falls outside HIPAA's protections entirely, including the BAA requirement, for as long as it stays de-identified.",
    citations: [
      { cite: "45 CFR § 164.514(a)", note: "standard for de-identification" },
      { cite: "45 CFR § 164.514(b)(2)", note: "Safe Harbor method and its 18 identifier categories" },
    ],
    nextSteps: [
      "Make sure the recipient has no separate way to re-identify individuals, for example a shared key or code they could reverse.",
      "If any identifiable data will flow back to you, or new fields get added later, re-run this checklist, the exception only holds while the data stays properly de-identified.",
    ],
  },

  result_conduit: {
    id: "result_conduit",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: this fits the narrow conduit exception",
    summary: "Entities that merely transport data in transit, without meaningful access to it, are not business associates.",
    explanation:
      "The conduit exception covers services like postal mail, courier companies, and internet service providers that move data through without accessing it beyond what's needed for the transport itself. HHS has repeatedly stressed this exception is narrow: any access that is more than transient or incidental, such as a cloud storage or hosting vendor that could view or retain the data, takes the arrangement out of the exception, even if the data happens to be encrypted.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definition of \"business associate\", conduit language" },
      { cite: "78 Fed. Reg. 5566, 5571", note: "HHS Omnibus Rule preamble (Jan. 25, 2013), explaining the conduit exception" },
    ],
    nextSteps: [
      "Re-check this one carefully, most vendors that store, host, or back up data are not conduits even if they call themselves one.",
      "If the vendor has any standing ability to log in and view the data, treat them as a business associate instead.",
    ],
  },

  result_financial: {
    id: "result_financial",
    type: "result",
    baaRequired: false,
    title: "No BAA needed: ordinary payment processing",
    summary: "A financial institution merely processing a payment the patient initiated is not acting as a business associate for that function.",
    explanation:
      "HHS has explained that a financial institution is not a business associate when it is simply processing consumer-conducted financial transactions, such as clearing a check or a credit card payment, using the account information necessary to do that. This is narrow: a billing company, clearinghouse, or payment platform that also touches claims data or patient account details for the health care organization is a business associate for that broader role.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definition of \"business associate\"" },
      { cite: "65 Fed. Reg. 82476, 82601", note: "HHS Privacy Rule preamble (Dec. 28, 2000), financial institution exclusion" },
    ],
    nextSteps: [
      "Make sure the vendor's role really is limited to clearing the payment itself, not managing the broader billing or claims relationship.",
      "If they also do eligibility checks, claims submission, or revenue cycle work, evaluate that part separately.",
    ],
  },

  result_baa_required: {
    id: "result_baa_required",
    type: "result",
    baaRequired: true,
    title: "A BAA is required",
    summary: "This outside party creates, receives, maintains, or transmits PHI to perform a service on behalf of the organization, and no exception applies.",
    explanation:
      "This relationship fits HIPAA's definition of a business associate: an outside person or entity that performs a function, activity, or service involving PHI on behalf of a covered entity (or another business associate). A written Business Associate Agreement must be in place before PHI is shared. If the outside party will delegate any part of this work to its own vendors who will also touch the PHI, those subcontractors are themselves treated as business associates and need their own BAA with the party that hired them.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definition of \"business associate\" and \"subcontractor\"" },
      { cite: "45 CFR § 164.502(e)(1)(i)", note: "PHI may not be disclosed to a business associate without satisfactory assurances (a BAA)" },
      { cite: "45 CFR § 164.502(e)(1)(ii)", note: "the same applies when a business associate discloses PHI to its own subcontractor" },
      { cite: "45 CFR § 164.504(e)", note: "required contents of a Business Associate Agreement" },
    ],
    nextSteps: [
      "Put a written BAA in place before any PHI is shared, don't rely on a verbal or informal understanding.",
      "Make sure the BAA covers permitted uses, safeguards, breach notification, subcontractor flow-down, and return or destruction of data at the end of the relationship.",
      "If this party uses its own subcontractors who will touch the PHI, confirm they have BAAs in place with those subcontractors too.",
    ],
  },

  result_unclear: {
    id: "result_unclear",
    type: "result",
    baaRequired: false,
    title: "This needs a closer look",
    summary: "Based on your answers, this doesn't clearly fit the business associate definition, but it also doesn't clearly fit a standard exception. Treat this as a case for direct review rather than a final answer.",
    explanation:
      "HIPAA's business associate definition turns on whether an outside party is performing a function or service on behalf of a covered entity that involves PHI. If that's not happening, and it's also not a treatment disclosure or a permitted public-interest disclosure, the relationship may still fall under a separate HIPAA provision this simplified tool doesn't fully cover, or it may not be a HIPAA-regulated disclosure at all.",
    citations: [
      { cite: "45 CFR § 160.103", note: "definition of \"business associate\"" },
      { cite: "45 CFR § 164.512", note: "uses and disclosures that don't require authorization or a BAA (public health, law enforcement, and similar categories)" },
    ],
    nextSteps: [
      "Describe the specific reason the data is being shared, it may fall under a separate permitted-disclosure category.",
      "When the answer isn't clean, it's worth a quick check with privacy counsel before proceeding.",
    ],
  },
}

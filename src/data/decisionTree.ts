import type { TreeNode } from "./types"

/**
 * HIPAA Business Associate Agreement (BAA) decision tree.
 *
 * This encodes the analysis HHS uses under the HIPAA Privacy and Security
 * Rules for deciding whether a Business Associate Agreement is required:
 *   1. Is protected health information (PHI) involved at all?
 *   2. Is this actually a group health plan / plan sponsor arrangement,
 *      governed by its own certification process instead of a BAA?
 *   3. Is the recipient a subcontractor of a business associate, rather
 *      than dealing with the covered entity directly? (Same rules apply,
 *      but it changes who signs the agreement with whom.)
 *   4. Is the recipient part of the covered entity's own workforce?
 *   5. Does the recipient perform a function or service on behalf of the
 *      covered entity (or a business associate) that involves PHI?
 *   6. If so, does a specific exception apply: treatment disclosure,
 *      permitted public-interest/research disclosure, de-identified data
 *      (Safe Harbor's 18 identifiers), the conduit exception, or the
 *      financial institution payment-processing exception?
 *
 * This is educational guidance, not legal advice. It simplifies real
 * edge cases so they can be reasoned through in plain language; anything
 * routed to "result_unclear" or flagged as close should go to counsel.
 */
export const startNodeId = "start"
export const totalStepsEstimate = 10

export const decisionTree: Record<string, TreeNode> = {
  start: {
    id: "start",
    type: "question",
    eyebrow: "Step 1 of 10",
    text: "Will the other organization or person create, receive, maintain, or transmit any individually identifiable health information that came from (or is being handled on behalf of) a doctor's office, hospital, health plan, or other health care provider?",
    help: "This includes things like patient names linked to diagnoses, treatment notes, billing records, appointment details, or insurance claims. It does not include health information that has had all identifying details stripped out.",
    answers: [
      { label: "Yes, it involves that kind of health information", next: "planSponsorCheck" },
      { label: "No, or I'm not sure it counts as health information", next: "result_no_phi" },
    ],
  },

  planSponsorCheck: {
    id: "planSponsorCheck",
    type: "question",
    eyebrow: "Step 2 of 10",
    text: "Is the outside party actually the employer or plan sponsor of a group health plan, receiving this information to help run the health plan itself, not just routine enrollment or disenrollment numbers?",
    help: "This is a narrower, less common scenario. An employer that sponsors a group health plan sometimes needs plan-level data, like claims data, to administer the plan. That relationship is governed by its own HIPAA provision rather than the standard business associate rules.",
    answers: [
      { label: "Yes, the employer/plan sponsor needs plan-administration data", next: "planSponsorCert" },
      { label: "No, that doesn't describe this relationship", next: "subcontractorCheck" },
    ],
  },

  planSponsorCert: {
    id: "planSponsorCert",
    type: "question",
    eyebrow: "Step 3 of 10",
    text: "Have the group health plan's plan documents been amended to include HIPAA's required certifications, such as restricting the plan sponsor's use of this data to plan administration, prohibiting employment decisions based on it, and keeping it walled off from the employer's other functions?",
    help: "This amendment-and-certification process is what HIPAA requires here instead of a standard Business Associate Agreement.",
    answers: [
      { label: "Yes, the plan documents are amended and certified", next: "result_plan_sponsor_ok" },
      { label: "No, or I'm not sure", next: "result_plan_sponsor_needed" },
    ],
  },

  subcontractorCheck: {
    id: "subcontractorCheck",
    type: "question",
    eyebrow: "Step 3 of 10",
    text: "Is the outside party actually a business associate that is hiring this vendor as its own subcontractor, rather than the covered entity (the hospital, health plan, or provider) hiring them directly?",
    help: "A subcontractor is a vendor's vendor: someone a business associate brings in to help with work it's doing for a covered entity. HIPAA treats subcontractors the same way it treats business associates, but it changes who needs to sign an agreement with whom.",
    answers: [
      {
        label: "Yes, they'd be a subcontractor of a business associate",
        next: "workforce",
        flags: { isSubcontractor: true },
      },
      {
        label: "No, this is directly with the covered entity",
        next: "workforce",
        flags: { isSubcontractor: false },
      },
    ],
  },

  workforce: {
    id: "workforce",
    type: "question",
    eyebrow: "Step 4 of 10",
    text: "Is the other party an employee, volunteer, trainee, or student under the direct control of the same organization, rather than a separate outside company or individual?",
    help: "Think of \"workforce\" broadly: it covers anyone who works under the organization's direct supervision, paid or not. It does not cover an outside company or independent contractor, even a long-term one.",
    answers: [
      { label: "Yes, they're internal workforce", next: "result_workforce" },
      { label: "No, they're a separate outside party", next: "function" },
    ],
  },

  function: {
    id: "function",
    type: "question",
    eyebrow: "Step 5 of 10",
    text: "Will the outside party use or see this health information to perform a function, activity, or service for the organization, such as billing, claims processing, IT hosting, data storage, data analysis, consulting, legal or accounting work, transcription, answering service, or software that stores or processes patient data?",
    help: "The key question is whether the outside party is doing something on behalf of the health care organization that requires touching the data, not just receiving it as a bystander.",
    answers: [
      { label: "Yes, they're performing a service that involves this data", next: "treatment" },
      { label: "No, that's not what's happening here", next: "treatment_only" },
    ],
  },

  treatment_only: {
    id: "treatment_only",
    type: "question",
    eyebrow: "Step 6 of 10",
    text: "Is the health information being shared only so another health care provider can treat the same patient, such as a referral, a transfer of care, or sending records for that patient's ongoing treatment?",
    help: "Treatment-related sharing between providers is handled differently from a vendor relationship, because both sides are directly treating the patient rather than one performing a service for the other.",
    answers: [
      { label: "Yes, it's a provider-to-provider treatment disclosure", next: "result_treatment" },
      { label: "No, none of the above describes it", next: "publicInterestNoFunction" },
    ],
  },

  treatment: {
    id: "treatment",
    type: "question",
    eyebrow: "Step 6 of 10",
    text: "Is the only reason the outside party has this information that they're helping treat the same patient, such as a referral or shared care coordination, rather than performing an administrative, technical, or business service?",
    help: "If the outside party is truly just another treating provider, this is a treatment disclosure. If they're also processing claims, hosting data, or providing some other service, it isn't.",
    answers: [
      { label: "Yes, it's purely a treatment-coordination disclosure", next: "result_treatment" },
      { label: "No, it's a service or business function", next: "publicInterest" },
    ],
  },

  publicInterest: {
    id: "publicInterest",
    type: "question",
    eyebrow: "Step 7 of 10",
    text: "Is the only reason this outside party has (or will have) the information that they're a public health authority, health oversight agency, law enforcement, a court, or a researcher receiving it under a recognized research exception, such as an authorization, an IRB or privacy board waiver, or a limited data set agreement, rather than performing a service for your organization?",
    help: "These disclosures are permitted by HIPAA in their own right and don't turn the recipient into a business associate, because they aren't acting on your organization's behalf. They're exercising their own independent authority or an exception that applies directly to the disclosure.",
    answers: [
      { label: "Yes, it's one of those permitted disclosures", next: "result_public_interest" },
      { label: "No, none of those describe it", next: "deidentifiedChecklist" },
    ],
  },

  publicInterestNoFunction: {
    id: "publicInterestNoFunction",
    type: "question",
    eyebrow: "Step 7 of 10",
    text: "Is the only reason this outside party has (or will have) the information that they're a public health authority, health oversight agency, law enforcement, a court, or a researcher receiving it under a recognized research exception, such as an authorization, an IRB or privacy board waiver, or a limited data set agreement?",
    help: "These disclosures are permitted by HIPAA in their own right, independent of any business associate or treatment relationship.",
    answers: [
      { label: "Yes, it's one of those permitted disclosures", next: "result_public_interest" },
      { label: "No, none of those describe it", next: "result_unclear" },
    ],
  },

  deidentifiedChecklist: {
    id: "deidentifiedChecklist",
    type: "checklist",
    eyebrow: "Step 8 of 10",
    text: "Under HIPAA's Safe Harbor method, data only counts as de-identified once every one of these identifiers has been removed for the individual and for their relatives, employers, and household members. Check off each one that has actually been removed:",
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
    notAllCheckedNext: "conduit",
  },

  conduit: {
    id: "conduit",
    type: "question",
    eyebrow: "Step 9 of 10",
    text: "Does the outside party's role consist only of transporting or briefly routing the data, without any routine or ongoing ability to access, view, or use its contents, like a mail courier, shipping company, or an internet service provider that just carries the traffic through?",
    help: "This exception is narrow. A cloud storage, hosting, backup, or file-sharing vendor almost always has enough access to the data (even if it's encrypted, and even if they say they never look at it) that they don't qualify as a mere conduit. When in doubt, assume this doesn't apply.",
    answers: [
      { label: "Yes, transport only, no real access to the data", next: "result_conduit" },
      { label: "No, they can access or store the data more than momentarily", next: "financial" },
    ],
  },

  financial: {
    id: "financial",
    type: "question",
    eyebrow: "Step 10 of 10",
    text: "Is the outside party a bank or payment processor whose only role is processing a payment that the patient or health plan member directly initiated, like a credit card or check payment for a bill, rather than performing any other health care-related function?",
    help: "This narrow exception covers ordinary financial institutions clearing a payment transaction. It does not cover a billing company, revenue cycle vendor, or payment platform that also touches claims or patient account data for the provider.",
    answers: [
      { label: "Yes, pure payment processing only", next: "result_financial" },
      { label: "No, that doesn't describe their role", next: "result_baa_required" },
    ],
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
      { cite: "45 CFR § 164.502(e)(1)(ii)", note: "BAA not required for disclosures to a health care provider for treatment" },
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

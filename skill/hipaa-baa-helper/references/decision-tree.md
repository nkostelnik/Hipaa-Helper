# HIPAA BAA decision tree

Mirrors `src/data/decisionTree.ts` in the HIPAA Helper app. Questions are listed in the order they are asked. "->" shows where an answer goes. Result nodes are at the bottom.

The tree has two parts. Part A classifies the user's own organization. Part B then forks: a covered entity gets the full path (B1), and a business associate gets a shorter path (B2), because the questions that ask who "they" are would repeat what Part A already established.

## Part A: classify the user's own organization

Ask these in order and stop at the first "yes". Keep legal terms out of the question wording. The term itself appears only in the one-line confirmation, so the user sees the classification land before the substantive questions begin.

### A1. Provider
Do you charge for medical or health services, such as a doctor's office, hospital, clinic, or pharmacy?
- Yes -> confirm: "OK, sounds like you're a health care provider." Role = covered entity. Go to B1.
- No -> A2

### A2. Health plan
Do you pay the cost of medical care for a group of people, like a health insurer, an HMO, Medicare, Medicaid, or similar program?
- Yes -> confirm: "OK, sounds like you're a health plan." Role = covered entity. Go to B1.
- No -> A3

### A3. Clearinghouse
Do you convert health billing information into a standard format for other companies, or back again, like a medical claims clearinghouse or billing service?
- Yes -> confirm: "OK, sounds like you're a health care clearinghouse." Role = covered entity. Go to B1.
- No -> A4

### A4. Works for a covered entity
Do you perform work for a doctor's office, hospital, health insurer, or similar organization?
- Yes -> A5
- No -> A6

### A5. Nature of the work
Is that work something like billing, IT, consulting, transcription, or software, the kind of work that involves handling health information?
- Yes -> confirm: "OK, sounds like you're a business associate rather than a covered entity yourself." Role = business associate. Go to B2.
- No -> A6

### A6. Subcontractor of a business associate
Do you perform a function, activity, or service involving health information for another vendor who already works for a doctor's office, hospital, health insurer, or similar organization, rather than working for one of those directly?
- Yes -> same confirmation as A5. Role = business associate (subcontractor). Go to B2.
- No -> RESULT not-covered

Why classify first: the BAA duty runs only from a covered entity or a business associate to its own vendor, so the user's own status decides whether the rest of the questions even apply, and it decides which questions to ask.

## Part B1: covered entity path

### B1.1 PHI involved
Now about the other person or company you're considering this agreement with. Will they see, use, or store any of your patients' health information, things like medical records, diagnoses, treatment notes, or insurance claims?
Help: includes patient names linked to diagnoses, treatment notes, billing records, appointment details, insurance claims. Does not include health information with all identifying details stripped out.
- Yes -> B1.2
- No, or unsure whether it counts -> RESULT no-phi

### B1.2 Workforce
Is this person actually part of your own team (an employee, intern, or volunteer working under your direct supervision) rather than a separate outside company?
Help: workforce is broad and covers anyone under direct supervision, paid or not. Outside companies and independent contractors are not workforce, even long-term ones.
- Yes -> RESULT workforce
- No -> B1.3

### B1.3 Why they have the information
Which best describes why this person or company has, or will have, this information?
- Doing paid work for us that touches this data (billing, IT, consulting, transcription, software) -> B1.4
- Another doctor, clinic, or hospital who will also be treating this same patient, for example a referral -> RESULT treatment
- A government agency, court, or independent researcher with their own legal right to it, not doing work for us -> RESULT public-interest
- None of these -> RESULT unclear

### B1.4 Narrow exceptions
A few uncommon situations change the answer. Does any of these describe this specific relationship? If none do, choose the last option. If the user is not sure an exception fits, it probably does not, so steer toward "none".
- They only transport or briefly pass the data through, without any real ability to look at it (mail courier, delivery service, an internet provider just carrying traffic) -> RESULT conduit
- They are a bank or payment processor whose only role is handling a payment the patient or member directly initiated -> RESULT financial
- All identifying details have already been stripped out so it cannot be traced to a person -> B-DEID
- They are the employer that sponsors our health plan and need this data to help run the plan itself -> B-PLAN
- None of these, it is a normal vendor or service relationship -> RESULT baa-required

### B-PLAN. Plan sponsor certification
Have the health plan's plan documents been amended to include the required certifications (restricting the employer's use of the data to plan administration, prohibiting employment decisions based on it, keeping it walled off from the employer's other functions)?
- Yes, amended and certified -> RESULT plan-sponsor-ok
- No or unsure -> RESULT plan-sponsor-needed

## Part B2: business associate path

The classification questions already named "them" (the covered entity or vendor the user works for) and already established that the work involves handling health information. Do not re-ask whether PHI is involved, and do not ask whether the other party is workforce, because "them" is a client organization, not a possible employee. Plan sponsor is also omitted: that arrangement is specific to a covered entity's own disclosures and does not recur at the subcontractor level.

### B2.1 Narrow exceptions
You have already told us this work involves handling health information for them. Does either of these describe this specific relationship? If neither, choose the last option.
- They only transport or briefly pass the data through, without any real ability to look at it -> RESULT conduit
- They are a bank or payment processor whose only role is handling a payment the patient or member directly initiated -> RESULT financial
- All identifying details have already been stripped out -> B-DEID
- None of these, it is a normal vendor or service relationship -> RESULT baa-required

## Shared: Safe Harbor de-identification checklist (B-DEID)

Data counts as de-identified under Safe Harbor only if every identifier below has been removed for the individual and for their relatives, employers, and household members, AND the organization has no actual knowledge that the remaining information could identify the person:
1. Names
2. Geographic subdivisions smaller than a state (street address, city, county, precinct, ZIP code)
3. All elements of dates other than year tied to an individual (birth, admission, discharge, death), and ages over 89
4. Telephone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate or license numbers
12. Vehicle identifiers and serial numbers, including license plates
13. Device identifiers and serial numbers
14. Web URLs
15. IP addresses
16. Biometric identifiers, including fingerprints and voiceprints
17. Full-face photographs and comparable images
18. Any other unique identifying number, characteristic, or code

Help: removing just a name is usually not enough. If even one category remains and could point back to a person, the data is still PHI.
- All 18 removed and no actual knowledge of re-identification risk -> RESULT deidentified
- Anything remaining -> RESULT baa-required

Expert determination under 45 CFR § 164.514(b)(1) is the alternative route to de-identification. The app does not walk through it, so mention it if the user says an expert has certified the data.

## Results

Lead the determination with a direct yes or no, the way the app's titles do.

### baa-required: "Yes, a BAA is required"
This outside party creates, receives, maintains, or transmits PHI to perform a service on behalf of the organization, and no exception applies. It fits the definition of a business associate: an outside person or entity performing a function, activity, or service involving PHI on behalf of a covered entity (or another business associate). The satisfactory assurances must be documented in a written contract before PHI is shared. Subcontractors the party uses to touch the PHI are themselves business associates and need their own BAA with the party that hired them.
Citations:
- 45 CFR § 160.103, definition of "business associate," paragraph (1) (a person who performs a function or activity involving PHI on behalf of a covered entity, other than as workforce), paragraph (3)(iii) (includes a subcontractor that handles PHI on behalf of the business associate), and the definition of "subcontractor"
- 45 CFR § 164.502(e)(1)(i): a covered entity may disclose PHI to a business associate only with satisfactory assurances
- 45 CFR § 164.502(e)(1)(ii): the same rule applies when a business associate discloses PHI to its own subcontractor
- 45 CFR § 164.502(e)(2): the assurances must be documented in a written contract that meets § 164.504(e)
- 45 CFR § 164.504(e): required contents of a Business Associate Agreement
Next steps: get a written BAA in place before any PHI is shared, not a verbal or informal understanding. Make sure it covers permitted uses, safeguards, breach notification, subcontractor flow-down, and return or destruction of data at the end. If the party uses subcontractors who will touch the PHI, confirm they have BAAs with those subcontractors.
Business associate note (only when the user's role is business associate): since the user's own organization is a business associate rather than the covered entity, this agreement is a subcontractor BAA between the user and this vendor, not directly with the covered entity. Subcontractors of a business associate are themselves treated as business associates under 45 CFR § 160.103, so the requirement carries down the chain.
After this result, offer to draft the key terms. See `baa-key-terms.md`.

### no-phi: "No, a BAA is not required: this doesn't involve protected health information"
A BAA is triggered only by use or disclosure of PHI, meaning individually identifiable health information held or transmitted by a covered entity or its business associate. With no PHI involved there is no business associate relationship to document.
Citations: 45 CFR § 160.103 (definitions of "protected health information" and "business associate"); 45 CFR § 164.502(a) (general rule limiting uses and disclosures of PHI).
Next steps: double-check that no identifiable data changes hands, even indirectly (a name plus an appointment time is PHI). If the answer is close, treat the data as PHI or ask counsel.

### not-covered: "No, a BAA is not required: HIPAA's business associate rules may not reach your organization"
A BAA is required only from a covered entity or a business associate. Based on the answers, the user's organization is neither, so HIPAA does not require them to get one from this outside party. Warn that this classification is easy to get wrong: an app, platform, or service that handles health information on behalf of a covered entity, even informally, without a fee, or without realizing it, can be a business associate in its own right. Do not let the user rely on this result alone if there is any real chance they do work for a covered entity or another business associate.
Citations: 45 CFR § 160.103 (definitions of "covered entity" and "business associate"); 45 CFR § 164.502(e)(1)(i)-(ii) (the BAA requirement runs from a covered entity or a business associate to its own vendor).
Next steps: double-check the organization is not unintentionally acting as a business associate, for example by receiving health information to perform a function on behalf of a covered entity. If unsure, get a quick check from privacy counsel.

### workforce: "No, a BAA is not required: this is an internal workforce member"
A BAA documents a relationship between two separate legal entities. Workforce members (employees, volunteers, trainees, and others under the organization's direct control, whether or not paid) are already bound by the organization's own HIPAA policies, training, and sanctions. This holds even if the person handles PHI daily, and applies whether the organization is a covered entity or a business associate.
Citations: 45 CFR § 160.103, definition of "workforce," and the opening of the "business associate" definition (excludes a person acting as a member of the workforce); 45 CFR § 164.530(b), (c) (training and safeguards an organization owes its own workforce).
Next steps: confirm the person is truly under direct control and not an independent contractor or staffing agency worker. Make sure HIPAA workforce training is done regardless.

### treatment: "No, a BAA is not required: this is a treatment disclosure"
Disclosures between providers for treatment of the same patient fall under the treatment exception. A treating provider is not performing a service on behalf of the referring provider. The exception covers genuine treatment coordination only. If the same party also handles billing, hosting, or another administrative function, that separate function may still need a BAA.
Citations: 45 CFR § 160.103, definition of "business associate," paragraph (4)(i) (excludes a health care provider with respect to disclosures by a covered entity to the provider concerning the treatment of the individual); 45 CFR § 164.506(c) (permitted uses and disclosures for treatment).
Do not cite § 164.502(e)(1)(ii) for this exception. Since the 2013 Omnibus Rule that paragraph covers a business associate disclosing to its subcontractor.
Next steps: if the same party also provides a non-treatment service (billing, analytics, storage), evaluate that separately because it likely needs a BAA. Keep the disclosure limited to what the patient's treatment needs.

### public-interest: "No, a BAA is not required: this is a permitted public-interest or research disclosure"
A public health authority, a court enforcing a valid order, or a researcher relying on an authorization, an IRB or privacy board waiver, or a limited data set agreement is not performing a function on the organization's behalf. They exercise independent authority or a standalone HIPAA exception, so the BAA requirement does not apply to that disclosure. A limited data set still needs a data use agreement, which is a separate, lighter agreement and not a BAA.
Citations: 45 CFR § 164.512 (uses and disclosures for public health, judicial, law enforcement, and research purposes that do not require authorization or a BAA); 45 CFR § 164.514(e) (limited data sets and the data use agreement requirement).
Next steps: if the same party also performs a paid service involving other PHI, evaluate that role separately. If a limited data set is involved, put a data use agreement in place.

### deidentified: "No, a BAA is not required: the data meets the Safe Harbor de-identification standard"
Information that meets Safe Harbor is no longer PHI, so the business associate rules do not apply to it for as long as it stays de-identified. There are two routes: an expert certifies the re-identification risk is very small, or the organization removes all 18 Safe Harbor identifier categories and has no actual knowledge the remainder could identify someone.
Citations: 45 CFR § 164.514(a) (standard for de-identification); 45 CFR § 164.514(b)(2) (Safe Harbor and its 18 identifier categories).
Next steps: make sure the recipient has no separate way to re-identify, such as a shared key or reversible code. If identifiable data will flow back, or new fields are added later, re-run the checklist.

### conduit: "No, a BAA is not required: this fits the narrow conduit exception"
Services that only transport data and have no more than transient or incidental access, such as postal mail, couriers, and internet service providers, are not business associates. HHS stresses the exception is narrow. A data transmission service that needs routine access to PHI is a business associate, and a cloud storage or hosting vendor that can view or retain the data is outside the exception even if the data is encrypted.
Citations: 45 CFR § 160.103, definition of "business associate," paragraph (3)(i) (a data transmission service that requires access to PHI on a routine basis is a business associate, which marks the limit of the exception); 78 Fed. Reg. 5566, 5571 (HHS Omnibus Rule preamble, Jan. 25, 2013), explaining the conduit exception. The exception itself comes from the preamble, not from the text of the regulation.
Next steps: re-check carefully, since most vendors that store, host, or back up data are not conduits even when they call themselves one. If the vendor has any standing ability to log in and view the data, treat them as a business associate.

### financial: "No, a BAA is not required: ordinary payment processing"
A financial institution merely processing a payment the patient or member initiated, such as clearing a check or a card payment, is not a business associate for that function. A billing company, clearinghouse, or payment platform that also touches claims data or patient account details is a business associate for that broader role.
Citations: 45 CFR § 160.103 (definition of "business associate"); 65 Fed. Reg. 82476, 82601 (HHS Privacy Rule preamble, Dec. 28, 2000), financial institution exclusion.
Next steps: confirm the role is limited to clearing the payment. If they also do eligibility checks, claims submission, or revenue cycle work, evaluate that part separately.

### plan-sponsor-ok: "No, a BAA is not required: this is a certified plan sponsor arrangement"
A group health plan may share PHI with its plan sponsor for plan administration once the plan documents are amended and the sponsor certifies, which substitutes for a BAA. The safeguards are: use restricted to plan administration, no employment-related decisions based on the data, and a firewall from the employer's other functions.
Citations: 45 CFR § 164.504(f) (requirements for group health plan disclosures to a plan sponsor).
Next steps: confirm the data actually shared matches what the amended plan documents describe, since expanding the data flow later may require updating the certification. Revisit periodically.

### plan-sponsor-needed: "Not a standard BAA question: plan document amendment and certification are required instead"
This is not a business associate relationship, so a BAA is the wrong tool. The plan documents must be amended with specific restrictions and the plan sponsor must certify it will comply before plan-administration data can be shared.
Citations: 45 CFR § 164.504(f).
Next steps: work with counsel to amend the plan documents and obtain the certification before sharing. Meanwhile limit sharing to the narrow categories HIPAA allows without it, such as enrollment and disenrollment information.

### unclear: "Unclear: this needs a closer look before we can say yes or no"
This does not clearly fit the business associate definition or a standard exception. It may fall under a separate HIPAA provision this tool does not cover, or may not be a HIPAA-regulated disclosure at all.
Citations: 45 CFR § 160.103 (definition of "business associate"); 45 CFR § 164.512 (uses and disclosures that do not require authorization or a BAA, such as public health and law enforcement).
Next steps: identify the specific reason the data is being shared, since it may fit another permitted-disclosure category. Check with privacy counsel before proceeding.

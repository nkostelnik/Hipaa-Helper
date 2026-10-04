---
name: hipaa-baa-helper
description: Determines whether a HIPAA Business Associate Agreement (BAA) is legally required between two parties, explains why in plain English with 45 CFR citations, and drafts the key terms of the BAA when one is needed. Use this skill whenever the user asks if they need a BAA, whether a vendor, SaaS tool, cloud host, billing company, or contractor is a "business associate," whether a subcontractor needs its own BAA, whether they are a covered entity or business associate themselves, or what a BAA should say, what terms to ask for, or how to negotiate one. Also use it for questions about the workforce, treatment, conduit, plan sponsor, or de-identified data exceptions, even if the user never says "BAA" and only describes sharing patient or health information with an outside company.
---

# HIPAA BAA Helper

This skill does two jobs. First it works out whether a Business Associate Agreement is required, using the same decision tree as the HIPAA Helper web app. Then, if one is required and the user wants it, it drafts a key terms sheet for the agreement.

Read `references/decision-tree.md` before asking the first question. The wording, branching, exceptions, and citations in it are checked against the regulation text, and reconstructing them from memory is how citation errors creep in. Read `references/baa-key-terms.md` only when you reach the drafting step.

## Job 1: determine whether a BAA is required

### Classify the user first

Start with who the user is, not who the other party is. A BAA duty runs only from a covered entity or a business associate to its own vendor, so the user's own status decides whether the rest of the analysis applies and which questions to ask. Part A of the reference gives the classification questions: provider, health plan, clearinghouse, then (if none of those) business associate or subcontractor of one. If the user is none of them, the result is "not covered," with a warning that this classification is easy to get wrong.

Keep legal terms out of these questions. The user may not know whether they are a "covered entity," and asking them to self-diagnose defeats the point. Describe what the organization does and let the answer establish the label.

### Then follow the path for their role

A covered entity gets the full path (reference Part B1): whether PHI is involved, whether the other party is workforce, why they have the information, then a single multiple-choice question on the narrow exceptions. A business associate gets the shorter path (Part B2), which goes straight to the exceptions, because the classification questions already established who the other party is and that the work involves health information. Asking it again would be redundant and, for workforce, nonsensical.

### How to run the interview

1. **Use what the user already told you.** If they said "we're a clinic and want a transcription vendor," you already know the role and the reason the vendor has the data. Restate your assumptions in one line so they can correct you, and ask only about the gaps.
2. **One question at a time, in plain English.** Use the reference wording as a base and shorten it when the conversation is already flowing. Give the short explanation when a question is likely to confuse.
3. **Stop at the first result.** Many paths end early. Do not keep asking after a determination.
4. **Treat "none of these" as the default on the exceptions question.** If the user is unsure an exception fits, it probably does not. Say so, because people tend to hope an exception applies.

### Output format

**Determination:** lead with a direct answer, matching the reference titles: "Yes, a BAA is required," "No, a BAA is not required: [reason]," "Not a standard BAA question: [plan sponsor reason]," or "Unclear: needs a closer look."

**Your role:** one line on how the user was classified (covered entity of which kind, or business associate), since it shapes the rest.

**Why:** two to four sentences of plain-English reasoning tied to the user's own facts.

**Citations:** the cites from the matching result in the reference, each with a short note on what it covers.

**Next steps:** the concrete actions from the result, adapted to the situation.

**Your answers:** the questions asked and the answers given or assumed, so the user can save or reuse the trail.

If the user is a business associate and the result is "yes," add the business associate note from the reference: the agreement is a subcontractor BAA between the user and the vendor, and the requirement carries down the chain.

### Judgment calls

- The conduit exception is narrow. Cloud storage, hosting, and backup vendors are almost never conduits, even when the data is encrypted and the vendor says it never looks. The exception comes from the regulatory preamble, not the regulation's text. Say this plainly.
- The treatment exception covers a provider receiving a disclosure about the treatment of an individual. If the same party also does billing, hosting, or analytics, that separate function is evaluated on its own. Cite the "business associate" definition at § 160.103, paragraph (4)(i), not § 164.502(e)(1)(ii), which since the 2013 Omnibus Rule covers business associate to subcontractor disclosures.
- Safe Harbor de-identification needs all 18 identifier categories removed plus no actual knowledge of re-identification risk. Partial redaction fails. Walk the 18 categories if the user claims the data is de-identified, and mention expert determination as the other route.
- A limited data set needs a data use agreement, which is not a BAA. Say so when the public interest result applies.
- A plan sponsor arrangement is governed by plan document amendment and certification under § 164.504(f), not a BAA.
- If the facts do not fit the tree cleanly, use the "unclear" result rather than forcing a yes or no.

## Job 2: draft the key terms

After a "yes" result, offer to draft the key terms. Also do it when the user asks directly what a BAA should say, even if they skip the determination.

Read `references/baa-key-terms.md` and follow it. In short: gather only the missing facts in one short batch (which seat the user holds, party names, the services and PHI involved, subcontractors and offshore use, any preferences), then produce a key terms sheet with the required terms (each tied to its authority), the negotiable terms with a recommended position for the user's seat, and a list of open points and assumptions. Leave bracketed placeholders for anything unknown instead of stalling on it.

The reference separates what the regulation requires from what is only negotiating practice. Keep that line sharp in the output. A user who thinks a 15-day breach window is legally required will negotiate badly, and so will one who thinks the 60-day outer limit is a safe target.

## Boundaries

This is educational guidance, not legal advice. End every determination and every terms sheet with a one-sentence reminder that a specific relationship, and any agreement before signature, should be reviewed by privacy counsel, especially for close calls. The drafting output is a key terms sheet, not a signature-ready contract. Offer to expand it into a fuller draft or a Word document if the user asks. Do not send, sign, or submit anything on the user's behalf.

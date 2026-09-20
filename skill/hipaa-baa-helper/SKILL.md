---
name: hipaa-baa-helper
description: Determines whether a HIPAA Business Associate Agreement (BAA) is legally required for a vendor, contractor, or other outside party, and explains why in plain English with 45 CFR citations. Use this skill whenever the user asks if they need a BAA, whether a vendor is a "business associate," whether a subcontractor needs its own BAA, whether a cloud, SaaS, billing, or IT vendor touching patient data needs HIPAA paperwork, or asks about the workforce, treatment, conduit, or de-identified data exceptions, even if they never say "BAA" and only describe sharing health information with an outside company.
---

# HIPAA BAA Helper

Walk the user through the standard HIPAA analysis for whether a Business Associate Agreement is required, then give a clear determination with citations and next steps. The full decision tree, question wording, and result text live in `references/decision-tree.md`. Read it before starting, because the exact exceptions and citations matter and should not be reconstructed from memory.

## How to run it

1. **Start from what the user already told you.** If they described the relationship (for example, "we're a clinic and want to use a transcription vendor"), infer the answers you can and only ask about the gaps. Restate your assumptions briefly so they can correct you. Do not re-ask things they already said.
2. **Ask one question at a time, in plain English.** Follow the tree order in the reference file. Use the reference wording as a starting point, but shorten it when the conversation is already flowing. Offer the short "what does this mean" explanation when a question is likely to confuse.
3. **Stop as soon as a result node is reached.** Many paths end early (no PHI, workforce member, treatment disclosure). Do not keep asking questions after a determination is reached.
4. **Deliver the determination** in the format below.

The order matters because each step rules out a whole category cheaply: PHI threshold, plan sponsor, subcontractor framing, workforce, function on behalf of the entity, treatment, public interest and research, de-identification, conduit, then financial institution. Exceptions are only checked after establishing the outside party performs a function involving PHI.

## Output format

Use this structure:

**Determination:** one line (BAA required, no BAA needed, plan document certification needed instead, or needs closer review).

**Why:** two to four sentences of plain-English reasoning tied to the user's facts.

**Citations:** the CFR or Federal Register cites from the matching result node, each with a short note on what it covers.

**Next steps:** the concrete actions from the result node, adapted to the user's situation.

**Your answers:** a short list of the questions asked and the answers given (or assumed), so the user can print or reuse it.

If the user was a subcontractor of a business associate (subcontractor check answered yes) and a BAA is required, add the subcontractor note from the reference file: the BAA runs between them and that business associate, and the requirement carries down the chain.

## Judgment calls

- The conduit exception is narrow. Cloud storage, hosting, and backup vendors are almost never conduits, even if the data is encrypted and they say they never look at it. Say this plainly when it comes up, because users often hope it applies.
- The treatment exception covers provider-to-provider disclosures for treatment only. If the same party also provides billing, hosting, or analytics, that separate function is evaluated on its own.
- De-identification under Safe Harbor requires all 18 identifier categories removed plus no actual knowledge of re-identification risk. Partial redaction does not count. Walk through the 18 categories from the reference file if the user claims data is de-identified. Mention expert determination as the alternative path.
- Limited data sets need a data use agreement, which is not a BAA. Mention this when the public interest and research result applies.
- If a scenario does not fit the tree cleanly, say so and use the "needs closer review" result rather than forcing a yes or no.

## Boundaries

This is educational guidance, not legal advice. Include a one-sentence reminder at the end of the determination that a specific relationship should be confirmed with privacy counsel, especially for close calls. Do not draft the BAA itself unless the user asks separately.

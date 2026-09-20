# HIPAA Helper

A plain-language decision tree that tells you whether a HIPAA Business Associate Agreement (BAA) is required for a given relationship.

Answer a short series of questions about who the parties are and what they do with protected health information. The tool walks you to a determination, explains the reasoning, cites the governing regulation, and lists concrete next steps.

## What it does

- **Guided questions.** Single-choice questions and checklist steps, written in ordinary English rather than regulatory language.
- **A real answer.** Each result states whether a BAA is required, summarizes why, and links the conclusion to the relevant citations (45 CFR Part 160 and Part 164).
- **An answer trail.** The result shows every question you were asked and how you answered it, so the determination can be reviewed by someone else.
- **Subcontractor handling.** If the counterparty is itself a business associate rather than a covered entity, the result flags that the BAA runs down the chain instead of directly to the covered entity.
- **Print or save.** Results are formatted for printing to PDF so a determination can be filed with the deal record.
- **Back and reset.** Any answer can be revisited without starting over.

Everything runs in the browser. No answers are transmitted or stored.

## Not legal advice

This is general educational guidance. HIPAA determinations turn on facts this tool does not ask about. Confirm any specific relationship with privacy counsel.

## Running it locally

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build     # type-check and build for production
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Built with

React 19, TypeScript, Vite, Tailwind CSS, Motion, and Lucide icons.

## Project structure

```
src/
  data/decisionTree.ts    the questions, results, and citations
  data/types.ts           node and result types
  hooks/useDecisionTree.ts  traversal, history, and flags
  components/             question, checklist, result, and progress UI
```

To change a question, a result, or a citation, edit `src/data/decisionTree.ts`. The UI renders whatever the tree defines, so no component changes are needed to add or reword a branch.

## Keeping the skill in sync

The Claude skill in `skill/hipaa-baa-helper/` carries its own copy of the tree in `references/decision-tree.md`. The two are not linked, so any change to a question, result, or citation must be made in both files:

- [ ] Edit `src/data/decisionTree.ts`
- [ ] Make the same edit in `skill/hipaa-baa-helper/references/decision-tree.md`
- [ ] Rebuild `skill/hipaa-baa-helper.skill` (zip the `hipaa-baa-helper` folder)
- [ ] Run `npm run build` to confirm the app still compiles

export type Citation = {
  cite: string
  note?: string
}

export type Answer = {
  label: string
  next: string
  flags?: Record<string, boolean>
}

export type QuestionNode = {
  id: string
  type: "question"
  eyebrow?: string
  intro?: string
  text: string
  help?: string
  answers: Answer[]
}

export type ChecklistNode = {
  id: string
  type: "checklist"
  eyebrow?: string
  intro?: string
  text: string
  help?: string
  items: string[]
  confirmText: string
  allCheckedNext: string
  notAllCheckedNext: string
}

export type ResultNode = {
  id: string
  type: "result"
  baaRequired: boolean
  title: string
  summary: string
  explanation: string
  citations: Citation[]
  nextSteps: string[]
}

export type TreeNode = QuestionNode | ChecklistNode | ResultNode

export type TreeStep = {
  nodeId: string
  questionText: string
  answerLabel: string
}

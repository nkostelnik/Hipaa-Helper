import { useMemo, useState } from "react"
import { decisionTree, startNodeId } from "../data/decisionTree"
import type { QuestionNode, TreeNode, TreeStep } from "../data/types"

const STEP_EYEBROW_PATTERN = /Step (\d+) of (\d+)/i

export function useDecisionTree() {
  const [currentId, setCurrentId] = useState(startNodeId)
  const [history, setHistory] = useState<TreeStep[]>([])
  const [flags, setFlags] = useState<Record<string, boolean>>({})

  const currentNode: TreeNode = decisionTree[currentId]

  // Derived from the current node's own eyebrow rather than raw history
  // length, since the number of steps to get here can vary by path (the
  // classification questions at the start take anywhere from 1 to 4 steps
  // depending on which category matches). Nodes without a numbered eyebrow,
  // like the classification and confirmation steps, show an empty bar.
  const progress = useMemo(() => {
    const eyebrow = "eyebrow" in currentNode ? currentNode.eyebrow : undefined
    const match = eyebrow?.match(STEP_EYEBROW_PATTERN)
    if (!match) return 0
    const [, step, total] = match
    return Math.round((Number(step) / Number(total)) * 100)
  }, [currentNode])

  function pushStep(nodeId: string, questionText: string, answerLabel: string, nextId: string) {
    setHistory((prev) => [...prev, { nodeId, questionText, answerLabel }])
    setCurrentId(nextId)
  }

  function answer(nextId: string, answerLabel: string) {
    const node = currentNode as QuestionNode
    const chosen = node.answers.find((a) => a.next === nextId && a.label === answerLabel)
    if (chosen?.flags) {
      setFlags((prev) => ({ ...prev, ...chosen.flags }))
    }
    pushStep(node.id, node.text, answerLabel, nextId)
  }

  function answerChecklist(nextId: string, answerLabel: string) {
    const node = currentNode
    if (node.type !== "checklist") return
    pushStep(node.id, node.text, answerLabel, nextId)
  }

  function goBack() {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    setCurrentId(last.nodeId)
  }

  function reset() {
    setHistory([])
    setFlags({})
    setCurrentId(startNodeId)
  }

  return {
    currentNode,
    history,
    flags,
    progress,
    canGoBack: history.length > 0,
    answer,
    answerChecklist,
    goBack,
    reset,
  }
}

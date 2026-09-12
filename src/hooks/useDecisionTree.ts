import { useMemo, useState } from "react"
import { decisionTree, startNodeId, totalStepsEstimate } from "../data/decisionTree"
import type { QuestionNode, TreeNode, TreeStep } from "../data/types"

export function useDecisionTree() {
  const [currentId, setCurrentId] = useState(startNodeId)
  const [history, setHistory] = useState<TreeStep[]>([])
  const [flags, setFlags] = useState<Record<string, boolean>>({})

  const currentNode: TreeNode = decisionTree[currentId]

  const progress = useMemo(() => {
    const step = Math.min(history.length + 1, totalStepsEstimate)
    return Math.round((step / totalStepsEstimate) * 100)
  }, [history.length])

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

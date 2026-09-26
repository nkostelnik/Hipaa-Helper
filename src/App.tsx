import { AnimatePresence } from "motion/react"
import { ChecklistQuestion } from "./components/ChecklistQuestion"
import { Header } from "./components/Header"
import { ProgressBar } from "./components/ProgressBar"
import { QuestionCard } from "./components/QuestionCard"
import { ResultCard } from "./components/ResultCard"
import { useDecisionTree } from "./hooks/useDecisionTree"

function App() {
  const {
    currentNode,
    history,
    flags,
    progress,
    canGoBack,
    answer,
    answerChecklist,
    goBack,
    reset,
  } = useDecisionTree()

  return (
    <div className="min-h-svh bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-2xl px-4 pb-16">
        <div className="no-print mb-6">
          <ProgressBar progress={currentNode.type === "result" ? 100 : progress} />
        </div>

        <AnimatePresence mode="wait">
          {currentNode.type === "question" && (
            <QuestionCard
              key={currentNode.id}
              node={currentNode}
              canGoBack={canGoBack}
              onAnswer={answer}
              onBack={goBack}
              onReset={reset}
            />
          )}
          {currentNode.type === "checklist" && (
            <ChecklistQuestion
              key={currentNode.id}
              node={currentNode}
              canGoBack={canGoBack}
              onContinue={answerChecklist}
              onBack={goBack}
              onReset={reset}
            />
          )}
          {currentNode.type === "result" && (
            <ResultCard
              key={currentNode.id}
              node={currentNode}
              steps={history}
              flags={flags}
              onReset={reset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App

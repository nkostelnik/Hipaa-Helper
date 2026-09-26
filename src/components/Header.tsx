import { ShieldCheck } from "lucide-react"

export function Header() {
  return (
    <header className="mx-auto w-full max-w-2xl px-4 pt-10 pb-4 text-center sm:pt-16">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm shadow-blue-600/30">
        <ShieldCheck className="h-6 w-6" strokeWidth={2.25} />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
        HIPAA Helper
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 sm:text-base dark:text-slate-400">
        Answer a few plain-language questions to find out whether a Business
        Associate Agreement is required.
      </p>
    </header>
  )
}

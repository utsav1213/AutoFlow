import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Cpu,
  GitBranch,
  Layers,
  Play,
  Settings2,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 dark:bg-black dark:text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-black/80 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">AutoFlow</span>
        </div>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            Features
          </Link>
          <Link
            href="#integrations"
            className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            Integrations
          </Link>
          <Link
            href="#pricing"
            className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Show when="signed-out">
            <SignInButton>
              <button className="hidden text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:block">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-700 hover:ring-2 hover:ring-indigo-600/50 hover:ring-offset-2 dark:hover:ring-offset-black">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/editor"
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-700 hover:ring-2 hover:ring-indigo-600/50 hover:ring-offset-2 dark:hover:ring-offset-black"
            >
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 lg:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-950/40 dark:via-black dark:to-black"></div>

          <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              <span>Introducing the next-gen visual workflow builder</span>
            </div>

            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Automate your work <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
                without limits
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl">
              Connect thousands of apps, design complex logic freely, and watch
              your productivity soar. The most flexible workflow automation tool
              built for developers and makers alike.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/editor"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 text-lg font-semibold text-white transition-all hover:bg-indigo-700 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 sm:w-auto"
              >
                Start for free
              </Link>
              <Link
                href="#features"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800 sm:w-auto"
              >
                <Play className="h-5 w-5 fill-current" /> See how it works
              </Link>
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No credit card required • 14-day free trial on Pro
            </p>
          </div>

          {/* Hero Image / Editor Mockup */}
          <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-indigo-500/5">
              <div className="flex h-10 w-full items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <div className="ml-4 flex h-6 flex-1 items-center rounded bg-white px-2 text-xs text-slate-400 dark:bg-slate-800">
                  <span className="flex items-center gap-2">
                    <Workflow className="h-3 w-3" /> autoflow.app /
                    my-awesome-workflow
                  </span>
                </div>
              </div>

              <div className="relative flex h-[400px] w-full items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] md:h-[600px]">
                {/* Visual representation of nodes */}
                <div className="absolute top-[20%] left-[10%] flex h-16 w-64 items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">Webhook Target</p>
                    <p className="text-xs text-slate-500">On record created</p>
                  </div>
                </div>

                {/* Connecting Line */}
                <svg
                  className="absolute top-[28%] left-[28%] h-24 w-32 -rotate-12 stroke-indigo-400 stroke-2 opacity-50 dark:stroke-indigo-600"
                  fill="none"
                >
                  <path
                    d="M0,0 C50,0 50,100 100,100"
                    strokeDasharray="4 4"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                </svg>

                <div className="absolute top-[35%] left-[40%] flex h-16 w-64 items-center gap-4 rounded-xl border-2 border-indigo-500 bg-white p-3 shadow-md dark:border-indigo-500 dark:bg-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">AI Assistant (GPT-4)</p>
                    <p className="text-xs text-slate-500">
                      Processing input...
                    </p>
                  </div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-500"></div>
                </div>

                {/* Connecting Line */}
                <svg
                  className="absolute top-[42%] left-[64%] h-24 w-32 rotate-12 stroke-indigo-400 stroke-2 opacity-50 dark:stroke-indigo-600"
                  fill="none"
                >
                  <path d="M0,0 C50,0 50,100 100,100" strokeDasharray="4 4" />
                </svg>

                <div className="absolute top-[55%] left-[70%] flex h-16 w-64 items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">Email Action</p>
                    <p className="text-xs text-slate-500">
                      Send summary report
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                Build faster
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to automate
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Unlike older tools that limit your logic, AutoFlow gives you a
                boundless canvas with infinite possibilities for integrations,
                looping, and branching logic.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600">
                      <Workflow
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    Visual Canvas
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                    <p className="flex-auto">
                      Design workflows as you think. Drag, drop, and connect
                      nodes intuitively. Understand complex logic at a single
                      glance with our powerful visual engine.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600">
                      <GitBranch
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    Advanced Logic
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                    <p className="flex-auto">
                      Go beyond simple A-to-B zaps. Use IF/ELSE conditions,
                      loops, parallel execution, and transform data powerfully
                      between thousands of application nodes.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-600">
                      <Settings2
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    Code when you need it
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                    <p className="flex-auto">
                      Drop into raw JavaScript/TypeScript or Python nodes
                      anytime you need custom data manipulation. Combine the
                      best of no-code speed with pro-code power.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Integration / Nodes Preview Section */}
        <section
          id="integrations"
          className="bg-slate-100 py-24 dark:bg-slate-900/50 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Connect any app. <br />
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Literally, any app.
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                  We're constantly expanding our node ecosystem. Whether you are
                  connecting to popular CRMs, proprietary databases, large
                  language models, or internal webhooks, AutoFlow is ready out
                  of the box.
                </p>
                <div className="mt-8 flex items-center gap-x-6">
                  <Link
                    href="/integrations"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Explore all 1000+ integrations{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {/* Simulated Integration Icons */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md dark:bg-slate-800 dark:ring-slate-700"
                  >
                    <div
                      className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate py-24 px-6 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-indigo-600"></div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to automate your workflows?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Stop doing manual tasks. Start building scalable, robust
              automation flows that run while you sleep.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/editor"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Go to Builder
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold">AutoFlow.</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} AutoFlow Inc. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link
                href="#"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

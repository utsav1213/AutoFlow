import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Code2,
  Database,
  GitBranch,
  Globe,
  Layers,
  MessageSquare,
  Settings2,
  Workflow,
  Zap,
  Server,
  TerminalSquare,
  ShieldCheck,
  Star,
  Users,
  Check,
} from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] font-sans text-slate-300 selection:bg-[#FF4F00]/30 selection:text-white">
      {/* n8n style top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/5 bg-[#0B0B0F]/90 px-4 backdrop-blur-md md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Workflow className="h-6 w-6 text-[#FF4F00]" />
            <span className="text-xl font-semibold tracking-tight">
              autoflow
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="#product"
              className="hover:text-white transition-colors"
            >
              Product
            </Link>
            <Link
              href="#use-cases"
              className="hover:text-white transition-colors"
            >
              Use cases
            </Link>
            <Link href="#docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link
              href="#community"
              className="hover:text-white transition-colors"
            >
              Community
            </Link>
            <Link
              href="#enterprise"
              className="hover:text-white transition-colors"
            >
              Enterprise
            </Link>
            <Link
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white sm:flex">
            <GitBranch className="h-3 w-3" /> 186,971
          </div>

          <Show when="signed-out">
            <SignInButton>
              <button className="text-slate-300 hover:text-white transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-md bg-[#FF4F00] px-4 py-1.5 text-white transition-all hover:bg-[#e64700]">
                Get Started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/editor"
              className="rounded-md bg-[#FF4F00] px-4 py-1.5 text-white transition-all hover:bg-[#e64700]"
            >
              Open Editor
            </Link>
            <div className="ml-2">
              <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
            </div>
          </Show>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4F00]/10 blur-[120px]" />

          <div className="mx-auto flex max-w-[800px] flex-col items-center px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-[3.5rem] leading-[1.1]">
              Workflows and automation <br className="hidden md:block" />
              you can see and control
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/editor"
                className="rounded-md bg-[#FF4F00] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e64700]"
              >
                Get started for free
              </Link>
              <Link
                href="#sales"
                className="rounded-md border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Talk to sales
              </Link>
            </div>

            <p className="mt-8 max-w-[600px] text-[15px] leading-relaxed text-slate-400">
              Build visually, go deep with code, connect to anything. Every step
              of your workflow's reasoning, traceable on the canvas. Deploy on
              your infrastructure or ours.
            </p>

            <div className="mt-16 flex flex-col items-center gap-6 border-t border-white/5 pt-10 w-full">
              <p className="text-xs text-slate-500 uppercase tracking-widest text-left w-full max-w-[800px] mb-2">
                The next-generation workflow automation platform built for modern engineering teams
              </p>
              <div className="flex flex-wrap items-center justify-between w-full opacity-60 grayscale gap-8 text-xl font-bold text-white">
                <span>PostgreSQL</span>
                <span>Redis</span>
                <span>BullMQ</span>
                <span>Gemini AI</span>
              </div>
            </div>
          </div>
        </section>

        {/* Editor Mockup Section */}
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* Left Tabs */}
            <div className="flex w-full flex-col gap-2 lg:w-64 shrink-0">
              <div className="rounded-lg border-l-2 border-[#FF4F00] bg-white/5 p-4 transition-colors cursor-pointer">
                <h3 className="text-white font-medium">
                  Engineers{" "}
                  <span className="text-slate-400 font-normal">can</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Transform and sync databases
                </p>
              </div>
              <div className="rounded-lg border-l-2 border-transparent p-4 transition-colors hover:bg-white/5 cursor-pointer">
                <h3 className="text-white font-medium">
                  Developers{" "}
                  <span className="text-slate-400 font-normal">can</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Integrate LLMs into product logic
                </p>
              </div>
              <div className="rounded-lg border-l-2 border-transparent p-4 transition-colors hover:bg-white/5 cursor-pointer">
                <h3 className="text-white font-medium">
                  Product{" "}
                  <span className="text-slate-400 font-normal">can</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Build complex automation without dev time
                </p>
              </div>
              <div className="rounded-lg border-l-2 border-transparent p-4 transition-colors hover:bg-white/5 cursor-pointer">
                <h3 className="text-white font-medium">
                  Founders <span className="text-slate-400 font-normal">can</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Automate entire business operations
                </p>
              </div>
            </div>

            {/* Canvas Mockup */}
            <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#13131A] shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(#2A2A35_1px,transparent_1px)] [background-size:24px_24px]"></div>

              <svg className="absolute inset-0 h-full w-full pointer-events-none">
                {/* Main line */}
                <path
                  d="M 200 300 L 400 300"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="2"
                />
                <path
                  d="M 580 300 L 680 300"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="2"
                />

                {/* Branches */}
                <path
                  d="M 760 300 C 800 300 800 200 850 200"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="2"
                />
                <path
                  d="M 760 300 C 800 300 800 400 850 400"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="2"
                />

                {/* Sub-connections (dotted) */}
                <path
                  d="M 450 340 L 400 450"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 490 340 L 490 450"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 530 340 L 600 450"
                  fill="none"
                  stroke="#3F3F46"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Nodes */}
              {/* Trigger */}
              <div className="absolute top-[260px] left-[100px] flex w-[160px] items-center gap-3 rounded-lg border border-white/10 bg-[#1C1C24] p-3 text-white shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500/20 text-teal-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-medium leading-tight">
                    Webhook
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    On record updated
                  </p>
                </div>
              </div>

              {/* AI Agent Node (Central) */}
              <div className="absolute top-[250px] left-[400px] flex w-[180px] flex-col rounded-lg border-2 border-white/20 bg-[#1C1C24] shadow-lg">
                <div className="flex items-center gap-3 border-b border-white/10 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-black">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-medium text-white">
                      Data Processor
                    </h4>
                    <p className="text-[11px] text-slate-500">Code Node</p>
                  </div>
                </div>
                <div className="flex justify-between px-4 py-2 text-[10px] text-slate-500">
                  <span>Input</span>
                  <span>Memory</span>
                  <span>Tools</span>
                </div>
              </div>

              {/* Sub-nodes */}
              <div className="absolute top-[450px] left-[350px] flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1C1C24] text-white">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-slate-400 text-center">
                  Custom JS
                  <br />
                  Transformer
                </span>
              </div>

              <div className="absolute top-[450px] left-[465px] flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1C1C24] text-blue-400">
                  <Database className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-slate-400 text-center">
                  Postgres
                  <br />
                  Query
                </span>
              </div>

              <div className="absolute top-[450px] left-[580px] flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1C1C24] text-orange-400">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-slate-400 text-center">
                  Redis
                  <br />
                  Cache
                </span>
              </div>

              {/* Logic Gate */}
              <div className="absolute top-[260px] left-[680px] flex items-center gap-3 rounded-lg border border-white/10 bg-[#1C1C24] p-3 text-white shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500/20 text-green-400">
                  <GitBranch className="h-4 w-4" />
                </div>
                <h4 className="text-[13px] font-medium">If Valid?</h4>
              </div>

              {/* True/False Branches */}
              <div className="absolute top-[160px] left-[850px] flex w-[160px] items-center gap-3 rounded-lg border border-white/10 bg-[#1C1C24] p-3 text-white shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/20 text-blue-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-medium leading-tight">
                    Slack
                  </h4>
                  <p className="text-[11px] text-slate-500">Send success msg</p>
                </div>
              </div>

              <div className="absolute top-[360px] left-[850px] flex w-[160px] items-center gap-3 rounded-lg border border-white/10 bg-[#1C1C24] p-3 text-white shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-red-500/20 text-red-400">
                  <Settings2 className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-medium leading-tight">
                    Jira
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Create bug ticket
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Bar */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="rounded-lg bg-[#FF4F00]/20 p-2 text-[#FF4F00]">
                <GitBranch className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">High Performance.</strong> Built on Next.js and BullMQ for reliable background execution.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                <Star className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Type-Safe.</strong> Fully written in TypeScript for predictable and stable workflows.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">AI Native.</strong> First-class support for Google Gemini and modern AI workflows.
              </p>
            </div>
          </div>
        </section>

        {/* Integrations Banner */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-slate-400 mb-8">
              Use pre-built nodes for common apps. Custom API connections for
              everything else.
            </p>

            <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale mx-auto max-w-4xl">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10"
                >
                  <div className="h-6 w-6 rounded bg-white/20"></div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button className="rounded-md border border-white/10 bg-white/5 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10">
                Browse all integrations
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl mb-4">
              Build workflows <br />
              you can actually follow
            </h2>
            <p className="text-slate-400">
              Connect any model. Inspect every decision. Keep humans in the
              loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-8 flex flex-col h-full">
              <h3 className="text-2xl font-medium text-white mb-4">
                Build complex logic
                <br />
                without getting boxed in
              </h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">
                Handle multi-step setups and data transformations. Use multiple
                APIs or custom databases. Integrate with legacy systems while
                staying set up for the future with custom code support.
              </p>
              <button className="self-start rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700">
                Explore Automation
              </button>

              {/* Graphic */}
              <div className="mt-10 rounded-xl bg-black/40 border border-white/5 p-6 flex justify-center items-center h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                    <Database className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="w-10 border-t border-dashed border-white/30"></div>
                  <div className="h-14 w-24 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                    <Settings2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-10 border-t border-dashed border-white/30"></div>
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                    <Globe className="h-5 w-5 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Feature Card 2 */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-8 flex-1">
                <h3 className="text-xl font-medium text-white mb-3">
                  Let AI and code guide decisions
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Enforce structured inputs and outputs to control the data flow
                  to and from automated steps. Leverage Google Gemini and local LLMs to make intelligent branching decisions dynamically.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg bg-white/5 p-3 text-xs text-slate-300 border border-white/5">
                    "AutoFlow analyzed the incoming support ticket and routed it to engineering."
                  </div>
                  <div className="rounded-lg bg-white/5 p-3 text-xs text-slate-300 border border-white/5">
                    "A webhook triggered a background job via BullMQ to sync user data to Redis."
                  </div>
                </div>
              </div>

              {/* Feature Card 3 (Runs where you decide) */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-8">
                <h3 className="text-xl font-medium text-white mb-3">
                  Runs where you decide
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Protect your data by deploying on-prem.
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-[#FF4F00]" /> Deploy with
                    Docker
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-[#FF4F00]" /> Access the
                    entire source code on GitHub
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-[#FF4F00]" /> Hosted version
                    also available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Huge Highlight Section (Code when you need it) */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#FF4F00]/90 to-[#992f00] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            {/* Star dots background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff30_1px,_transparent_1px)] [background-size:24px_24px] opacity-30"></div>

            <div className="relative z-10 flex-1 max-w-xl">
              <h2 className="text-3xl font-medium text-white sm:text-5xl mb-6 leading-tight">
                Code when you need it,
                <br /> UI when you don't
              </h2>
              <p className="text-orange-100 text-base mb-8">
                Other tools limit you to either a visual building experience, or
                code. With AutoFlow, you get the best of both worlds.
              </p>

              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <TerminalSquare className="h-6 w-6 text-white shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      Write JavaScript or Python
                    </strong>
                    <span className="text-orange-200 text-sm">
                      anywhere in your workflow. Imagine it, then build it.
                    </span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <Layers className="h-6 w-6 text-white shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      See the inputs and outputs
                    </strong>
                    <span className="text-orange-200 text-sm">
                      right next to the settings of every step. No unnecessary
                      clicks.
                    </span>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <ShieldCheck className="h-6 w-6 text-white shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">
                      Test workflows with real data
                    </strong>
                    <span className="text-orange-200 text-sm">
                      to improve accuracy and catch errors before your customers
                      do.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative z-10 w-full md:w-[500px] h-[350px] bg-[#0B0B0F] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-xs text-slate-400 font-mono">
                  Code Node
                </span>
              </div>
              <div className="p-4 font-mono text-sm text-green-400 flex-1 bg-[#13131A] overflow-hidden">
                <span className="text-purple-400">const</span> data = items[
                <span className="text-orange-400">0</span>].json;
                <br />
                <br />
                <span className="text-slate-500">// Transform data</span>
                <br />
                <span className="text-purple-400">const</span> result =
                data.records.map(record {`=>`} ({`{`}
                <br />
                &nbsp;&nbsp;id: record.id,
                <br />
                &nbsp;&nbsp;status: record.value &gt;{" "}
                <span className="text-orange-400">100</span> ?{" "}
                <span className="text-green-300">'VIP'</span> :{" "}
                <span className="text-green-300">'Standard'</span>
                <br />
                {`}`}));
                <br />
                <br />
                <span className="text-purple-400">return</span> result;
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B0B0F] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            <div className="col-span-2 lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2 mb-6 text-white"
              >
                <Workflow className="h-6 w-6 text-[#FF4F00]" />
                <span className="text-xl font-semibold tracking-tight">
                  autoflow
                </span>
              </Link>
              <p className="text-slate-400 text-sm max-w-xs mb-6">
                Fair-code licensed workflow automation tool. Easily automate
                tasks across different services.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Enterprise
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Supported apps
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Solutions</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    For IT Ops
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    For Engineering
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Alternatives
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community Forum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} AutoFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

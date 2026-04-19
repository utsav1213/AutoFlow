import ReachflowEditor from "@/components/ReachflowEditor";

export default function EditorPage() {
  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
        Flow Editor
      </h2>
      <ReachflowEditor />
    </div>
  );
}

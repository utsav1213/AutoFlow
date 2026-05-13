"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  useReactFlow,
  Handle,
  Position,
} from "@xyflow/react";
import {
  Plus,
  Play,
  Search,
  MousePointerClick,
  X,
  RefreshCw,
  Network,
  Save,
} from "lucide-react";

// 1. Custom Node mimicking n8n style
const CustomNode = ({ data, selected }: any) => {
  const isTrigger = data.category === "trigger";

  return (
    <div
      className={`min-w-[200px] bg-[#1a1a1a] border-2 rounded-lg shadow-xl transition-all ${selected ? "border-orange-500 shadow-orange-500/20" : "border-gray-700"}`}
    >
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-300 border-2 border-[#1a1a1a]"
        />
      )}

      <div className="px-4 py-3 flex items-center gap-3">
        <div className="text-2xl px-1">{data.icon}</div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-gray-100">
            {data.label}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{data.description}</div>
          {data.output && (
            <div className="mt-2 text-xs text-green-400 bg-green-900/20 p-2 rounded max-w-[200px] break-words border border-green-500/20">
              {data.output}
            </div>
          )}
        </div>
      </div>

      {data.type === "condition" ? (
        <div className="absolute -right-3 top-0 bottom-0 flex flex-col justify-center gap-4">
          <div className="relative group">
            <span className="absolute right-4 text-[10px] text-green-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              True
            </span>
            <Handle
              type="source"
              id="true"
              position={Position.Right}
              className="w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] !relative !right-0 !transform-none"
            />
          </div>
          <div className="relative group">
            <span className="absolute right-4 text-[10px] text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              False
            </span>
            <Handle
              type="source"
              id="false"
              position={Position.Right}
              className="w-3 h-3 bg-red-500 border-2 border-[#1a1a1a] !relative !right-0 !transform-none"
            />
          </div>
        </div>
      ) : (
        <Handle
          type="source"
          id="default"
          position={Position.Right}
          className="w-3 h-3 bg-orange-500 border-2 border-[#1a1a1a]"
        />
      )}
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

let id = 0;
const getId = () => `node_${Date.now()}_${id++}`;

function EditorContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const [excludeCron, setExcludeCron] = useState(false);
  const [excludeLLMAction, setExcludeLLMAction] = useState(false);
  const [excludeLLMCreds, setExcludeLLMCreds] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Command palette UI states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteSearch, setCommandPaletteSearch] = useState("");
  const [commandPalettePosition, setCommandPalettePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("autoflow.buildOptions");
      if (stored) {
        const parsed = JSON.parse(stored);
        setExcludeCron(parsed.excludeCron || false);
        setExcludeLLMAction(parsed.excludeLLMAction || false);
        setExcludeLLMCreds(parsed.excludeLLMCreds || false);
      }
    } catch (err) {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPalettePosition(null); // Center of screen
        setIsCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: any) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: "#f97316", strokeWidth: 2 },
        },
        eds,
      ),
    );
  }, []);

  const onSelectionChange = useCallback(({ nodes }: any) => {
    setSelectedNodeId(nodes.length > 0 ? nodes[0].id : null);
  }, []);

  const lastClickTime = useRef(0);
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedNodeId(null);
      const now = Date.now();
      if (now - lastClickTime.current < 300) {
        // Double click
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        setCommandPalettePosition(position);
        setIsCommandPaletteOpen(true);
      }
      lastClickTime.current = now;
    },
    [screenToFlowPosition],
  );

  const updateNodeData = (key: string, value: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNodeId) {
          return { ...n, data: { ...n.data, [key]: value } };
        }
        return n;
      }),
    );
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const handleSaveWorkflow = async () => {
    if (nodes.length === 0)
      return alert("Please add some nodes before saving.");

    try {
      const res = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "My Workflow",
          enabled: true,
          workflowJson: { nodes, edges },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWorkflowId(data.id);
        alert(
          "Workflow saved to database successfully! You can now execute it.",
        );
      } else {
        alert("Failed to save workflow.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving workflow.");
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!workflowId) {
      return alert("Please save the workflow first before executing.");
    }

    try {
      const res = await fetch(`/api/workflow/${workflowId}/execute`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Workflow execution triggered! Execution ID: ${data.executionId}`,
        );
      } else {
        alert("Failed to trigger execution.");
      }
    } catch (err) {
      console.error(err);
      alert("Error executing workflow.");
    }
  };

  const addBlockToCanvas = (blockConfig: any) => {
    let position = commandPalettePosition;
    if (!position) {
      try {
        position = screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      } catch (err) {
        position = { x: 250, y: 250 };
      }
    }

    const payload = {
      category: blockConfig.data?.category || "action",
      type: blockConfig.type,
      icon: blockConfig.icon,
      label: blockConfig.label,
      description: blockConfig.description,
    };

    const newNode = {
      id: getId(),
      type: "customNode",
      position,
      data: payload,
    };

    setNodes((nds) => nds.concat(newNode));
    setSelectedNodeId(newNode.id);
    setIsCommandPaletteOpen(false);
    setCommandPaletteSearch("");
  };

  // Available blocks for command palette
  const availableBlocks = [
    {
      category: "Triggers",
      type: "webhook",
      icon: "🚀",
      label: "Webhook",
      description: "Catch HTTP POST",
      data: { category: "trigger" },
    },
    {
      category: "Triggers",
      type: "manual",
      icon: "👆",
      label: "Manual Trigger",
      description: "Start manually",
      data: { category: "trigger" },
    },
    ...(!excludeCron
      ? [
          {
            category: "Triggers",
            type: "cron",
            icon: "⏰",
            label: "CRON Schedule",
            description: "Run periodically",
            data: { category: "trigger" },
          },
        ]
      : []),
    {
      category: "Actions",
      type: "telegram",
      icon: "💬",
      label: "Telegram",
      description: "Send a message",
      data: { category: "action" },
    },
    {
      category: "Actions",
      type: "resend",
      icon: "✉️",
      label: "Email (Resend)",
      description: "Send an email",
      data: { category: "action" },
    },
    {
      category: "AI",
      type: "llm",
      icon: "🤖",
      label: "LLM Response",
      description: "Generate text",
      data: { category: "action" },
    },
    {
      category: "Actions",
      type: "http",
      icon: "🌐",
      label: "HTTP Request",
      description: "Make API calls",
      data: { category: "action" },
    },
    {
      category: "Actions",
      type: "scraper",
      icon: "🕷️",
      label: "Web Scraper",
      description: "Extract data from a URL",
      data: { category: "action" },
    },
    {
      category: "Actions",
      type: "storage",
      icon: "💾",
      label: "File Storage",
      description: "Save data to storage",
      data: { category: "action" },
    },
    {
      category: "Logic",
      type: "condition",
      icon: "🔀",
      label: "If / Else",
      description: "Branch workflow",
      data: { category: "action" },
    },
  ];

  const filteredBlocks = availableBlocks.filter(
    (b) =>
      b.label.toLowerCase().includes(commandPaletteSearch.toLowerCase()) ||
      b.description
        .toLowerCase()
        .includes(commandPaletteSearch.toLowerCase()) ||
      b.category.toLowerCase().includes(commandPaletteSearch.toLowerCase()),
  );

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-[#0b0b0b] flex items-center justify-center text-white">
        Loading Editor...
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#0b0b0b] flex flex-col text-white overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-800 bg-[#0f0f0f]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Network className="text-[#db4a2b] w-5 h-5" />
            Autoflow
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">Autoflow Editor</span>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Slim Left Sidebar */}
        <aside className="w-12 border-r border-gray-800 bg-[#0f0f0f] flex flex-col items-center py-4 gap-4 z-20">
          <button
            onClick={() => {
              setIsCommandPaletteOpen(true);
              setCommandPalettePosition(null);
            }}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            title="Add Block"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleSaveWorkflow}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded transition-colors"
            title="Save Workflow"
          >
            <Save className="w-5 h-5" />
          </button>
          {workflowId && (
            <button
              onClick={handleExecuteWorkflow}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded transition-colors"
              title="Run Workflow"
            >
              <Play className="w-5 h-5" />
            </button>
          )}
        </aside>

        {/* Main Canvas */}
        <div
          className="flex-1 relative bg-[#0b0b0b]"
          ref={reactFlowWrapper}
          onDoubleClickCapture={(e) => {
            const position = screenToFlowPosition({
              x: e.clientX,
              y: e.clientY,
            });
            setCommandPalettePosition(position);
            setIsCommandPaletteOpen(true);
          }}
        >
          {/* Canvas Top Toolbar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0f0f0f] border border-gray-800 rounded px-3 py-1.5 shadow-lg">
            <span className="text-sm font-medium text-gray-200">
              My Workflow
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-600/20 text-yellow-500 rounded uppercase tracking-wider">
              {workflowId ? "Saved" : "Draft"}
            </span>
            <div className="w-px h-4 bg-gray-700 mx-1"></div>
            <button
              className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
              onClick={() => setNodes([])}
            >
              <RefreshCw className="w-3 h-3" /> Clear
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onPaneClick={onPaneClick}
            fitView
            style={{ background: "#0b0b0b" }}
          >
            <Background gap={20} color="#222" size={1.5} />
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 text-gray-500 text-sm bg-[#0b0b0b]/80 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-800/50">
                  <MousePointerClick className="w-4 h-4" />
                  <span>Double Click anywhere or press</span>
                  <span className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 font-mono text-xs border border-gray-700">
                    ⌘K
                  </span>
                  <span>to add a block</span>
                </div>
              </div>
            )}
            <Controls className="bg-[#1c1c1c] border-gray-800 fill-gray-400" />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Node Properties */}
        {selectedNode && (
          <aside className="w-80 border-l border-gray-800 bg-[#0f0f0f] flex flex-col shadow-2xl z-20 absolute right-0 h-full">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#141414]">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedNode.data.icon}</span>
                <span className="font-bold text-gray-100 text-sm">
                  {selectedNode.data.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
                Properties
              </h4>

              <div className="flex flex-col gap-4">
                {selectedNode.data.type === "webhook" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Webhook Path
                    </label>
                    <input
                      type="text"
                      value={selectedNode.data.path || ""}
                      onChange={(e) => updateNodeData("path", e.target.value)}
                      placeholder="/my-webhook"
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                )}
                {selectedNode.data.type === "telegram" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.credentialId || ""}
                        onChange={(e) =>
                          updateNodeData("credentialId", e.target.value)
                        }
                        placeholder="UUID"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Chat ID
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.chatId || ""}
                        onChange={(e) =>
                          updateNodeData("chatId", e.target.value)
                        }
                        placeholder="@channel or ID"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Message Text
                      </label>
                      <textarea
                        value={selectedNode.data.message || ""}
                        onChange={(e) =>
                          updateNodeData("message", e.target.value)
                        }
                        placeholder="Hello world"
                        rows={4}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                {selectedNode.data.type === "resend" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.credentialId || ""}
                        onChange={(e) =>
                          updateNodeData("credentialId", e.target.value)
                        }
                        placeholder="UUID"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        To Email
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.to || ""}
                        onChange={(e) => updateNodeData("to", e.target.value)}
                        placeholder="user@example.com"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.subject || ""}
                        onChange={(e) =>
                          updateNodeData("subject", e.target.value)
                        }
                        placeholder="Alert: Workflow"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Body (HTML)
                      </label>
                      <textarea
                        value={selectedNode.data.body || ""}
                        onChange={(e) => updateNodeData("body", e.target.value)}
                        placeholder="<p>Hello!</p>"
                        rows={4}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                {selectedNode.data.type === "llm" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.credentialId || ""}
                        onChange={(e) =>
                          updateNodeData("credentialId", e.target.value)
                        }
                        placeholder="Optional"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Prompt Template
                      </label>
                      <textarea
                        value={selectedNode.data.prompt || ""}
                        onChange={(e) =>
                          updateNodeData("prompt", e.target.value)
                        }
                        placeholder="Ask something..."
                        rows={6}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/llm/test", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              prompt: selectedNode.data.prompt,
                              credentialId: selectedNode.data.credentialId,
                            }),
                          });
                          const data = await res.json();
                          if (data.output)
                            updateNodeData("output", data.output);
                          else
                            alert(data.error || "Failed to get LLM response");
                        } catch (err) {
                          alert("Error contacting LLM");
                        }
                      }}
                      className="w-full mt-2 px-4 py-2 border border-blue-900/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded transition-colors"
                    >
                      Test LLM Node
                    </button>
                  </>
                )}
                {selectedNode.data.type === "http" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Method
                      </label>
                      <select
                        value={selectedNode.data.method || "GET"}
                        onChange={(e) =>
                          updateNodeData("method", e.target.value)
                        }
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      >
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        URL
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.url || ""}
                        onChange={(e) => updateNodeData("url", e.target.value)}
                        placeholder="https://api.example.com"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Headers (JSON)
                      </label>
                      <textarea
                        value={selectedNode.data.headers || ""}
                        onChange={(e) =>
                          updateNodeData("headers", e.target.value)
                        }
                        placeholder='{"Authorization": "Bearer..."}'
                        rows={3}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Body
                      </label>
                      <textarea
                        value={selectedNode.data.body || ""}
                        onChange={(e) => updateNodeData("body", e.target.value)}
                        placeholder='{"key": "value"}'
                        rows={3}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                {selectedNode.data.type === "scraper" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        URL
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.url || ""}
                        onChange={(e) => updateNodeData("url", e.target.value)}
                        placeholder="https://example.com"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        CSS Selector (Optional)
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.selector || ""}
                        onChange={(e) =>
                          updateNodeData("selector", e.target.value)
                        }
                        placeholder="h1, .article, etc."
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                {selectedNode.data.type === "storage" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Provider
                      </label>
                      <select
                        value={selectedNode.data.provider || "local"}
                        onChange={(e) =>
                          updateNodeData("provider", e.target.value)
                        }
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      >
                        <option value="local">Local Mock</option>
                        <option value="s3">AWS S3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        File Path
                      </label>
                      <input
                        type="text"
                        value={selectedNode.data.path || ""}
                        onChange={(e) => updateNodeData("path", e.target.value)}
                        placeholder="/my-files/data.txt"
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Content
                      </label>
                      <textarea
                        value={selectedNode.data.content || ""}
                        onChange={(e) =>
                          updateNodeData("content", e.target.value)
                        }
                        placeholder="Data to save..."
                        rows={4}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                {selectedNode.data.type === "condition" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">
                        Condition Expression (JS)
                      </label>
                      <textarea
                        value={selectedNode.data.expression || ""}
                        onChange={(e) =>
                          updateNodeData("expression", e.target.value)
                        }
                        placeholder="$input.price > 100"
                        rows={3}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        E.g., `$input` contains previous node output.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-[#0f0f0f]">
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="w-full px-4 py-2 border border-red-900/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded transition-colors"
              >
                Delete Node
              </button>
            </div>
          </aside>
        )}

        {/* Command Palette Modal */}
        {isCommandPaletteOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 pointer-events-auto"
              onClick={() => setIsCommandPaletteOpen(false)}
            ></div>

            {/* Modal */}
            <div className="bg-[#1c1c1c] w-full max-w-xl rounded-xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden pointer-events-auto mt-[-10vh] relative z-10">
              <div className="flex items-center px-4 py-3 border-b border-gray-800">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search Blocks..."
                  value={commandPaletteSearch}
                  onChange={(e) => setCommandPaletteSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredBlocks.length > 0) {
                      addBlockToCanvas(filteredBlocks[0]);
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                />
              </div>

              <div className="flex h-[400px]">
                {/* Categories sidebar inside modal */}
                <div className="w-40 border-r border-gray-800 p-2 flex flex-col gap-1 overflow-y-auto bg-[#141414]">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                    Categories
                  </div>
                  <button className="flex items-center justify-between px-2 py-1.5 hover:bg-[#222] text-gray-200 rounded text-sm transition-colors">
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500/20 rounded flex items-center justify-center">
                        <span className="text-[10px]">AI</span>
                      </div>{" "}
                      AI
                    </span>
                    <span className="text-xs text-gray-500">1</span>
                  </button>
                  <button className="flex items-center justify-between px-2 py-1.5 text-gray-400 hover:bg-[#222] rounded text-sm transition-colors">
                    <span className="flex items-center gap-2">⚡ Triggers</span>
                    <span className="text-xs text-gray-600">
                      {!excludeCron ? 3 : 2}
                    </span>
                  </button>
                  <button className="flex items-center justify-between px-2 py-1.5 text-gray-400 hover:bg-[#222] rounded text-sm transition-colors">
                    <span className="flex items-center gap-2">▶ Actions</span>
                    <span className="text-xs text-gray-600">2</span>
                  </button>
                </div>

                {/* Block results */}
                <div className="flex-1 overflow-y-auto p-2 bg-[#1c1c1c]">
                  {filteredBlocks.map((block, idx) => (
                    <div
                      key={idx}
                      onClick={() => addBlockToCanvas(block)}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors group ${idx === 0 ? "bg-[#2a2a2a]" : "hover:bg-[#2a2a2a]"}`}
                    >
                      <div className="text-2xl mt-0.5">{block.icon}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                          {block.label}
                        </span>
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {block.description}
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredBlocks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No blocks found.
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-4 py-2 border-t border-gray-800 bg-[#141414] flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                      Esc
                    </kbd>{" "}
                    Close
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                    ↵
                  </kbd>{" "}
                  Add to canvas
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReachflowEditor() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}

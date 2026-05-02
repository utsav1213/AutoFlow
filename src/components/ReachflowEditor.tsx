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

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-500 border-2 border-[#1a1a1a]"
      />
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      const payload = JSON.parse(rawData);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: "customNode",
        position,
        data: payload, // payload contains category, type, icon, label, description
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNodeId(newNode.id); // auto-select newly dropped node
    },
    [screenToFlowPosition],
  );

  const onDragStart = (event: React.DragEvent, nodeData: any) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

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

  if (!isMounted) {
    return (
      <div className="w-full h-[800px] border border-gray-800 bg-[#0f0f0f] flex items-center justify-center text-white">
        Loading Editor...
      </div>
    );
  }

  return (
    <div className="w-full h-[800px] border border-gray-800 bg-[#0f0f0f] flex text-white relative flex-row overflow-hidden font-sans">
      {/* Left Toolbar (Nodes Palette) */}
      <aside className="w-64 border-r border-gray-800 bg-[#161616] p-4 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-6">Nodes</h2>

          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
            Triggers
          </h4>
          <div className="flex flex-col gap-2">
            <div
              className="px-3 py-2 flex items-center gap-3 border border-gray-700 bg-[#222] rounded cursor-grab hover:bg-[#2a2a2a] transition-colors"
              onDragStart={(e) =>
                onDragStart(e, {
                  category: "trigger",
                  type: "webhook",
                  icon: "🚀",
                  label: "Webhook",
                  description: "Catch HTTP POST",
                })
              }
              draggable
            >
              <span className="text-lg">🚀</span>{" "}
              <span className="text-sm font-medium">Webhook</span>
            </div>
            <div
              className="px-3 py-2 flex items-center gap-3 border border-gray-700 bg-[#222] rounded cursor-grab hover:bg-[#2a2a2a] transition-colors"
              onDragStart={(e) =>
                onDragStart(e, {
                  category: "trigger",
                  type: "manual",
                  icon: "👆",
                  label: "Manual Trigger",
                  description: "Start manually",
                })
              }
              draggable
            >
              <span className="text-lg">👆</span>{" "}
              <span className="text-sm font-medium">Manual Trigger</span>
            </div>
            {!excludeCron && (
              <div
                className="px-3 py-2 flex items-center gap-3 border border-gray-700 bg-[#222] rounded cursor-grab hover:bg-[#2a2a2a] transition-colors"
                onDragStart={(e) =>
                  onDragStart(e, {
                    category: "trigger",
                    type: "cron",
                    icon: "⏰",
                    label: "CRON Schedule",
                    description: "Run periodically",
                  })
                }
                draggable
              >
                <span className="text-lg">⏰</span>{" "}
                <span className="text-sm font-medium">CRON Trigger</span>
              </div>
            )}
          </div>

          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mt-8 mb-3">
            Actions
          </h4>
          <div className="flex flex-col gap-2">
            <div
              className="px-3 py-2 flex items-center gap-3 border border-gray-700 bg-[#222] rounded cursor-grab hover:bg-[#2a2a2a] transition-colors"
              onDragStart={(e) =>
                onDragStart(e, {
                  category: "action",
                  type: "telegram",
                  icon: "💬",
                  label: "Telegram",
                  description: "Send a message",
                })
              }
              draggable
            >
              <span className="text-lg">💬</span>{" "}
              <span className="text-sm font-medium">Telegram</span>
            </div>
            <div
              className="px-3 py-2 flex items-center gap-3 border border-gray-700 bg-[#222] rounded cursor-grab hover:bg-[#2a2a2a] transition-colors"
              onDragStart={(e) =>
                onDragStart(e, {
                  category: "action",
                  type: "resend",
                  icon: "✉️",
                  label: "Email (Resend)",
                  description: "Send an email",
                })
              }
              draggable
            >
              <span className="text-lg">✉️</span>{" "}
              <span className="text-sm font-medium">Email (Resend)</span>
            </div>
            {/* Unconditionally show LLM Response node */}
            <div
              className="px-3 py-2 flex items-center gap-3 border border-gray-700 bg-[#222] rounded cursor-grab hover:bg-[#2a2a2a] transition-colors"
              onDragStart={(e) =>
                onDragStart(e, {
                  category: "action",
                  type: "llm",
                  icon: "🤖",
                  label: "LLM Response",
                  description: "Generate text",
                })
              }
              draggable
            >
              <span className="text-lg">🤖</span>{" "}
              <span className="text-sm font-medium">LLM Response</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          fitView
          style={{ background: "#0b0b0b" }}
        >
          <Background gap={20} color="#333" />
          <Controls className="bg-[#222] border-gray-700 fill-white" />
        </ReactFlow>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {workflowId && (
            <button
              onClick={handleExecuteWorkflow}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded shadow-lg transition-colors cursor-pointer"
            >
              Run Workflow
            </button>
          )}
          <button
            onClick={handleSaveWorkflow}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded shadow-lg transition-colors cursor-pointer"
          >
            Save Workflow
          </button>
        </div>
      </div>

      {/* Right Sidebar (Settings / Flow context) */}
      {selectedNode ? (
        <aside className="w-80 border-l border-gray-800 bg-[#161616] flex flex-col shadow-2xl z-20">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedNode.data.icon}</span>
              <span className="font-bold text-gray-100">
                {selectedNode.data.label}
              </span>
            </div>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="bg-orange-900/20 border border-orange-500/30 text-orange-200 text-xs px-3 py-2 rounded mb-6">
              Data flows from connected nodes. You can map variables in the
              parameters below.
            </div>

            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
              Parameters
            </h4>

            <div className="flex flex-col gap-4">
              {/* Webhook Properties */}
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
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Telegram Properties */}
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
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Chat ID
                    </label>
                    <input
                      type="text"
                      value={selectedNode.data.chatId || ""}
                      onChange={(e) => updateNodeData("chatId", e.target.value)}
                      placeholder="@channel or ID"
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
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
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </>
              )}

              {/* Resend Properties */}
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
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
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
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
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
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
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
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </>
              )}

              {/* LLM Properties */}
              {selectedNode.data.type === "llm" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Credential ID (Optional for Gemini in .env)
                    </label>
                    <input
                      type="text"
                      value={selectedNode.data.credentialId || ""}
                      onChange={(e) =>
                        updateNodeData("credentialId", e.target.value)
                      }
                      placeholder="Leave blank to use .env GOOGLE_GENERATIVE_AI_API_KEY"
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Prompt Template
                    </label>
                    <textarea
                      value={selectedNode.data.prompt || ""}
                      onChange={(e) => updateNodeData("prompt", e.target.value)}
                      placeholder="Example: What is the sum of 2+2?"
                      rows={6}
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500"
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
                        if (data.output) {
                          updateNodeData("output", data.output);
                        } else {
                          alert(data.error || "Failed to get LLM response");
                        }
                      } catch (err) {
                        alert("Error contacting LLM");
                      }
                    }}
                    className="w-full mt-2 px-4 py-2 border border-blue-900 bg-blue-950/30 hover:bg-blue-900/50 text-blue-500 text-sm font-bold rounded transition-colors"
                  >
                    Test LLM Node
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-800 bg-[#141414]">
            <button
              onClick={() => deleteNode(selectedNode.id)}
              className="w-full px-4 py-2 border border-red-900 bg-red-950/30 hover:bg-red-900/50 text-red-500 text-sm font-bold rounded transition-colors"
            >
              Delete Node
            </button>
          </div>
        </aside>
      ) : (
        <aside className="w-80 border-l border-gray-800 bg-[#161616] p-6 flex flex-col gap-4 text-center justify-center">
          <div className="text-gray-600 mb-2">
            <svg
              className="w-16 h-16 mx-auto opacity-20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <h3 className="text-gray-400 font-bold">No Node Selected</h3>
          <p className="text-sm text-gray-500">
            Click on a node in the canvas to view and edit its parameters here.
          </p>
        </aside>
      )}
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

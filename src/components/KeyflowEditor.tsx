"use client";

import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  Panel,
  BackgroundVariant,
} from "@xyflow/react";
import {
  Share2,
  GitBranch,
  Bookmark,
  CreditCard,
  Moon,
  MessageCircle,
  Plus,
  History,
  MousePointer2,
  Link as LinkIcon,
  Wand2,
  Crosshair,
  Move,
  Play,
  Spline,
  Rocket,
  Image as ImageIcon,
  MonitorPlay,
  TerminalSquare,
  Network,
  Maximize,
  Minus,
  MessageSquare
} from "lucide-react";
import '@xyflow/react/dist/style.css';

function EditorContent() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(() => {}, []);
  const onEdgesChange = useCallback(() => {}, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0a0a0a] text-[#a1a1aa] font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-12 border-b border-[#27272a]/50 bg-[#0a0a0a] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <Share2 className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="text-white font-semibold text-lg tracking-tight">Keyflow</span>
          </div>

          <nav className="flex items-center gap-6 ml-4 text-sm font-medium">
            <button className="flex items-center gap-2 text-white border-b-2 border-orange-500 pb-[14px] mt-[14px]">
              <GitBranch className="w-4 h-4" />
              Flows
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Bookmark className="w-4 h-4" />
              Templates
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <CreditCard className="w-4 h-4" />
              Pricing
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="hover:text-white transition-colors p-1">
            <Moon className="w-5 h-5" />
          </button>
          <button className="hover:text-white transition-colors p-1">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="bg-[#ea580c] hover:bg-[#d04e0a] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Vertical Sidebar */}
        <aside className="w-12 border-r border-[#27272a]/50 bg-[#0a0a0a] flex flex-col items-center py-4 gap-6 z-20">
          <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors text-orange-500">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors text-gray-500 hover:text-gray-300">
            <Network className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors text-gray-500 hover:text-gray-300">
            <Play className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors text-gray-500 hover:text-gray-300">
            <TerminalSquare className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#27272a] rounded-md transition-colors text-gray-500 hover:text-gray-300">
            <Rocket className="w-5 h-5" />
          </button>
        </aside>

        {/* Secondary Toolbar Overlay */}
        <div className="absolute top-4 left-16 right-4 z-10 flex justify-between items-center pointer-events-none">
          {/* Left Tools */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-md px-3 py-1.5 shadow-lg">
              <span className="text-sm font-medium text-white mr-3">Untitled Flow</span>
              <span className="text-[10px] uppercase font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded mr-3">
                Draft
              </span>
              <div className="w-[1px] h-4 bg-[#27272a] mx-1"></div>
              <button className="p-1 hover:text-white transition-colors">
                <History className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 ml-2 text-xs font-medium hover:text-white transition-colors">
                <MousePointer2 className="w-3.5 h-3.5" />
                Add Input
              </button>
            </div>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-md shadow-lg p-1">
              <button className="p-1.5 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                <Wand2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-orange-500 hover:bg-[#27272a] rounded transition-colors">
                <Crosshair className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                <Move className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                <Play className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                <Spline className="w-4 h-4" />
              </button>
            </div>

            <button className="bg-[#27272a]/80 hover:bg-[#27272a] border border-orange-900/50 text-orange-400 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-lg">
              Save
            </button>
            <button className="flex items-center gap-1.5 bg-[#27272a]/80 hover:bg-[#27272a] border border-green-900/50 text-green-400 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-lg">
              <Play className="w-3.5 h-3.5 fill-current" />
              Run
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 w-full h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            proOptions={{ hideAttribution: true }}
            className="bg-[#0a0a0a]"
          >
            <Background color="#27272a" variant={BackgroundVariant.Dots} gap={20} size={1} />
            
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 text-[#71717a] text-sm">
                  <span>✨</span>
                  <span>Double Click anywhere or press</span>
                  <kbd className="bg-[#18181b] border border-[#27272a] rounded px-1.5 py-0.5 text-xs font-sans text-[#a1a1aa] shadow-sm">
                    ⌘ K
                  </kbd>
                  <span>to add a block</span>
                </div>
              </div>
            )}

            {/* Bottom Left Zoom Controls */}
            <Panel position="bottom-left" className="m-4">
              <div className="flex flex-col bg-[#18181b] border border-[#27272a] rounded-md shadow-lg p-0.5 pointer-events-auto">
                <button className="p-2 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <div className="w-full h-[1px] bg-[#27272a]"></div>
                <button className="p-2 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-full h-[1px] bg-[#27272a]"></div>
                <button className="p-2 hover:bg-[#27272a] hover:text-white rounded transition-colors">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function KeyflowEditor() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}

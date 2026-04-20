'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCareer, type CareerNode } from '@/lib/context/CareerContext';
import { Lock, CheckCircle2, Circle, Play, ExternalLink, Clock, X } from 'lucide-react';

interface RoadmapGraphProps {
  className?: string;
}

const statusColors = {
  locked: 'bg-slate-700 border-slate-600 text-slate-400',
  available: 'bg-slate-800 border-orange-500/50 text-white',
  'in-progress': 'bg-orange-500/10 border-orange-500 text-orange-400',
  completed: 'bg-green-500/10 border-green-500 text-green-400',
};

const statusIcons = {
  locked: Lock,
  available: Circle,
  'in-progress': Play,
  completed: CheckCircle2,
};

function NodeDetails({ node, onClose, onStatusChange }: {
  node: CareerNode;
  onClose: () => void;
  onStatusChange: (status: CareerNode['status']) => void;
}) {
  const StatusIcon = statusIcons[node.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl border border-slate-700 p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${statusColors[node.status]}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{node.label}</h3>
              <p className="text-sm text-slate-400 capitalize">{node.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-300 mb-4">{node.description}</p>

        {node.estimatedTime && (
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Clock className="w-4 h-4" />
            <span>{node.estimatedTime}</span>
          </div>
        )}

        {node.links && node.links.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Resources</h4>
            <div className="space-y-2">
              {node.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {node.status !== 'locked' && node.status !== 'completed' && (
            <button
              onClick={() => onStatusChange('completed')}
              className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium hover:bg-green-500/30 transition-colors"
            >
              Mark Complete
            </button>
          )}
          {node.status === 'locked' && (
            <button
              onClick={() => onStatusChange('in-progress')}
              className="flex-1 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-medium hover:bg-orange-500/30 transition-colors"
            >
              Start Learning
            </button>
          )}
          {node.status === 'completed' && (
            <button
              onClick={() => onStatusChange('in-progress')}
              className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-600 transition-colors"
            >
              Mark In Progress
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function RoadmapGraph({ className = '' }: RoadmapGraphProps) {
  const { state, updateNodeStatus } = useCareer();
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Default layout for nodes without positions
  const getNodePosition = (node: CareerNode, index: number) => {
    if (node.x !== undefined && node.y !== undefined) {
      return { x: node.x, y: node.y };
    }
    // Fallback layout based on type
    const types = ['goal', 'skill', 'exam', 'milestone', 'outcome'];
    const typeIndex = types.indexOf(node.type);
    const perRow = 4;
    const col = index % perRow;
    const row = Math.floor(index / perRow);
    return {
      x: 100 + col * 250,
      y: 50 + row * 150 + typeIndex * 50,
    };
  };

  // Calculate SVG path between nodes
  const getPath = (from: CareerNode, to: CareerNode) => {
    const fromPos = getNodePosition(from, state.nodes.indexOf(from));
    const toPos = getNodePosition(to, state.nodes.indexOf(to));

    const startX = fromPos.x + 100; // Node width/2
    const startY = fromPos.y + 40;  // Node height/2
    const endX = toPos.x + 100;
    const endY = toPos.y + 40;

    // Bezier curve
    const midY = (startY + endY) / 2;
    return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev * delta)));
  };

  // Group nodes by type for legend
  const nodesByType = state.nodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = [];
    acc[node.type].push(node);
    return acc;
  }, {} as Record<CareerNode['type'], CareerNode[]>);

  const typeColors: Record<CareerNode['type'], string> = {
    goal: 'bg-blue-500/20 border-blue-500 text-blue-400',
    skill: 'bg-purple-500/20 border-purple-500 text-purple-400',
    exam: 'bg-red-500/20 border-red-500 text-red-400',
    milestone: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    outcome: 'bg-green-500/20 border-green-500 text-green-400',
  };

  const typeLabels: Record<CareerNode['type'], string> = {
    goal: 'Career Goals',
    skill: 'Skills',
    exam: 'Exams',
    milestone: 'Milestones',
    outcome: 'Outcomes',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur rounded-lg border border-slate-700 p-4">
        <h4 className="text-sm font-medium text-white mb-3">Legend</h4>
        <div className="space-y-2">
          {Object.entries(typeLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${typeColors[type as CareerNode['type']].split(' ')[0]}`} />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-500 mb-2">Status</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-slate-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs text-slate-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-xs text-slate-400">Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
          className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-700"
        >
          -
        </button>
        <button
          onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
          className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-700"
        >
          +
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 text-xs"
        >
          ⌂
        </button>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="w-full h-[600px] bg-slate-950 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* SVG Layer for Edges */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: '2000px', height: '1000px' }}
          >
            {state.edges.map((edge, i) => {
              const fromNode = state.nodes.find((n) => n.id === edge.from);
              const toNode = state.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <g key={i}>
                  <path
                    d={getPath(fromNode, toNode)}
                    fill="none"
                    stroke={toNode.status === 'locked' ? '#475569' : '#f97316'}
                    strokeWidth="2"
                    strokeDasharray={toNode.status === 'locked' ? '5,5' : '0'}
                    opacity={toNode.status === 'locked' ? 0.3 : 0.6}
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {state.nodes.map((node, index) => {
            const pos = getNodePosition(node, index);
            const StatusIcon = statusIcons[node.status];

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="absolute cursor-pointer group"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: 200,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
              >
                <div
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    statusColors[node.status]
                  } ${node.type === 'goal' ? 'bg-opacity-30' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className="w-5 h-5 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{node.label}</div>
                      <div className="text-xs opacity-70 truncate">{node.description}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Node Details Modal */}
      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onStatusChange={(status) => {
            updateNodeStatus(selectedNode.id, status);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
}

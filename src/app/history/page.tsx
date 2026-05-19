"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { Button } from "@/components/ui/Button";

export default function History() {
  const { history, clearHistory } = useHistory();

  // Remove dummy data to avoid confusion
  const displayHistory = history;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">History</h1>
        </div>
        <Button variant="danger" size="icon" onClick={clearHistory} className="h-10 w-10">
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayHistory.map((item) => (
          <Card key={item.id} className="relative overflow-hidden group border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500"></div>
            <div className="pl-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                  {item.type}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-300 font-mono text-sm mb-2 mt-2">{item.formula}</p>
              <p className="text-xl font-bold text-white font-mono">{item.result}</p>
            </div>
          </Card>
        ))}

        {displayHistory.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No history found</p>
          </div>
        )}
      </div>
    </div>
  );
}

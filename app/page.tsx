"use client";

import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import type { Todo, Priority, Filter } from "./types";

const STORAGE_KEY = "todo-nextjs";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<Filter>("pending");

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const title = input.trim();
    if (!title) return;
    setTodos((prev) => [
      { id: generateId(), title, priority, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: string, title: string, priority: Priority) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, priority } : t))
    );
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const filtered = todos.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const pendingCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.filter((t) => t.done).length;

  const filterLabels: Record<Filter, string> = {
    all: `すべて (${todos.length})`,
    pending: `未完了 (${pendingCount})`,
    done: `完了 (${doneCount})`,
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">TODO リスト</h1>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            追加
          </button>
        </div>
        <div className="flex gap-2">
          {(["high", "medium", "low"] as Priority[]).map((p) => {
            const labels: Record<Priority, string> = { high: "! 高", medium: "- 中", low: "v 低" };
            const active: Record<Priority, string> = {
              high: "bg-red-500 text-white border-red-500",
              medium: "bg-yellow-400 text-white border-yellow-400",
              low: "bg-green-500 text-white border-green-500",
            };
            const inactive = "bg-white text-gray-600 border-gray-200 hover:border-gray-400";
            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                  priority === p ? active[p] : inactive
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {(["pending", "all", "done"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Todo list */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-sm">
          {filter === "done" ? "完了済みのタスクはありません" : "タスクがありません"}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}

      {/* Clear done */}
      {doneCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={clearDone}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            完了済み ({doneCount}件) を削除
          </button>
        </div>
      )}
    </main>
  );
}

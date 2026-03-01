"use client";

import { useState } from "react";
import type { Todo, Priority } from "../types";

const priorityConfig: Record<Priority, { label: string; icon: string; classes: string }> = {
  high:   { label: "高", icon: "!", classes: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "中", icon: "-", classes: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low:    { label: "低", icon: "v", classes: "bg-green-100 text-green-700 border-green-200" },
};

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, priority: Priority) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, editTitle.trim(), editPriority);
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditTitle(todo.title);
      setEditPriority(todo.priority);
      setEditing(false);
    }
  };

  const p = priorityConfig[todo.priority];

  return (
    <li className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm group">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.done
            ? "bg-indigo-500 border-indigo-500 text-white"
            : "border-gray-300 hover:border-indigo-400"
        }`}
        aria-label={todo.done ? "未完了に戻す" : "完了にする"}
      >
        {todo.done && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {editing ? (
        <div className="flex-1 flex gap-2 items-center">
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
            className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none"
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600"
          >
            保存
          </button>
          <button
            onClick={() => { setEditTitle(todo.title); setEditPriority(todo.priority); setEditing(false); }}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 text-sm ${todo.done ? "line-through text-gray-400" : "text-gray-800"}`}
          >
            {todo.title}
          </span>
          <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full border ${p.classes}`}>
            {p.icon} {p.label}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-gray-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50"
              aria-label="編集"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              aria-label="削除"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
}

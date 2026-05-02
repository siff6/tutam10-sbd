"use client";

import React, { useState, useEffect, useCallback } from "react";

interface TodoItem {
  _id: string;
  text: string;
}

export default function Home() {
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorNote, setErrorNote] = useState<string | null>(null);

  const apiEndpoint = "/api/todos";

  const loadDataFromServer = useCallback(async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error("Gagal mengambil data");
      const result = await response.json();
      setTodoList(result);
      setErrorNote(null);
    } catch (err) {
      setErrorNote("Koneksi backend terputus");
    } finally {
      setIsProcessing(false);
    }
  }, [apiEndpoint]);

  const createNewEntry = async () => {
    if (!userInput.trim()) return;
    setIsProcessing(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userInput }),
      });
      if (response.ok) {
        setUserInput("");
        await loadDataFromServer();
      }
    } catch (err) {
      setErrorNote("Gagal menambah data");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeEntry = async (targetId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${apiEndpoint}/${targetId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await loadDataFromServer();
      }
    } catch (err) {
      setErrorNote("Gagal menghapus data");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadDataFromServer();
  }, [loadDataFromServer]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
        <header className="bg-indigo-600 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Hashif's Space
              </h1>
              <p className="text-indigo-100 text-sm mt-1 opacity-80 uppercase tracking-widest font-medium">
                Daily Task Manager
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400">
              <span className="font-bold text-lg">H</span>
            </div>
          </div>
        </header>

        <section className="p-8">
          <div className="relative group mb-8">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createNewEntry()}
              placeholder="Apa tugas Hashif hari ini?"
              className="w-full pl-4 pr-16 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-lg outline-none"
            />
            <button
              onClick={createNewEntry}
              disabled={isProcessing}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-slate-400 shadow-lg active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {errorNote && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 border border-rose-100 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-rose-600"></div>
              <span className="text-sm font-semibold">{errorNote}</span>
            </div>
          )}

          <div className="space-y-4">
            {todoList.length === 0 && !isProcessing ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">
                  Belum ada tugas, Hashif.
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {todoList.map((item) => (
                  <div
                    key={item._id}
                    className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all mb-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-transparent group-hover:bg-indigo-400"></div>
                      </div>
                      <span className="text-slate-700 font-medium text-lg leading-tight">
                        {item.text}
                      </span>
                    </div>
                    <button
                      onClick={() => removeEntry(item._id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Fullstack Application &copy; 2026 • Build by Hashif
          </p>
        </footer>
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { data } from "../data/todos";

const TODOS_KEY = "@todos_v1";
const initialTodos = [...data].sort((a, b) => b.id - a.id);

export function useTodos() {
  const [todos, setTodos] = useState(initialTodos);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const currentTodos = useRef(initialTodos);
  const ready = useRef(false);
  const saving = useRef(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const loadTodos = async () => {
      try {
        const json = await AsyncStorage.getItem(TODOS_KEY);
        const saved = json === null ? initialTodos : JSON.parse(json);
        const ids = new Set();
        if (!Array.isArray(saved) || !saved.every((todo) => {
          if (!todo || !Number.isSafeInteger(todo.id) || todo.id < 1 ||
              ids.has(todo.id) || typeof todo.title !== "string" ||
              !todo.title.trim() || typeof todo.completed !== "boolean") return false;
          ids.add(todo.id);
          return true;
        })) throw new Error("Invalid saved tasks");
        if (!active) return;
        // Persist only the three fields used by the original task model.
        const loaded = saved.map(({ id, title, completed }) => ({ id, title, completed }));
        currentTodos.current = loaded;
        setTodos(loaded);
        ready.current = true;
        setIsLoaded(true);
        setError(null);
      } catch {
        if (active) setError("Could not load tasks. Please retry.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadTodos();
    return () => { active = false; };
  }, [loadAttempt]);

  const saveChanges = async (change) => {
    // Lock immediately to avoid overlapping writes or duplicate submissions.
    if (!ready.current || saving.current) return false;
    saving.current = true;
    setIsSaving(true);
    try {
      const updated = change(currentTodos.current);
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(updated));
      currentTodos.current = updated;
      setTodos(updated);
      setError(null);
      return true;
    } catch {
      setError("Could not save tasks. Please try again.");
      return false;
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  };

  const addTodo = async (title) => {
    if (!title.trim()) return false;
    return saveChanges((previous) => {
      const newId = previous.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
      if (!Number.isSafeInteger(newId)) throw new Error("Invalid task ID");
      return [{ id: newId, title: title.trim(), completed: false }, ...previous];
    });
  };
  const toggleTodo = (id) => saveChanges((previous) => previous.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  const removeTodo = (id) => saveChanges((previous) => previous.filter((todo) => todo.id !== id));
  const retryLoad = () => {
    if (saving.current) return;
    ready.current = false;
    setIsLoaded(false);
    setIsLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  };

  return { todos, addTodo, toggleTodo, removeTodo, isLoading, isSaving, error,
    canEdit: isLoaded && !isLoading && !isSaving, retryLoad };
}
export default useTodos;

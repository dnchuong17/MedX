"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Send, Bot } from "lucide-react"
import { motion } from "framer-motion"
import BottomNavigation from "@/components/navbar"

interface Message {
  role: "user" | "bot"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isBotTyping, setIsBotTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isBotTyping])

  async function handleSend() {
    if (!input.trim()) return
    setIsBotTyping(true)
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      })
      const data = await res.json()
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
      const botMessage: Message = { role: "bot", content: reply }
      setMessages((prev) => [...prev, botMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Failed to fetch response." },
      ])
    } finally {
      setIsBotTyping(false)
      setInput("")
    }
  }

  function handleClear() {
    setMessages([])
  }

  function formatBotMessage(content: string) {
    // Basic formatting: paragraphs and line breaks
    return content.split("\n\n").map((para, idx) => (
      <p
        key={idx}
        className="mb-2 last:mb-0 whitespace-pre-line"
      >
        {para}
      </p>
    ))
  }

  return (
    <div className="bg-white text-black min-h-screen flex flex-col pb-14">
      <header className="w-full px-4 py-6 border-b border-muted bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">MedX Chatbot</h1>
            <p className="text-muted-foreground text-sm">
              How can I help you today?
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-between w-full">
        <ScrollArea className="w-full max-w-3xl flex-1 px-4 py-6 space-y-2 bg-muted/40 rounded-lg mt-4 mb-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
              <Bot className="w-12 h-12 mb-2" />
              <span>Start the conversation!</span>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end mb-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="flex-shrink-0 mr-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Bot className="w-5 h-5 text-primary" />
                  </span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-secondary text-black dark:text-white rounded-bl-none"
                }`}
              >
                {msg.role === "bot"
                  ? formatBotMessage(msg.content)
                  : msg.content}
              </motion.div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 ml-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                    {/* Optionally use a user icon here */}
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                </div>
              )}
            </div>
          ))}
          {isBotTyping && (
            <div className="flex items-end mb-2 justify-start">
              <div className="flex-shrink-0 mr-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Bot className="w-5 h-5 text-primary" />
                </span>
              </div>
              <div className="bg-secondary text-black dark:text-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm text-sm animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </ScrollArea>
        <div className="w-full max-w-3xl px-4 pb-6 sticky bottom-0 bg-background/80 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isBotTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={isBotTyping || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleClear}
              variant="ghost"
              size="icon"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            MedX Chatbot may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </main>
      <BottomNavigation activeItem="chat" />
    </div>
  )
}

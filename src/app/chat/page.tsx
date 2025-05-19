"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Send, MessageSquare } from "lucide-react"
import ChatHeader from "../../components/chat_ui/ChatHeader"
import ChatBubble from "../../components/chat_ui/ChatBubble"
import WelcomeMessage from "../../components/chat_ui/WelcomeMessage"
import BottomNavigation from "@/components/navbar"

interface Message {
  role: "user" | "bot"
  content: string
}

const SYSTEM_MESSAGE = `You are MedX, a medical assistant chatbot designed to provide helpful, accurate, and safe medical information. Follow these guidelines:

1. Provide evidence-based medical information
2. Always emphasize that you're an AI assistant and not a replacement for professional medical advice
3. Be clear about limitations and uncertainties
4. Encourage users to consult healthcare professionals for specific medical concerns
5. Maintain a professional, empathetic, and supportive tone
6. Focus on general health information and education
7. Avoid making definitive diagnoses or treatment recommendations
8. Prioritize user safety and well-being in all responses

Remember: Your primary goal is to provide helpful medical information while ensuring users understand the importance of professional medical consultation.`

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isBotTyping, setIsBotTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollHeight = scrollAreaRef.current.scrollHeight
      scrollAreaRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isBotTyping])

  async function handleSend() {
    if (!input.trim()) return
    setIsBotTyping(true)
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          systemMessage: SYSTEM_MESSAGE,
        }),
      })
      const data = await res.json()
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
      const botMessage: Message = { role: "bot", content: reply }
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        botMessage,
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="flex-none">
        <ChatHeader />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-3 py-4">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-4 pb-6">
              {messages.map((msg, idx) => (
                <ChatBubble
                  key={idx}
                  message={msg}
                  isLastMessage={idx === messages.length - 1}
                />
              ))}

              {isBotTyping && (
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 border border-purple-100 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-purple-300-300 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Bottom Section */}
      <div className="flex-none flex flex-col">
        {/* Input Area */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200">
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 max-w-lg mx-auto">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                disabled={isBotTyping}
                className="flex-1 rounded-lg px-4 py-2 border-gray-400 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 shadow-xl"
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isBotTyping || !input.trim()}
                className="shrink-0 rounded-full h-10 w-10 bg-purple-500 hover:bg-purple-600 shadow-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleClear}
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-lg border-2 border-gray-500 h-10 w-10 hover:bg-gray-100 shadow-xl"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              MedX provides general information only, not medical advice. Always
              consult a healthcare professional.
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-21">
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}

export default ChatContainer

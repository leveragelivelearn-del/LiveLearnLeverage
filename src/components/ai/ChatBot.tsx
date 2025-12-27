'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { getChatResponse, ChatMessage } from '../services/geminiService'
import { useChat } from '@/components/providers/ChatProvider'
import Image from 'next/image'

export function ChatBot() {
  const { isOpen, setIsOpen } = useChat();  // Use global state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: "Hi! I'm Gamaelle Charles AI assistant for Live Learn Leverage. How can I help you regarding M&A or financial modeling today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message
    const newHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: userMessage }
    ]
    setMessages(newHistory)
    setIsLoading(true)

    try {
      const responseText = await getChatResponse(userMessage, messages)

      setMessages(prev => [...prev, { role: 'model', parts: responseText }])
    } catch (error: any) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'model', parts: `Error: ${error.message || 'Something went wrong'}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-4 z-50 w-[350px] sm:w-[400px] shadow-2xl"
        >
          <Card className="border-primary/20 bg-background/95 backdrop-blur-md h-[500px] flex flex-col overflow-hidden ring-1 ring-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/20">
                    <Image
                      src="/assets/gamaelle-charles.png"
                      alt="Gamaelle Charles"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="text-sm font-medium">Gamaelle's AI Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin touch-auto"
              data-lenis-prevent
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 text-sm",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border overflow-hidden relative",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-muted"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Image
                        src="/assets/gamaelle-charles.png"
                        alt="Gamaelle"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%]",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {msg.parts}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 text-sm">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-muted text-muted-foreground border-muted overflow-hidden relative">
                    <Image
                      src="/assets/gamaelle-charles.png"
                      alt="Gamaelle"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-muted px-3 py-2 rounded-lg flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="p-4 border-t border-primary/10 bg-muted/20">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  placeholder="Ask about M&A..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 focus-visible:ring-primary/20"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </motion.div>
      )}
      <motion.button
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed bottom-14 right-2 md:bottom-20 md:right-6 z-50 h-8 w-8 md:h-12 md:w-12 rounded-full shadow-xl flex items-center justify-center",
          "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-2xl hover:brightness-110 transition-all"
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/20">
          <Image
            src="/assets/gamaelle-charles.png"
            alt="Gamaelle Charles"
            fill
            className="object-cover"
          />
        </div>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </motion.button>
    </AnimatePresence>
  )
}

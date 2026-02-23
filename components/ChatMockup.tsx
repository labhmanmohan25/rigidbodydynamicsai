"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const USER_MSG = "Turn this 2D drawing into a 3D model";
const BOT_MSG = "Done. I used the front and side views to build the 3D model. You can download it or open it in your CAD tool.";

export default function ChatMockup() {
  const [showUser, setShowUser] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showBot, setShowBot] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowUser(true), 800);
    const t2 = setTimeout(() => setShowTyping(true), 1600);
    const t3 = setTimeout(() => {
      setShowTyping(false);
      setShowBot(true);
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-card/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
          </div>
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            Chat
          </span>
        </div>

        {/* Messages */}
        <div className="flex min-h-[200px] flex-col gap-4 p-4">
          {showUser && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent/20 px-4 py-2.5 text-sm text-foreground">
                {USER_MSG}
              </div>
            </motion.div>
          )}

          {showTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <span className="text-xs font-medium">AI</span>
              </div>
              <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-muted/50 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </motion.div>
          )}

          {showBot && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                <span className="text-xs font-medium">AI</span>
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground">
                {BOT_MSG}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input area (static) */}
        <div className="border-t border-border px-4 py-3">
          <div className="rounded-xl border border-border bg-background/50 py-2.5 px-3 text-sm text-muted-foreground">
            Type a message...
          </div>
        </div>
      </div>
    </motion.div>
  );
}

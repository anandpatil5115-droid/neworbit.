"use client"

import { useEffect, useState } from "react"

export function FloatingCodeBg() {
  const [snippets, setSnippets] = useState<{ id: number; text: string; left: string; top: string; fontSize: string; animationDuration: string; animationDelay: string }[]>([])

  useEffect(() => {
    const rawSnippets = [
      "const learn = () => {}",
      "import React from 'react'",
      "SELECT * FROM knowledge",
      "git commit -m 'keep going'",
      "npm install success",
      "function study() { return true }",
      "while(learning) { grow() }",
      "export default Developer",
      "console.log('never stop')",
      "const skills = [...existing, ...new]",
    ]

    const mapped = rawSnippets.map((text, i) => ({
      id: i,
      text,
      left: `${Math.random() * 85 + 5}%`,
      top: `${Math.random() * 80 + 20}%`,
      fontSize: `${Math.random() * 0.9 + 0.9}rem`,
      animationDuration: `${Math.random() * 10 + 12}s`,
      animationDelay: `${i * 2}s`
    }))

    setSnippets(mapped)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes float-up {
          0%   { transform: translateY(0);      opacity: 0;    }
          8%   { opacity: 0.045; }
          92%  { opacity: 0.045; }
          100% { transform: translateY(-110vh); opacity: 0;    }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {snippets.map((snippet) => (
          <span
            key={snippet.id}
            className="absolute font-mono text-white opacity-0 whitespace-nowrap"
            style={{
              left: snippet.left,
              top: snippet.top,
              fontSize: snippet.fontSize,
              animation: `float-up ${snippet.animationDuration} linear infinite`,
              animationDelay: snippet.animationDelay,
            }}
          >
            {snippet.text}
          </span>
        ))}
      </div>
    </>
  )
}

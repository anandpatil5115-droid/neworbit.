"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // NODES — glowing dots connected by lines
    const NODE_COUNT = 80
    const nodes: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
    }[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const CONNECTION_DISTANCE = 140
    const INDIGO = '99, 102, 241'
    const VIOLET = '139, 92, 246'
    const CYAN = '34, 211, 238'

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15
            // Alternate line colors
            const color = i % 3 === 0 ? INDIGO : i % 3 === 1 ? VIOLET : CYAN
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(${color}, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        const color = i % 3 === 0 ? INDIGO : i % 3 === 1 ? VIOLET : CYAN

        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 6
        )
        gradient.addColorStop(0, `rgba(${color}, ${node.opacity * 0.8})`)
        gradient.addColorStop(1, `rgba(${color}, 0)`)
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${node.opacity})`
        ctx.fill()

        // Move
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {/* Deep dark base */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, 
              rgba(99,102,241,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, 
              rgba(139,92,246,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, 
              rgba(34,211,238,0.04) 0%, transparent 50%),
            #080810
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top radial glow */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '400px',
          zIndex: 2,
          pointerEvents: 'none',
          background: `radial-gradient(
            ellipse at 50% 0%,
            rgba(99,102,241,0.10),
            transparent 70%
          )`,
        }}
      />
    </>
  )
}

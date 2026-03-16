"use client"

import { type ReactNode } from "react"

interface GlowingShadowProps {
  children: ReactNode
  hueSpeed?: number
  animationSpeed?: string
}

export function GlowingShadow({ 
  children, 
  hueSpeed = 1,
  animationSpeed = "4s" 
}: GlowingShadowProps) {
  return (
    <>
      <style jsx>{`
        @property --hue {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --rotate {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --bg-y {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --bg-x {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --glow-translate-y {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --bg-size {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --glow-opacity {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --glow-blur {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --glow-scale {
          syntax: "<number>";
          inherits: true;
          initial-value: 2;
        }
        @property --glow-radius {
          syntax: "<number>";
          inherits: true;
          initial-value: 2;
        }
        @property --white-shadow {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }

        .glow-container {
          --card-color: hsl(260deg 100% 3%);
          --card-radius: 16px;
          --card-width: 100%;
          --border-width: 2px;
          --bg-size: 1;
          --hue: 0;
          --hue-speed: ${hueSpeed};
          --rotate: 0;
          --animation-speed: ${animationSpeed};
          --interaction-speed: 0.55s;
          --glow-scale: 1.5;
          --scale-factor: 1;
          --glow-blur: 6;
          --glow-opacity: 1;
          --glow-radius: 100;
          --glow-rotate-unit: 1deg;

          width: 100%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          border-radius: var(--card-radius);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .glow-container:hover {
          transform: translateY(-6px);
        }

        .glow-container:before,
        .glow-container:after {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: var(--card-radius);
        }

        .glow-content {
          position: relative;
          width: 100%;
          background: var(--card-color);
          border-radius: calc(var(--card-radius) * 0.9);
          display: flex;
          flex-direction: column;
          padding: 24px;
          min-height: 200px;
        }

        .glow-content:before {
          content: "";
          display: block;
          position: absolute;
          inset: calc(-1 * var(--border-width));
          border-radius: var(--card-radius);
          box-shadow: 0 0 20px black;
          mix-blend-mode: color-burn;
          z-index: -1;
          background: hsl(0deg 0% 16%) radial-gradient(
            30% 30% at calc(var(--bg-x) * 1%) calc(var(--bg-y) * 1%),
            hsl(calc(var(--hue) * var(--hue-speed) * 1deg) 100% 90%) 0%,
            hsl(calc(var(--hue) * var(--hue-speed) * 1deg) 100% 80%) 20%,
            hsl(calc(var(--hue) * var(--hue-speed) * 1deg) 100% 60%) 40%,
            transparent 100%
          );
          animation: hue-animation var(--animation-speed) linear infinite,
                     rotate-bg var(--animation-speed) linear infinite;
          transition: --bg-size var(--interaction-speed) ease;
        }

        .glow {
          --glow-translate-y: 0;
          display: block;
          position: absolute;
          width: 60px;
          height: 60px;
          animation: rotate var(--animation-speed) linear infinite;
          transform: rotateZ(calc(var(--rotate) * var(--glow-rotate-unit)));
          transform-origin: center;
          border-radius: calc(var(--glow-radius) * 10vw);
          pointer-events: none;
        }

        .glow:after {
          content: "";
          display: block;
          z-index: -2;
          filter: blur(calc(var(--glow-blur) * 10px));
          width: 130%;
          height: 130%;
          left: -15%;
          top: -15%;
          background: hsl(calc(var(--hue) * var(--hue-speed) * 1deg) 100% 60%);
          position: relative;
          border-radius: calc(var(--glow-radius) * 10vw);
          animation: hue-animation var(--animation-speed) linear infinite;
          transform: scaleY(calc(var(--glow-scale) * var(--scale-factor) / 1.1))
                     scaleX(calc(var(--glow-scale) * var(--scale-factor) * 1.2))
                     translateY(calc(var(--glow-translate-y) * 1%));
          opacity: var(--glow-opacity);
        }

        .glow-container:hover .glow-content {
          mix-blend-mode: darken;
          box-shadow: 0 0 calc(var(--white-shadow) * 1vw) 
                      calc(var(--white-shadow) * 0.15vw) 
                      rgb(255 255 255 / 20%);
          animation: shadow-pulse calc(var(--animation-speed) * 2) 
                     linear infinite;
        }

        .glow-container:hover .glow-content:before {
          --bg-size: 15;
          animation-play-state: paused;
          transition: --bg-size var(--interaction-speed) ease;
        }

        .glow-container:hover .glow {
          --glow-blur: 1.5;
          --glow-opacity: 0.6;
          --glow-scale: 2.5;
          --glow-radius: 0;
          --rotate: 900;
          --glow-rotate-unit: 0;
          --scale-factor: 1.25;
          animation-play-state: paused;
        }

        .glow-container:hover .glow:after {
          --glow-translate-y: 0;
          animation-play-state: paused;
        }

        @keyframes shadow-pulse {
          0%, 24%, 46%, 73%, 96% { --white-shadow: 0.5; }
          12%, 28%, 41%, 63%, 75%, 82%, 98% { --white-shadow: 2.5; }
          6%, 32%, 57% { --white-shadow: 1.3; }
          18%, 52%, 88% { --white-shadow: 3.5; }
        }

        @keyframes rotate-bg {
          0%   { --bg-x: 0;   --bg-y: 0;   }
          25%  { --bg-x: 100; --bg-y: 0;   }
          50%  { --bg-x: 100; --bg-y: 100; }
          75%  { --bg-x: 0;   --bg-y: 100; }
          100% { --bg-x: 0;   --bg-y: 0;   }
        }

        @keyframes rotate {
          from { --rotate: -70;            --glow-translate-y: -65; }
          to   { --rotate: calc(360 - 70); --glow-translate-y: -65; }
        }

        @keyframes hue-animation {
          0%   { --hue: 0;   }
          100% { --hue: 360; }
        }
      `}</style>

      <div className="glow-container">
        <span className="glow"></span>
        <div className="glow-content">{children}</div>
      </div>
    </>
  )
}

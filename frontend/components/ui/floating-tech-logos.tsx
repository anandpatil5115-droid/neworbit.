'use client';

import { useMemo } from 'react';

const techLogos = [
  { name: 'TS', color: '#3178C6', shape: 'square', anim: 'float-1', dur: 2.0 },
  { name: 'React', color: '#61DAFB', shape: 'circle', anim: 'float-2', dur: 2.5 },
  { name: 'N', color: '#000000', text: '#FFFFFF', shape: 'circle', anim: 'float-3', dur: 3.0 },
  { name: 'CSS', color: '#1572B6', shape: 'shield', anim: 'float-4', dur: 2.2 },
  { name: 'HTML', color: '#E34F26', shape: 'shield', anim: 'float-5', dur: 3.5 },
  { name: 'JS', color: '#F7DF1E', text: '#000000', shape: 'square', anim: 'float-6', dur: 2.8 },
  { name: 'Git', color: '#F05032', shape: 'diamond', anim: 'float-7', dur: 2.3 },
  { name: 'TW', color: '#06B6D4', shape: 'circle', anim: 'float-8', dur: 4.0 },
  { name: 'Fg', color: '#F24E1E', shape: 'circle', anim: 'float-9', dur: 2.6 },
  { name: 'Node', color: '#339933', shape: 'hexagon', anim: 'float-10', dur: 3.2 },
  { name: 'Py', color: '#3776AB', shape: 'square', anim: 'float-11', dur: 2.1 },
  { name: 'Docker', color: '#2496ED', shape: 'square', anim: 'float-12', dur: 4.5 },
];

export function FloatingTechLogos() {
  const logos = useMemo(() => {
    return techLogos.map((tech, i) => {
      const left = 10 + Math.random() * 70; // 10% to 80%
      const top = 10 + Math.random() * 70;  // 10% to 80%
      const delay = i * 0.7;
      const size = 40 + Math.random() * 25; // 40px to 65px

      return {
        ...tech,
        left: `${left}%`,
        top: `${top}%`,
        animation: `${tech.anim} ${tech.dur}s ease-in-out infinite alternate`,
        animationDelay: `${delay}s`,
        size: `${size}px`,
      };
    });
  }, []);

  return (
    <div className="hidden md:flex flex-col relative w-full h-full bg-[#0f0f0f] overflow-hidden items-center justify-center">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-1 {
          0%   { transform: translate(0px, 0px)    rotate(-8deg);  }
          50%  { transform: translate(55px, -70px) rotate(10deg);  }
          100% { transform: translate(-40px, 40px) rotate(-5deg);  }
        }
        @keyframes float-2 {
          0%   { transform: translate(0px, 0px)    rotate(5deg);   }
          50%  { transform: translate(-65px, 50px) rotate(-12deg); }
          100% { transform: translate(35px, -55px) rotate(8deg);   }
        }
        @keyframes float-3 {
          0%   { transform: translate(0px, 0px)     rotate(-3deg); }
          50%  { transform: translate(70px, 60px)   rotate(15deg); }
          100% { transform: translate(-50px, -40px) rotate(-8deg); }
        }
        @keyframes float-4 {
          0%   { transform: translate(0px, 0px)    rotate(10deg);  }
          50%  { transform: translate(-45px, -65px) rotate(-8deg); }
          100% { transform: translate(60px, 35px)  rotate(12deg);  }
        }
        @keyframes float-5 {
          0%   { transform: translate(0px, 0px)   rotate(-6deg);  }
          50%  { transform: translate(50px, 70px) rotate(10deg);  }
          100% { transform: translate(-60px, -45px) rotate(-12deg); }
        }
        @keyframes float-6 {
          0%   { transform: translate(0px, 0px)    rotate(8deg);  }
          50%  { transform: translate(-70px, 40px) rotate(-10deg);}
          100% { transform: translate(40px, -60px) rotate(5deg);  }
        }
        @keyframes float-7 {
          0%   { transform: translate(0px, 0px)    rotate(-10deg); }
          50%  { transform: translate(65px, -50px) rotate(8deg);   }
          100% { transform: translate(-35px, 65px) rotate(-6deg);  }
        }
        @keyframes float-8 {
          0%   { transform: translate(0px, 0px)     rotate(4deg);  }
          50%  { transform: translate(-55px, -70px) rotate(-14deg);}
          100% { transform: translate(45px, 50px)   rotate(10deg); }
        }
        @keyframes float-9 {
          0%   { transform: translate(0px, 0px)   rotate(-7deg);  }
          50%  { transform: translate(75px, 45px) rotate(12deg);  }
          100% { transform: translate(-40px, -60px) rotate(-9deg);}
        }
        @keyframes float-10 {
          0%   { transform: translate(0px, 0px)    rotate(6deg);   }
          50%  { transform: translate(-60px, 55px) rotate(-11deg); }
          100% { transform: translate(50px, -45px) rotate(7deg);   }
        }
        @keyframes float-11 {
          0%   { transform: translate(0px, 0px)     rotate(-5deg); }
          50%  { transform: translate(45px, -75px)  rotate(9deg);  }
          100% { transform: translate(-65px, 30px)  rotate(-11deg);}
        }
        @keyframes float-12 {
          0%   { transform: translate(0px, 0px)    rotate(11deg);  }
          50%  { transform: translate(-50px, -50px) rotate(-7deg); }
          100% { transform: translate(60px, 65px)  rotate(9deg);   }
        }
      `}} />

      {logos.map((logo, i) => {
        let radius = '8px';
        if (logo.shape === 'circle') radius = '50%';
        if (logo.shape === 'shield') radius = '12px 12px 24px 24px';
        if (logo.shape === 'diamond') radius = '4px';

        const transformStyle = logo.shape === 'diamond' ? 'rotate(45deg)' : 'none';
        const innerTransformStyle = logo.shape === 'diamond' ? 'rotate(-45deg)' : 'none';

        return (
          <div
            key={i}
            className="absolute flex items-center justify-center font-bold shadow-lg"
            style={{
              left: logo.left,
              top: logo.top,
              width: logo.size,
              height: logo.size,
              backgroundColor: logo.color,
              color: logo.text || '#ffffff',
              borderRadius: radius,
              animation: logo.animation,
              animationDelay: logo.animationDelay,
              willChange: 'transform',
              fontSize: `calc(${logo.size} * 0.4)`,
              transform: transformStyle,
              boxShadow: `0 10px 25px -5px ${logo.color}66`
            }}
          >
            <span style={{ transform: innerTransformStyle }}>{logo.name}</span>
          </div>
        );
      })}
    </div>
  );
}

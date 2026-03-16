export default function AuthBackground() {
  const snippets = [
    "const learn = () => {};",
    "import React from 'react'",
    "SELECT * FROM knowledge",
    "git commit -m \"keep going\"",
    "while(true) { improve(); }",
    "<Provider theme=\"dark\">",
    "export const App = () => {}"
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-transparent flex flex-col justify-around gap-12 pt-20">
        {snippets.map((code, i) => (
          <div 
            key={i} 
            className="text-white/5 font-mono text-4xl md:text-5xl lg:text-6xl whitespace-nowrap animate-float"
            style={{
              animation: `float-up ${15 + (i * 5)}s linear infinite`,
              marginLeft: `${(i % 3) * 15}%`
            }}
          >
            {code}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-up {
          from { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to { transform: translateY(-50vh); opacity: 0; }
        }
      `}} />
    </div>
  );
}

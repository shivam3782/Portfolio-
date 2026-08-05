const skillCategories = [
  { label: "LANGUAGES", items: ["Python", "JavaScript", "C++", "HTML", "CSS"] },
  { label: "FRONTEND", items: ["React.js", "Flutter", "Tailwind CSS"] },
  { label: "BACKEND", items: ["Node.js", "Express.js", "Flask", "REST APIs"] },
  { label: "DATABASES", items: ["MongoDB", "MySQL", "Firebase", "SQLite"] },
  {
    label: "ML / AI",
    items: ["Scikit-learn", "Pandas", "NumPy", "Generative AI", "LLMs"],
  },
  { label: "TOOLS", items: ["Docker", "Git", "GitHub", "Ubuntu"] },
];

function StatsPanel() {
  return (
    <div className="min-h-screen p-8">
      <h2 className="font-pixel text-[#e8935a] text-xl mb-8">
        STATS &amp; EQUIPMENT
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat) => (
          <div
            key={cat.label}
            className="bg-[#2d2547] border-2 border-[#e8935a] rounded-lg p-5"
          >
            <h3 className="font-pixel text-xs text-[#5fb8a8] mb-4">
              {cat.label}
            </h3>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[#f4f4f0] text-sm"
                >
                  <span className="text-[#e8935a]">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsPanel;

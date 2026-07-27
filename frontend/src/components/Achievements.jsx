const achievements = [
  { title: "Zscaler Zero Trust Associate (ZTCA)", issuer: "Zscaler" },
  { title: "Google AI-ML Virtual Internship", issuer: "AICTE" },
  { title: "AWS Data Engineering Virtual Internship", issuer: "AICTE" },
  { title: "Data Analysis with Python", issuer: "IBM" },
  { title: "Database Management System", issuer: "NPTEL, IIT Kharagpur" },
  { title: "Programming Essentials in C++", issuer: "Cisco" },
];

function Achievements() {
  return (
    <div className="min-h-screen bg-[#1a1435] p-8">
      <h2 className="font-pixel text-[#e8935a] text-xl mb-8">
        ACHIEVEMENTS UNLOCKED
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a) => (
          <div
            key={a.title}
            className="bg-[#2d2547] border-2 border-[#e8935a] rounded-lg p-4 flex items-start gap-3"
          >
            <span className="text-[#e8935a] text-xl">🏆</span>
            <div>
              <p className="text-[#f4e8c1] text-sm font-semibold">{a.title}</p>
              <p className="text-[#5fb8a8] text-xs mt-1">{a.issuer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;

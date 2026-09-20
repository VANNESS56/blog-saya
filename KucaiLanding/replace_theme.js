const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'admin', 'AdminDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Backgrounds
  { from: /bg-\[#d1d5db\]/g, to: "bg-[#0c0805]" }, // main bg
  { from: /bg-white/g, to: "bg-[#140e0b]" },
  { from: /bg-gray-50/g, to: "bg-[#0c0805]" },
  { from: /bg-gray-100/g, to: "bg-[#1a120e]" },
  { from: /bg-blue-50/g, to: "bg-amber-500/10" },
  { from: /bg-blue-100/g, to: "bg-amber-900/40" },
  { from: /bg-blue-600/g, to: "bg-amber-600" },
  { from: /hover:bg-blue-700/g, to: "hover:bg-amber-700" },
  
  // Text Colors
  { from: /text-gray-800/g, to: "text-white/90" },
  { from: /text-gray-700/g, to: "text-white/80" },
  { from: /text-gray-600/g, to: "text-white/70" },
  { from: /text-gray-500/g, to: "text-white/50" },
  { from: /text-blue-600/g, to: "text-amber-500" },
  { from: /text-blue-500/g, to: "text-amber-400" },
  
  // Borders
  { from: /border-gray-200/g, to: "border-amber-900/30" },
  { from: /border-gray-100/g, to: "border-amber-900/20" },
  { from: /border-gray-300/g, to: "border-amber-900/50" },
  { from: /border-blue-200/g, to: "border-amber-500/30" },
  { from: /border-blue-500/g, to: "border-amber-500" },
  { from: /focus:border-blue-500/g, to: "focus:border-amber-500" },
  { from: /ring-blue-500/g, to: "ring-amber-500" },
  { from: /focus:ring-blue-500/g, to: "focus:ring-amber-500" },

  // Hover states
  { from: /hover:bg-gray-50/g, to: "hover:bg-white/5" },
  { from: /hover:text-blue-600/g, to: "hover:text-amber-500" },
  
  // Specific tweaks
  { from: /shadow-sm/g, to: "shadow-[0_4px_20px_rgba(0,0,0,0.3)]" },
  { from: /shadow-md/g, to: "shadow-[0_8px_30px_rgba(0,0,0,0.4)]" },
  { from: /text-blue-100/g, to: "text-amber-100" },
  { from: /text-blue-200/g, to: "text-amber-200" }
];

for (const rep of replacements) {
  content = content.replace(rep.from, rep.to);
}

// Special case: inputs/textarea/select
// In admin they often have bg-white (which is now bg-[#140e0b]), but maybe inputs should be slightly lighter or darker.
// It's mostly fine as bg-[#140e0b] for inputs. Let's fix table striped colors if any.
// In dark mode, even /odd rows:
content = content.replace(/bg-gray-50/g, "bg-white/5");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Theme replacement done.");

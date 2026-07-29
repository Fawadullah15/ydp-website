const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-gray-900',
  'text-gray-900': 'text-white',
  'text-gray-800': 'text-gray-200',
  'text-gray-700': 'text-gray-300',
  'text-gray-600': 'text-gray-400',
  'text-gray-500': 'text-gray-400',
  'border-gray-200': 'border-gray-800',
  'border-gray-300': 'border-gray-700',
  'border-gray-100': 'border-gray-800',
  'bg-gray-50': 'bg-gray-800',
  'bg-gray-100': 'bg-gray-800',
  'bg-gray-200': 'bg-gray-800',
  'bg-[#1B2A6B]': 'bg-blue-600',
  'hover:bg-[#1B2A6B]/90': 'hover:bg-blue-700',
  'hover:bg-gray-50': 'hover:bg-gray-800',
  'hover:bg-gray-100': 'hover:bg-gray-800',
  'focus:border-[#1B2A6B]': 'focus:border-blue-500',
  'focus:ring-[#1B2A6B]': 'focus:ring-blue-500/20',
  'focus:ring-[#00BCD4]': 'focus:ring-blue-500/20',
  'text-[#1B2A6B]': 'text-blue-400',
  'border-[#1B2A6B]': 'border-blue-400',
  'text-[#00BCD4]': 'text-cyan-400',
};

const regex = new RegExp(Object.keys(replacements).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf-8');
      const newContent = content.replace(regex, match => replacements[match]);
      if (content !== newContent) {
        fs.writeFileSync(p, newContent, 'utf-8');
        console.log('Updated ' + p);
      }
    }
  }
}

walk(path.join(__dirname, 'app/admin/events'));
walk(path.join(__dirname, 'app/admin/news'));
walk(path.join(__dirname, 'app/admin/members/[id]'));
walk(path.join(__dirname, 'app/admin/settings'));

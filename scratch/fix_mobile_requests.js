const fs = require('fs');
const file = 'src/app/(dashboard)/requests/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix header
content = content.replace(
  '<div className="flex items-start justify-between">',
  '<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">'
);

content = content.replace(
  '<button className="h-11 rounded-full bg-[var(--forest)] px-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90 ">',
  '<button className="h-11 rounded-full bg-[var(--forest)] px-6 text-[14px] font-medium text-[var(--canvas)] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0">'
);

// Fix Filters Group spacing
content = content.replace(
  'mb-2 w-full',
  'w-full'
);

content = content.replace(
  'w-full pb-2',
  'w-full'
);

content = content.replace(
  'gap-4 pb-4',
  'gap-3 pb-2'
);

content = content.replace(
  '{/* Filter Pill */}',
  '{/* Filters Group */}\n  <div className="space-y-3">\n  {/* Filter Pill */}'
);

content = content.replace(
  'onChange={setStatusFilter} />\n  </div>',
  'onChange={setStatusFilter} />\n  </div>\n  </div>'
);

fs.writeFileSync(file, content);
console.log('Fixed!');

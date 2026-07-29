import React from 'react';

export function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  // Placeholder for TipTap editor implementation
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2 flex-wrap">
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm font-bold">B</button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm italic">I</button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm underline">U</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm">H1</button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm">H2</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm">List</button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-sm">Link</button>
      </div>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[300px] p-4 focus:outline-none resize-y"
        placeholder="Start writing..."
      />
    </div>
  );
}

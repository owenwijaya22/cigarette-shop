interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({ text = 'OR', className = '' }: DividerProps) {
  return (
    <div className={`flex items-center justify-between my-4 ${className}`}>
      <hr className="w-full border-t border-neutral-600" />
      {text && <span className="px-3 text-neutral-400 text-sm">{text}</span>}
      <hr className="w-full border-t border-neutral-600" />
    </div>
  );
} 
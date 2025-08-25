"use client";

interface Props {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function AnswerOption({ label, checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-white">
      <input
        checked={checked}
        className="w-4 h-4 text-blue-600"
        type="radio"
        onChange={onChange}
      />
      <span className="text-gray-800 dark:text-white">{label}</span>
    </label>
  );
}

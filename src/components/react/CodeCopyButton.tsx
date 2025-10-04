import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeCopyButtonProps {
  code: string;
}

export const CodeCopyButton: React.FC<CodeCopyButtonProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-md border border-gray-600 px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 ${
        copied
          ? "border-green-500 bg-green-600 text-white shadow-lg shadow-green-500/25"
          : "bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700 hover:text-white"
      } `}
      title={copied ? "Copied!" : "Copy code"}
    >
      <div className="relative">
        {copied ? (
          <Check size={12} className="animate-in zoom-in-50 duration-200" />
        ) : (
          <Copy size={12} className="transition-transform duration-200" />
        )}
      </div>
      <span className="transition-all duration-200">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
};

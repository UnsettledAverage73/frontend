import * as React from "react";

const Switch = React.forwardRef(({ checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      ref={ref}
      onClick={() => onCheckedChange(!checked)}
      aria-checked={checked}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        transition-colors duration-200
      `}
      {...props}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };
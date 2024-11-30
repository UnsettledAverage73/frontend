import * as React from "react";

const AlertDialog = ({ children }) => {
  return <>{children}</>;
};

const AlertDialogTrigger = ({ asChild, children }) => {
  return asChild ? children : <button>{children}</button>;
};

const AlertDialogContent = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const AlertDialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const AlertDialogFooter = ({ children }) => {
  return <div className="flex justify-end space-x-2 mt-4">{children}</div>;
};

const AlertDialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

const AlertDialogDescription = ({ children }) => {
  return <p className="text-gray-600 mt-2">{children}</p>;
};

const AlertDialogAction = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

const AlertDialogCancel = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
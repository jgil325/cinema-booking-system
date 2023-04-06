const Alert = ({ message }) => {
  return (
    <div className="border-l-2 border-blue-500 bg-blue-200 bg-opacity-50 py-3 shadow-sm">
      {message}
    </div>
  );
};

export const ErrorAlert = ({ message }) => {
  return (
    <div className="border-l-2 border-red-500 bg-red-200 bg-opacity-50 py-3 shadow-sm">
      {message}
    </div>
  );
};

export default Alert;

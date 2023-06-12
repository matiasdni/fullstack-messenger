export const Tooltip = ({ label, children }) => {
  return (
    <div className="tooltip tooltip-left delay-1000" data-tip={label}>
      {children}
    </div>
  );
};

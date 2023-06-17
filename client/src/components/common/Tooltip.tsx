import clsx from "clsx";

interface TooltipProps {
  label: string;
  orientation?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}

const Tooltip = ({ label, orientation, children }: TooltipProps) => {
  return (
    <div
      className={clsx(
        { tooltip: !orientation },
        { [`tooltip tooltip-${orientation}`]: orientation }
      )}
      data-tip={label}
    >
      {children}
    </div>
  );
};

export default Tooltip;

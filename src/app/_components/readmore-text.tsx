import { useState, useRef, useEffect } from "react";
import { Typography } from "./mtw-wrappers";

const notExpandedStyle = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
} as React.CSSProperties;

const expandedStyle = {
  overflow: "visible",
  whiteSpace: "normal",
  height: "auto",
} as React.CSSProperties;

interface ReadMoreTextProps {
  children: React.ReactNode;
  className?: string;
}

const getIsOverflowing = (element: HTMLElement) => {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth ||
    element.offsetHeight < element.scrollHeight ||
    element.offsetWidth < element.scrollWidth
  );
};

export const ReadMoreText = ({
  children,
  className = "",
}: ReadMoreTextProps): JSX.Element => {
  const [isExpanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(getIsOverflowing(textRef.current));
      }
    };
    handleOverflow();
    window.addEventListener("resize", handleOverflow);
    return () => window.removeEventListener("resize", handleOverflow);
  }, []);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      <Typography
        ref={textRef}
        className={className}
        onClick={handleToggleExpand}
        style={isExpanded ? expandedStyle : notExpandedStyle}
      >
        {children}
      </Typography>
      {isOverflowing && (
        <Typography
          color="blue"
          className="cursor-pointer select-none text-left underline"
          onClick={handleToggleExpand}
        >
          {isExpanded ? "Close" : "Read more"}
        </Typography>
      )}
    </div>
  );
};

import type { LucideProps } from "lucide-react";

export const BrushStroke: React.FC<LucideProps> = ({ className, ...props }) => (
  <svg
    // spread props so className, style, onClick, etc. work
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 100 100"
    fill="currentColor" // so it inherits text color unless overridden
    className={`lucide lucide-brush-stroke-icon lucide-brush-stroke ${className}`}
    {...props}
  >
    <path d="M85.1,30c-1.9,0.9-3.8,1.8-5.7,2.8c2.8-3.4,1.3-8.7-2.5-10.6c3.4-2.5,6.8-5,10-7.8c5-4.4-0.3-13.9-6.7-11.5    c-21.8,8.2-43.7,16.4-62.6,30.2c-7.1,5.2-0.2,17.1,6.9,11.9c0.8-0.6,1.7-1.1,2.5-1.7c1,1.3,2.3,2.4,4,2.8    c-5.3,3.1-10.4,6.5-15.4,10.3c-6.8,5.2-0.8,16.6,6.9,11.9c0.4-0.2,0.8-0.5,1.2-0.7c-6.4,6-12.4,12.6-17.8,19.6    c-4.2,5.4,4,13.3,9.4,9.4c3.6-2.6,7.2-5.1,10.8-7.7c0.5,4.6,5.1,8.7,9.9,5.4c16.8-11.7,33.9-22.6,52.6-31    c8.1-3.6,1.1-15.4-6.9-11.9c-3,1.3-5.9,2.7-8.8,4.2C79.2,51,85.6,46.4,92,41.9C99.3,36.7,93.2,26.2,85.1,30z"/>
    </svg>
);

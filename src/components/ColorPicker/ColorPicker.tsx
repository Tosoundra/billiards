import './ColorPicker.css';
import { ChangeEvent, forwardRef, useEffect, useState } from 'react';

interface Props {
  onChange: (color: string) => void;
  color: string;
}

export const ColorPicker = forwardRef<HTMLDivElement, Props>(({ onChange, color }, ref) => {
  const [currentColor, setCurrentColor] = useState('');
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
    onChange(e.target.value);
  };

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  return (
    <div
      className="picker-container"
      onClick={() => {
        if ('current' in ref! && ref.current) {
          const lastChild = ref.current.lastChild as HTMLInputElement;
          lastChild.click();
        }
      }}
      ref={ref}
      style={{
        backgroundColor: currentColor,
      }}>
      <input
        style={{ visibility: 'hidden' }}
        value={currentColor}
        type="color"
        onChange={handleColorChange}
      />
    </div>
  );
});

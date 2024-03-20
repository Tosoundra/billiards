import { useEffect, useRef, useState } from 'react';
import { arrayOfBalls } from '../../constants/arrayOfBalls';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import './App.css';
const prevMousePos = { x: 0, y: 0 };

const getCoordinates = (event: MouseEvent, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  return { mouseX, mouseY, rect };
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState(arrayOfBalls);
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [selectedBallColor, setSelectedBallColor] = useState<string | null>(null);
  const [clickInsideBall, setClickInsideBall] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isAlternativeMode, setIsAlternativeMode] = useState(false);

  const applyColorToSelectedBall = (color: string) => {
    const updatedBalls = balls.map((ball, index) =>
      index === selectedBall ? { ...ball, color: color } : ball,
    );
    setBalls(updatedBalls);
  };

  const handleMouseDown = (event: MouseEvent) => {
    const { mouseX, mouseY } = getCoordinates(event, canvasRef.current!);

    for (const [index, ball] of balls.entries()) {
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= ball.radius) {
        ball.selected = true;
        setClickInsideBall(true);
        setSelectedBallColor(balls[index].color);
        setSelectedBall(index);
        setIsColorPickerVisible(true);
        return;
      }
    }
  };

  const handleMouseOnlyMove = (event: MouseEvent) => {
    const { mouseX, mouseY } = getCoordinates(event, canvasRef.current!);

    const cursorSpeed = { x: 0, y: 0 };
    if (prevMousePos) {
      cursorSpeed.x = mouseX - prevMousePos.x;
      cursorSpeed.y = mouseY - prevMousePos.y;
    }

    prevMousePos.x = mouseX;
    prevMousePos.y = mouseY;

    for (const ball of balls) {
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared <= ball.radius * ball.radius) {
        const forceDirectionX = (-dx / Math.sqrt(distanceSquared)) * 5;
        const forceDirectionY = (-dy / Math.sqrt(distanceSquared)) * 5;
        ball.dx += cursorSpeed.x + forceDirectionX * 0.1;
        ball.dy += cursorSpeed.y + forceDirectionY * 0.1;
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    for (const ball of balls) {
      if (ball.selected) {
        const { rect } = getCoordinates(event, canvasRef.current!);
        ball.dx = (event.clientX - rect.left - ball.x) / 10;
        ball.dy = (event.clientY - rect.top - ball.y) / 10;
      }
    }
  };

  const handleMouseUp = () => {
    for (const ball of balls) {
      if (ball.selected) {
        ball.selected = false;
        return;
      }
    }
  };

  const onlyMouseMoveMode = () => {
    canvasRef!.current!.removeEventListener('mousemove', handleMouseMove);
    canvasRef!.current!.removeEventListener('mouseup', handleMouseUp);
    canvasRef!.current!.addEventListener('mousemove', handleMouseOnlyMove);
  };

  const shouldClickOnBallMode = () => {
    canvasRef.current!.removeEventListener('mousemove', handleMouseOnlyMove);
    canvasRef.current!.addEventListener('mousemove', handleMouseMove);
    canvasRef.current!.addEventListener('mouseup', handleMouseUp);
  };

  const toggleMoveBallsModeOnClickButtonHandle = () => {
    if (!isAlternativeMode) {
      shouldClickOnBallMode();
    } else {
      onlyMouseMoveMode();
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d');
    let requestId: number;

    const draw = () => {
      ctx!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      balls.forEach((ball) => {
        ctx!.beginPath();
        ctx!.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx!.fillStyle = ball.color;
        ctx!.fill();
        ctx!.closePath();
      });
    };

    const update = () => {
      balls.forEach((ball) => {
        if (!ball.selected) {
          ball.dx *= ball.friction;
          ball.dy *= ball.friction;
          ball.x += ball.dx;
          ball.y += ball.dy;

          if (ball.x + ball.radius > canvasRef.current!.width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
          }
          if (ball.y + ball.radius > canvasRef.current!.height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
          }

          balls.forEach((otherBall) => {
            if (ball !== otherBall) {
              const dx = ball.x - otherBall.x;
              const dy = ball.y - otherBall.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < ball.radius + otherBall.radius) {
                const angle = Math.atan2(dy, dx);
                const sine = Math.sin(angle);
                const cosine = Math.cos(angle);

                const vx1 = ball.dx * cosine + ball.dy * sine;
                const vy1 = ball.dy * cosine - ball.dx * sine;
                const vx2 = otherBall.dx * cosine + otherBall.dy * sine;
                const vy2 = otherBall.dy * cosine - otherBall.dx * sine;

                const newVx1 =
                  ((ball.mass - otherBall.mass) * vx1 + 2 * otherBall.mass * vx2) /
                  (ball.mass + otherBall.mass);
                const newVx2 =
                  ((otherBall.mass - ball.mass) * vx2 + 2 * ball.mass * vx1) /
                  (ball.mass + otherBall.mass);
                const newVy1 = vy1;
                const newVy2 = vy2;

                ball.dx = newVx1 * cosine - newVy1 * sine;
                ball.dy = newVy1 * cosine + newVx1 * sine;
                otherBall.dx = newVx2 * cosine - newVy2 * sine;
                otherBall.dy = newVy2 * cosine + newVx2 * sine;

                const overlap = ball.radius + otherBall.radius - distance;
                ball.x += overlap * Math.cos(angle);
                ball.y += overlap * Math.sin(angle);
              }
            }
          });
        }
      });
    };

    const animate = () => {
      update();
      draw();
      requestId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [balls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    toggleMoveBallsModeOnClickButtonHandle();

    canvas!.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas!.removeEventListener('mousedown', handleMouseDown);
      canvas!.removeEventListener('mousemove', handleMouseMove);
      canvas!.removeEventListener('mousemove', handleMouseOnlyMove);
      canvas!.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isAlternativeMode]);

  useEffect(() => {
    const outsideOnClickHandle = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as HTMLDivElement)
      ) {
        if (!clickInsideBall) {
          setIsColorPickerVisible(false);
        } else {
          setClickInsideBall(false);
        }
      }
    };

    document.addEventListener('mousedown', outsideOnClickHandle);
    return () => {
      document.removeEventListener('mousedown', outsideOnClickHandle);
    };
  }, [clickInsideBall]);

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
      />
      <button
        onClick={() => {
          setIsAlternativeMode((prev) => !prev);
        }}
        type="button">
        Сменить режим
      </button>
      {isColorPickerVisible && (
        <ColorPicker
          onChange={applyColorToSelectedBall}
          color={selectedBallColor!}
          ref={colorPickerRef}
        />
      )}
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime: number, onTimeUp: () => void) => {
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const start = () => {
    if (intervalRef.current !== null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (prevTime == 1) {
            onTimeUpRef.current();
          }

          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current === null) {
      return;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const remainingTimePercentage = (time / initialTime) * 100;

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { time, start, stop, remainingTimePercentage };
};

export default useTimer;

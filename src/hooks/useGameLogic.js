import { useState, useEffect, useRef, useCallback } from 'react';
import { BLOCK_MAPPING, COLORS, GAME_CONSTANTS } from '../constants/Theme';

const { ROWS, COLS, INITIAL_SPEED_MS, MIN_SPEED_MS, MAX_WRONG_ATTEMPTS } = GAME_CONSTANTS;

const getRandomNumber = () => Math.floor(Math.random() * 9) + 1;

const createRandomBlock = () => {
  const value = getRandomNumber();
  return {
    id: Math.random().toString(36).substring(7),
    value,
    color: BLOCK_MAPPING[value].color,
    points: BLOCK_MAPPING[value].points,
  };
};

export const useGameLogic = () => {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED_MS);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef(null);
  const gravityRef = useRef(null);

  // Initialize Game
  const initializeGame = useCallback(() => {
    let newBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    
    // Fill bottom 3 rows
    for (let r = ROWS - 3; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        newBoard[r][c] = createRandomBlock();
      }
    }
    
    setBoard(newBoard);
    setScore(0);
    setSpeed(INITIAL_SPEED_MS);
    setWrongAttempts(0);
    setIsGameOver(false);
    setSelectedBlocks([]);
    generateTargetNumber();
    setGameStarted(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (gravityRef.current) clearInterval(gravityRef.current);
  }, []);

  const generateTargetNumber = () => {
    setTargetNumber(prevTarget => {
      let newTarget;
      do {
        newTarget = Math.floor(Math.random() * 16) + 10; // 10 ile 25 arası
      } while (newTarget === prevTarget); // Aynı sayı denk gelirse tekrar kura çek
      
      return newTarget;
    });
  };

  const applyGravity = (currentBoard) => {
    let newBoard = currentBoard.map(row => [...row]);
    let moved = false;
    
    // Step by step fall: Iterate from second lowest row to the root row
    for (let r = ROWS - 2; r >= 0; r--) {
      for (let c = 0; c < COLS; c++) {
        // If there's a block here and it is empty directly below it
        if (newBoard[r][c] !== null && newBoard[r + 1][c] === null) {
          newBoard[r + 1][c] = newBoard[r][c];
          newBoard[r][c] = null;
          moved = true;
        }
      }
    }
    return { newBoard, moved };
  };

  const checkGameOver = (currentBoard) => {
    for (let c = 0; c < COLS; c++) {
      if (currentBoard[0][c] !== null) {
        return true;
      }
    }
    return false;
  };

  // The visual "Gravity Loop"
  const startGravity = useCallback(() => {
    if (gravityRef.current) return;
    
    gravityRef.current = setInterval(() => {
      setBoard(prevBoard => {
        const { newBoard, moved } = applyGravity(prevBoard);
        if (!moved) {
          clearInterval(gravityRef.current);
          gravityRef.current = null;
          
          if (checkGameOver(newBoard)) {
            setIsGameOver(true);
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return prevBoard; // Unchanged reference
        }
        return newBoard;
      });
    }, 120); // Smooth 120ms tick rate
  }, []);

  // Block Spawning interval
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    timerRef.current = setInterval(() => {
      setBoard(prevBoard => {
        let newBoard = prevBoard.map(row => [...row]);
        
        // Spawn 1 to 3 random blocks at the top
        const numBlocks = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numBlocks; i++) {
          const randomCol = Math.floor(Math.random() * COLS);
          if (newBoard[0][randomCol] === null) {
            newBoard[0][randomCol] = createRandomBlock();
          }
        }
        return newBoard;
      });
      startGravity();
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, isGameOver, speed, startGravity]);

  const selectBlock = (row, col) => {
    if (isGameOver) return;

    const block = board[row][col];
    if (!block) return;

    setSelectedBlocks(prev => {
      const isAlreadySelected = prev.some(pos => pos.row === row && pos.col === col);
      if (isAlreadySelected) {
        // İstediği bloğu seçimden çıkarabilmesi için seçilen bloğu array'den filtrele
        return prev.filter(pos => !(pos.row === row && pos.col === col));
      }

      if (prev.length > 0) {
        // Seçilen yeni taş, önceden seçilmiş *herhangi* bir taşa komşu olmalıdır
        const isNeighbor = prev.some(p => Math.abs(p.row - row) <= 1 && Math.abs(p.col - col) <= 1);
        if (!isNeighbor) return prev;
      }

      if (prev.length >= 4) return prev;
      return [...prev, { row, col, block }];
    });
  };

  const handleSelectionSuccess = (selectionSum) => {
    let pointsEarned = selectedBlocks.reduce((acc, curr) => acc + curr.block.points, 0);
    const newScore = score + pointsEarned;
    setScore(newScore);

    const speedReduction = Math.floor(newScore / 100) * 1000;
    const newSpeed = Math.max(INITIAL_SPEED_MS - speedReduction, MIN_SPEED_MS);
    setSpeed(newSpeed);

    setBoard(prevBoard => {
      let newBoard = prevBoard.map(r => [...r]);
      // Remove selected blocks
      selectedBlocks.forEach(pos => {
        newBoard[pos.row][pos.col] = null;
      });
      
      // Top up with random blocks at the very top based on how many cleared
      selectedBlocks.forEach(() => {
        const randomCol = Math.floor(Math.random() * COLS);
        if (newBoard[0][randomCol] === null) {
             newBoard[0][randomCol] = createRandomBlock();
        }
      });
      return newBoard;
    });

    startGravity();
    setSelectedBlocks([]);
    generateTargetNumber();
  };

  const handleSelectionFail = () => {
    const newWrong = wrongAttempts + 1;
    setWrongAttempts(newWrong);
    setSelectedBlocks([]);

    if (newWrong >= MAX_WRONG_ATTEMPTS) {
      setIsGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (gravityRef.current) clearInterval(gravityRef.current);
    }
  };

  const confirmSelection = () => {
    if (selectedBlocks.length < 2) return;

    const currentSum = selectedBlocks.reduce((acc, curr) => acc + curr.block.value, 0);
    if (currentSum === targetNumber) {
      handleSelectionSuccess(currentSum);
    } else {
      handleSelectionFail();
    }
  };

  return {
    board,
    targetNumber,
    selectedBlocks,
    score,
    speed,
    wrongAttempts,
    isGameOver,
    gameStarted,
    initializeGame,
    selectBlock,
    confirmSelection,
    cancelSelection: () => setSelectedBlocks([])
  };
};

import { useState, useMemo } from "react";
import {
  X,
  O,
  checkWinner,
  isPlacementPhase,
  getSuccessors,
} from "@/presentation/shared/utils/fanoronaUtils";

const toSymbol = (value: number): string => {
  if (value === X) return "X";
  if (value === O) return "O";
  return "";
};

const FanoronaTelo = () => {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(0),
    turn: X as number,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const { board, turn } = gameState;
  const placementMode = isPlacementPhase(board);
  const winner = checkWinner(board);

  // On calcule les coups valides pour vérifier le clic de l'utilisateur
  const validMoves = useMemo(() => getSuccessors(board, turn), [board, turn]);

  const playMove = async (nextBoard: number[]) => {
    const nextTurn = turn === X ? O : X;
    setGameState({ board: nextBoard, turn: nextTurn });

    if (checkWinner(nextBoard) !== 0 || isThinking) return;

    setIsThinking(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/fanorona-move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: nextBoard, turn: nextTurn }),
      });
      const data = await res.json();
      setGameState({ board: data.best_board, turn: data.next_turn });
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClick = (index: number) => {
    if (winner !== 0 || turn !== X || isThinking) return;

    if (placementMode) {
      if (board[index] !== 0) return;
      const move = validMoves.find((m) => m[index] === X);
      if (move) playMove(move);
    } else {
      if (selected === null) {
        if (board[index] === X) setSelected(index);
      } else {
        if (board[index] === X) {
          setSelected(index); // Change de pion sélectionné
        } else {
          // Tente un déplacement du pion 'selected' vers 'index'
          const move = validMoves.find(
            (m) => m[selected] === 0 && m[index] === X
          );
          setSelected(null);
          if (move) playMove(move);
        }
      }
    }
  };

  return (
    <main className="ttt-page">
      <section className="ttt-card">
        <h1 className="ttt-title">Fanoro Telo</h1>
        <p className="ttt-status">
          {status} {placementMode ? "(placement)" : "(déplacement)"}
        </p>

        <div
          className="fanorona-board"
          role="grid"
          aria-label="Plateau Fanoro Telo"
        >
          <svg
            className="fanorona-lines"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <rect x="0" y="0" width="100" height="100" rx="0" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
          </svg>

          <div className="fanorona-points">
            {board.map((cell, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const top = row * 50;
              const left = col * 50;

              return (
                <button
                  key={index}
                  type="button"
                  className="fanorona-point"
                  style={{ top: `${top}%`, left: `${left}%` }}
                  onClick={() => handleClick(index)}
                  // disabled={game.isTerminal()}
                  aria-label={`Case ${index + 1}`}
                >
                  <span
                    className={[
                      "fanorona-piece",
                      cell === X ? "is-x" : "",
                      cell === O ? "is-o" : "",
                      selected === index ? "is-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {toSymbol(cell)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="ttt-reset"
          type="button"
          onClick={() => setGameState({ board: Array(9).fill(0), turn: X })}
        >
          Rejouer
        </button>
      </section>
    </main>
  );
};

export default FanoronaTelo;

import { useState } from "react";
import { checkWinner, isFull, O, X } from "../shared/utils/gameUtils";

const TicTacToe = () => {
  // On utilise un objet simple au lieu de 'new TicTacToeNode()'
  const [gameState, setGameState] = useState({
    board: Array(9).fill(0),
    turn: X as number,
  });
  const [isThinking, setIsThinking] = useState(false);

  const handleClick = async (index: number) => {
    const { board, turn } = gameState;
    const isPlayerTurn = turn === X;

    // Vérifications de base (remplace isTerminal)
    if (
      board[index] !== 0 ||
      checkWinner(board) ||
      isFull(board) ||
      isThinking ||
      !isPlayerTurn
    )
      return;

    // 1. Joueur humain joue
    const newBoard = [...board];
    newBoard[index] = turn;
    const nextTurn = turn === X ? O : X;

    setGameState({ board: newBoard, turn: nextTurn });

    // Si le joueur a gagné ou match nul, on arrête
    if (checkWinner(newBoard) || isFull(newBoard)) return;

    // 2. Appel API pour l'IA
    setIsThinking(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/best-move`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ board: newBoard, turn: nextTurn }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // On met directement à jour avec les données brutes de l'API
      setGameState({ board: data.best_board, turn: data.next_turn });
    } catch (e) {
      console.error(e);
      // On rend la main au joueur si l'IA échoue
      setGameState({ board: newBoard, turn: X });
    } finally {
      setIsThinking(false);
    }
  };

  // Logique d'affichage
  const winData = checkWinner(gameState.board);
  const winner = winData?.winner;
  const winType = winData?.line;

  const draw = !winner && isFull(gameState.board);
  const status = winner
    ? `Gagnant: ${winner === X ? "X" : "O"}`
    : draw
    ? "Match nul"
    : `Tour: ${gameState.turn === X ? "X" : "O"}`;

  return (
    <main className="ttt-page">
      <section className="ttt-card">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className="ttt-status">{status}</p>

        <div className="ttt-grid-container">
          <div className="ttt-grid">
            {gameState.board.map((cell, i) => (
              <button
                key={i}
                className="ttt-cell"
                onClick={() => handleClick(i)}
                disabled={cell !== 0 || !!winner || isThinking}
              >
                {cell === X && <span className="ttt-x">X</span>}
                {cell === O && <span className="ttt-o">O</span>}
              </button>
            ))}
          </div>
          {/* On affiche la ligne seulement s'il y a un gagnant */}
          {winType && <div className={`win-line ${winType}`} />}
        </div>

        <button
          className="ttt-reset"
          onClick={() => setGameState({ board: Array(9).fill(0), turn: X })}
        >
          Rejouer
        </button>
      </section>
    </main>
  );
};

export default TicTacToe;

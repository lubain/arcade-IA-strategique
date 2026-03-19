from typing import List, Optional
from type import X_PLAYER
from gameNode import GameNode

class FanoronaTeloNode(GameNode['FanoronaTeloNode', int]):
    def __init__(self, board: Optional[List[int]] = None, turn: int = X_PLAYER):
        super().__init__(turn)
        self.board = list(board) if board else [0] * 9
        
    def get_successors(self) -> List['FanoronaTeloNode']:
        successors = []
        pions_sur_plateau = sum(1 for cell in self.board if cell == self.turn)

        # PHASE 1 : Placement (si le joueur a moins de 3 pions)
        if pions_sur_plateau < 3:
            for i in range(9):
                if self.board[i] == 0:
                    child = self.clone()
                    child.board[i] = self.turn
                    child.turn = -self.turn
                    successors.append(child)
        
        # PHASE 2 : Déplacement (si 3 pions sont déjà posés)
        else:
            adjacences = [
                [1, 3, 4],       # 0
                [0, 2, 4],       # 1
                [1, 4, 5],       # 2
                [0, 4, 6],       # 3
                [0, 1, 2, 3, 5, 6, 7, 8], # 4 (Centre : accès partout)
                [2, 4, 8],       # 5
                [3, 4, 7],       # 6
                [6, 4, 8],       # 7
                [5, 4, 7]        # 8
            ]
            for i in range(9):
                if self.board[i] == self.turn:
                    for voisin in adjacences[i]:
                        if self.board[voisin] == 0:
                            child = self.clone()
                            child.board[i] = 0 # Quitte l'ancienne case
                            child.board[voisin] = self.turn # Va sur la nouvelle
                            child.turn = -self.turn
                            successors.append(child)
        return successors

    def evaluate(self, player: int) -> float:
        # Même logique d'alignement que le Tic-Tac-Toe
        lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for a, b, c in lines:
            if self.board[a] != 0 and self.board[a] == self.board[b] == self.board[c]:
                return float(self.board[a] * player * 100)
        return 0.0

    def is_terminal(self) -> bool:
        return self.evaluate(X_PLAYER) != 0.0

    def clone(self) -> 'FanoronaTeloNode':
        return FanoronaTeloNode(self.board.copy(), self.turn)
import numpy as np

class Point:
    def __init__(self, x, y, z, k=1) -> None:
        self.x = x
        self.y = y
        self.z = z
        self.matrix = np.matrix([[self.x, self.y, self.z, k]])

    @classmethod
    def from_matrix(cls, matrix) -> None:
        matrix = matrix.A1
        x = matrix[0]
        y = matrix[1]
        z = matrix[2]
        k = 1
        return cls(x, y, z, k)

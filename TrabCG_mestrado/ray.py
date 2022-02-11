from point import Point
from utils import *
from camera import Camera
import math


class Ray:
    def __init__(self, first_point, last_point, projection, camera=None, alpha=None) -> None:
        self.first_point = first_point
        self.last_point = last_point
        if projection ==  'perspective':
            self.direction = normalize_vector(
                Point.from_matrix(last_point.matrix - first_point.matrix))
        elif projection == 'orthographic':
            self.direction = normalize_vector(Point.from_matrix(-1*camera.vector_k.matrix))
        elif projection == 'cavalier':
            self.direction = normalize_vector(Point(math.cos(math.radians(alpha)), math.sin(math.radians(alpha)), -1))
        elif projection == 'cabinet':
            self.direction = normalize_vector(Point(math.cos(math.radians(alpha)), math.sin(math.radians(alpha)), -2))

        #self.direction_measure = Point.from_matrix(self.direction.matrix * measure)

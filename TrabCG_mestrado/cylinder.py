from camera import Camera
from point import Point
from utils import *


class Cylinder:
    def __init__(self, center, radius, height, u, material) -> None:
        self.center = center
        self.radius = radius
        self.height = height
        self.u = normalize_vector(u) 
        self.material = material

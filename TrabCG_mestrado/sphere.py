from camera import Camera
from point import Point
from utils import *
from material import Material


class Sphere:
    def __init__(self, center, radius, material) -> None:
        self.center = center
        self.radius = radius
        self.center_camera = None
        self.material = material


import numpy as np
from utils import *


class Plane:
    def __init__(self, center, normal, material=None) -> None:
        self.center = center
        self.normal = normalize_vector(normal)
        self.material = material
    
    def collide_ray(self, ray):
        vec = Point.from_matrix(self.center.matrix - ray.last_point.matrix)
        product0 = dot(vec,self.normal)
        product1 = dot(ray.direction, self.normal)

        if(product1 == 0):
            return None
        
        t_int = product0/product1

        return Point.from_matrix(ray.last_point.matrix + t_int * ray.direction.matrix)


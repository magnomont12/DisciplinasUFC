from camera import Camera
from point import Point
from utils import *
from material import Material


class ClusterSphere:
    def __init__(self, center, radius, list_objects=None) -> None:
        self.center = center
        self.radius = radius
        self.center_camera = None
        self.list_objects = list_objects

    def get_center_camera(self, camera):
        self.center_camera = Point.from_matrix(
            point_matrix_mult(self.center, camera.world_to_camera))

    def collision_ray(self, ray):
        v = Point.from_matrix(ray.last_point.matrix -
                              self.center.matrix)
        a = dot(ray.direction, ray.direction)
        b = dot(v, ray.direction)
        c = dot(v, v) - self.radius**2
        delta = b**2 - a * c
        if delta > 0:
            t1 = (-b + math.sqrt(delta)) / a
            t2 = (-b - math.sqrt(delta)) / a
            p1 = Point.from_matrix(
                ray.last_point.matrix + t1 * ray.direction.matrix)
            p2 = Point.from_matrix(
                ray.last_point.matrix + t2 * ray.direction.matrix)
            if(dist_point(p1, ray.last_point) > dist_point(p2, ray.last_point)):
                p1 = p2
            normal_collide_point = Point.from_matrix((p1.matrix - self.center.matrix) / self.radius)
            #return dist_point(p1, ray.last_point),p1 ,normal_collide_point
            return True
        elif delta == 0:
            t1 = (-b + math.sqrt(delta) ) / a
            p1 = Point.from_matrix(ray.last_point.matrix + t1 * ray.direction.matrix)
            normal_collide_point = Point.from_matrix((p1.matrix - self.center.matrix) / self.radius)
            #return dist_point(p1, ray.last_point),p1,normal_collide_point
            return True
        else:
            #return -1, Point(0,0,0), Point(0,0,0)
            return False

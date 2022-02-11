import numpy as np

from utils import *


class Camera:
    def __init__(self, point_xyz, lookat, view_up):
        self.point_xyz = point_xyz
        self.vector_k = self.origin_cordinates_k(point_xyz, lookat)
        self.vector_i = self.origin_cordinates_i(point_xyz, view_up)
        self.vector_j = normalize_vector(
            cross_product(self.vector_k, self.vector_i))

        self.world_to_camera = np.matrix([[self.vector_i.x, self.vector_i.y, self.vector_i.z, -(dot(self.vector_i, self.point_xyz))],
                                          [self.vector_j.x, self.vector_j.y, self.vector_j.z, -(dot(self.vector_j, self.point_xyz))],
                                          [self.vector_k.x, self.vector_k.y, self.vector_k.z, -(dot(self.vector_k, self.point_xyz))],
                                          [0, 0, 0, 1],
                                          ])
        
        self.camera_to_world = np.matrix([[self.vector_i.x, self.vector_j.x, self.vector_k.x, 0],
                                          [self.vector_i.y, self.vector_j.y, self.vector_k.y, 0],
                                          [self.vector_i.z, self.vector_j.z, self.vector_k.z, 0],
                                          [-dot(self.point_xyz, self.vector_i), -dot(self.point_xyz, self.vector_j), -dot(self.point_xyz, self.vector_k), 1],
                                          ])

    def origin_cordinates_k(self, point_xyz, lookat):
        vector_k = Point.from_matrix(point_xyz.matrix - lookat.matrix)
        vector_k = normalize_vector(vector_k)
        return vector_k

    def origin_cordinates_i(self, point_xyz, view_up):
        #v_up = Point.from_matrix(view_up.matrix - point_xyz.matrix)
        vector_i = cross_product(view_up, self.vector_k)
        vector_i = normalize_vector(vector_i)
        return vector_i

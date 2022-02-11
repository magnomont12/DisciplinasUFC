from utils import *

class PointLight:
    def __init__(self, point, rgb_a, rgb_d, rgb_s) -> None:
        self.point = point
        self.rgb_a = rgb_a
        self.rgb_d = rgb_d
        self.rgb_s = rgb_s

    def calculate_color(self,object_scene, collision_point, ray, normal_collide_point):
        n = normalize_vector(normal_collide_point)
        l = self.calculate_L(collision_point)
        r = self.calculate_R(l, n)
        param_difuse = dot(n,l)
        if param_difuse < 0:
            param_difuse = 0
        
        param_specular = dot(r, Point.from_matrix(-1*ray.direction.matrix))
        if param_specular < 0:
            param_specular = 0
        

        intensity_ambient = [object_scene.material.ambient[0]*self.rgb_a[0],object_scene.material.ambient[1]*self.rgb_a[1],object_scene.material.ambient[2]*self.rgb_a[2]]
        intensity_difuse = self.calculate_difuse(object_scene, collision_point,param_difuse)
        intensity_specular = self.calculate_specular(object_scene, collision_point, param_specular, r)

        return [intensity_ambient[0]+intensity_difuse[0]+intensity_specular[0],
                intensity_ambient[1]+intensity_difuse[1]+intensity_specular[1],
                intensity_ambient[2]+intensity_difuse[2]+intensity_specular[2]]
        # return [intensity_difuse[0],
        #         intensity_difuse[1],
        #         intensity_difuse[2]]

    def calculate_difuse(self,object_scene, collision_point, param_difuse):
        intensity = [object_scene.material.difuse[0]*self.rgb_d[0]*param_difuse,
                     object_scene.material.difuse[1]*self.rgb_d[1]*param_difuse,
                     object_scene.material.difuse[2]*self.rgb_d[2]*param_difuse]
        return intensity

    def calculate_specular(self,object_scene, collision_point, param_specular,r):
        intensity = [object_scene.material.specular[0]*self.rgb_s[0]*(param_specular)**object_scene.material.range_specular,
                     object_scene.material.specular[1]*self.rgb_s[1]*(param_specular)**object_scene.material.range_specular,
                     object_scene.material.specular[2]*self.rgb_s[2]*(param_specular)**object_scene.material.range_specular]
        return intensity

    def calculate_L(self, collision_point):
        return normalize_vector(Point.from_matrix(self.point.matrix - collision_point.matrix))

    def calculate_R(self, l, n):
        return normalize_vector(Point.from_matrix((2 * dot(l,n) * n.matrix) - l.matrix))
    



        

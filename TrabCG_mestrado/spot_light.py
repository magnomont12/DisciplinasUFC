from utils import *
import math

class SpotLight:
    def __init__(self, point, rgb_a, rgb_d, rgb_s, direction, angle) -> None:
        self.point = point
        self.rgb_a = rgb_a
        self.rgb_d = rgb_d
        self.rgb_s = rgb_s
        self.direction = normalize_vector(direction)
        self.angle = math.radians(angle)


    def calculate_color(self,object_scene, collision_point, ray, normal_collide_point):
        n = normalize_vector(normal_collide_point)
        l = normalize_vector(Point.from_matrix(self.point.matrix - collision_point.matrix))
        r = self.calculate_R(l, n)

        param_difuse = dot(n,l)
        if param_difuse < 0:
            param_difuse = 0
        
        param_specular = dot(r, Point.from_matrix(-1*ray.direction.matrix))
        if param_specular < 0:
            param_specular = 0
        
        atenuation = dot(Point.from_matrix(-1 * l.matrix), self.direction)

        if atenuation < math.cos(self.angle):
            atenuation = 0
        #print(atenuation)

        intensity_ambient = [object_scene.material.ambient[0]*self.rgb_a[0]*atenuation,
                             object_scene.material.ambient[1]*self.rgb_a[1]*atenuation,
                             object_scene.material.ambient[2]*self.rgb_a[2]*atenuation]
        intensity_difuse = self.calculate_difuse(object_scene, collision_point,param_difuse,atenuation)
        intensity_specular = self.calculate_specular(object_scene, collision_point, param_specular, r,atenuation)

        return [intensity_ambient[0]+intensity_difuse[0]+intensity_specular[0],
                intensity_ambient[1]+intensity_difuse[1]+intensity_specular[1],
                intensity_ambient[2]+intensity_difuse[2]+intensity_specular[2]]
        # return [intensity_difuse[0],
                # intensity_difuse[1],
                # intensity_difuse[2]]

    def calculate_difuse(self,object_scene, collision_point, param_difuse,atenuation):
        intensity = [object_scene.material.difuse[0]*self.rgb_d[0]*param_difuse*atenuation,
                     object_scene.material.difuse[1]*self.rgb_d[1]*param_difuse*atenuation,
                     object_scene.material.difuse[2]*self.rgb_d[2]*param_difuse*atenuation]
        return intensity

    def calculate_specular(self,object_scene, collision_point, param_specular,r,atenuation):
        intensity = [object_scene.material.specular[0]*self.rgb_s[0]*(param_specular)**object_scene.material.range_specular*atenuation,
                     object_scene.material.specular[1]*self.rgb_s[1]*(param_specular)**object_scene.material.range_specular*atenuation,
                     object_scene.material.specular[2]*self.rgb_s[2]*(param_specular)**object_scene.material.range_specular*atenuation]
        return intensity

    def calculate_normal_sphere(self,sphere, collision_point):
        return Point.from_matrix((collision_point.matrix - sphere.center.matrix) / sphere.radius)

    def calculate_R(self, l, n):
        return normalize_vector(Point.from_matrix(2 * dot(l,n) * n.matrix - l.matrix))
    



        

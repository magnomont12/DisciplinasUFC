from utils import *

from point import Point
from camera import Camera

from sphere import Sphere
from cylinder import Cylinder
from cone import Cone
from plane import Plane

from material import Material
from point_light import PointLight
from directional_light import DirectionalPointLight
from spot_light import SpotLight

from cluster_sphere import ClusterSphere

from raycasting import Raycasting

import cv2
import numpy as np
from matplotlib import pyplot as plt
from random import choice, randint, random, randrange, uniform

def choose_material():
    material = choice(materials)
    return material

def random_point():
    return Point(random(), random(), random())  

def create_scene(cluster, num_obj=15):
    scene = []
    for i in range(num_obj):
        random_float = random()
        center = Point(i+randint(cluster.center.x-cluster.radius+30, cluster.center.x+cluster.radius-30), randint(cluster.center.y-cluster.radius+30, cluster.center.y+cluster.radius-30), -i+randint(cluster.center.z-cluster.radius+100, -10))
        # print(center.matrix)
        object_choice = choice([0, 1, 2])
        if object_choice == 0:
            scene.append(Sphere(center, randint(5, 20), choose_material()))
        elif object_choice == 1:
            scene.append(Cylinder(center, randint(5,20), randint(15, 30), random_point(), choose_material()))
        else: 
            scene.append(Cone(center, randint(5,20), randint(15,30), random_point(), choose_material()))
    return scene 


if __name__ == '__main__':

    point_xyz = Point(0, 0, 200)
    lookat = Point(0, 0, -1)
    view_up = Point(0, 1, 0)
    view = Camera(point_xyz=point_xyz,
                  lookat=lookat, view_up=view_up)

    ##Material
    bronze = Material([0.5, 0.5, 0.5],[0.5, 0.5, 0.5],[0.8, 0.8, 0.8],10)
    obsidian = Material([0.05375, 0.05, 0.06625],[0.18275, 0.17, 0.22525],[0.332741, 0.328634, 0.346435], 0.5)
    chrome = Material([0.25, 0.25, 0.25],[0.4, 0.4, 0.4],[0.774597, 0.774597, 0.774597],0.5)
    gold = Material([0.24725, 0.1995, 0.0745],[0.75164, 0.60648, 0.22648],[0.628281, 0.555802, 0.366065],8)
    silver = Material([0.19225, 0.19225, 0.19225], [0.50754, 0.50754, 0.50754], [0.508273, 0.508273, 0.508273], 2.0)
    ruby = Material([0.1745, 0.01175, 0.01175], [0.61424, 0.04136, 0.04136], [0.727811, 0.626959, 0.626959], 1)
    brass = Material([0.329412, 0.223529, 0.027451], [0.780392, 0.568627, 0.113725], [0.992157, 0.941176, 0.807843], 0.21794872)
    red_rubber = Material([0.05, 0.0, 0.0], [0.5, 0.4, 0.4], [0.7, 0.04, 0.04], .078125)
    black_rubber = Material([0.02, 0.02, 0.02], [0.01, 0.01, 0.01], [0.4, 0.4, 0.4], .078125)
    yellow_rubber = Material([0.05, 0.05, 0.0], [0.0, 0.5, 0.4], [0.7, 0.07, 0.04], .078125)
    white_rubber = Material([0.05, 0.05, 0.05], [0.5, 0.5, 0.5], [0.7, 0.07, 0.07], .078125)
    green_rubber = Material([0.0,	0.05,	0.0],	[0.4,	0.5,	0.4],	[0.04,	0.7,	0.04],	0.078125)
    turquoise = Material([0.1, 0.18725, 0.1745], [0.396, 0.74151, 0.69102],  [0.297254, 0.30829, 0.306678], 0.1)
    cyan_plastic = Material([0.0,0.1,0.06],	[0.0,0.50980392,0.50980392],[0.50196078,0.50196078,0.50196078],	0.25)
    green_plastic = Material([0.0, 0.0, 0.0], [0.1, 0.35, 0.1],	[0.45, 0.55, 0.45],	0.25)
    red_plastic	= Material([0.0,0.0,0.0],	[0.5,0.0,0.0],	[0.7,0.6,0.6],	0.25)
    materials = [bronze, obsidian, chrome, gold, silver, ruby, brass, red_rubber, black_rubber, yellow_rubber, white_rubber, green_rubber, turquoise, cyan_plastic, green_plastic, red_plastic]

    ##Lights
    point_light = PointLight(Point(0,0,100), [0.5,0.0,0.0], [0.5,0.5,0.5], [0.8,0.8,0.8])
    directional_light_up = DirectionalPointLight(Point(300,0,-50), [0.2,0.2,0.2], [0.2,0.2,0.2], [0.5,0.5,0.5], Point(0.0,1.0,0.0))
    spot_light = SpotLight(Point(0,20,-35), [0.0,0.0,1.0], [0.0,0.0,1.0], [1.0,1.0,1.0], Point(0.0,-1.0,0.0),45)

    lights = [point_light,spot_light, directional_light_up]


    ##Objects
    sphere = Sphere(Point(100,100,-30), 20,gold)
    cylinder = Cylinder(Point(-100,100,-30), 15, 30, Point(0.0,1.0,0.0), gold)
    cone = Cone(Point(0,30,-30), 15, 30, Point(0.0,1.0,0.0), gold)

    cylinder1 = Cylinder(Point(100,-100,-30), 15, 30, Point(0.0,1.0,0.0), bronze)
    cone1 = Cone(Point(-100,-100,-30), 15, 30, Point(0.0,1.0,0.0), bronze)
    sphere1 = Sphere(Point(0,-120,-30), 20,bronze)

    horizonte = Plane(Point(0,0,-1000), Point(0,0.0,1.0),green_plastic)

    list_scene = [cylinder,sphere,cone,horizonte, cylinder1, cone1, sphere1]

    ##Clusters
    cluster1 =  ClusterSphere(Point(-150, 150, -200), 150)
    scene_cluster1 = create_scene(cluster1)
    cluster1.list_objects = scene_cluster1

    cluster2 =  ClusterSphere(Point(-150, -150, -200), 150)
    scene_cluster2 = create_scene(cluster2)
    cluster2.list_objects = scene_cluster2

    cluster3 =  ClusterSphere(Point(150, 150, -200), 150)
    scene_cluster3 = create_scene(cluster3)
    cluster3.list_objects = scene_cluster3

    cluster4 =  ClusterSphere(Point(150, -150, -200), 150)
    scene_cluster4 = create_scene(cluster4)
    cluster4.list_objects = scene_cluster4

    cluster = ClusterSphere(Point(0.0, 0.0, -50.0),1000, list_scene)

    list_cluster = [cluster, cluster1, cluster2, cluster3, cluster4]

    raycasting = Raycasting(lights,list_cluster,view, 250,500,500,150,150,'perspective')
    img = np.clip(np.array(raycasting.create_matrix()),0,1)

    plt.imshow(img, interpolation='nearest')
    plt.show()
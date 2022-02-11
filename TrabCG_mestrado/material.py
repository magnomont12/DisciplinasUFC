class Material:
    def __init__(self, ambient, difuse, specular, range_specular) -> None:
        self.ambient = ambient
        self.difuse = difuse
        self.specular = specular
        self.range_specular = range_specular
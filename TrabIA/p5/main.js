var frames = 0;
var food = [];
var poison = [];
var theBest = false

function setup() {
    createCanvas(1280, 720);
    let target = 10;
    let popmax = 10;
    let mutationRate = 0.01;

    population = new Population(target, mutationRate, popmax);

    for (var a = 0; a < 440; a++) {
        var x = random(width);
        var y = random(height);
        food.push(createVector(x, y));
    }
    for (var a = 0; a < 60; a++) {
        var x = random(width);
        var y = random(height);
        poison.push(createVector(x, y));
    }
}


function draw() {
    if(!theBest){
        background(44);
    }
    else{
        background(0);
    }
    
    for (var a = 0; a < population.population.length; a++) {
        population.population[a].behaviors(food, poison)
        population.population[a].update()
        population.population[a].boundaries();
        population.population[a].display()
    }

    //Desenha comidas e venenos
    for (var a = 0; a < food.length; a++) {
        fill(0, 255, 0);
        ellipse(food[a].x, food[a].y, 8, 8);
    }
    for (var a = 0; a < poison.length; a++) {
        fill(255, 0, 0);
        ellipse(poison[a].x, poison[a].y, 8, 8);
    }

    if (frames % 60 == 0 && !theBest) {
        food = [];
        poison = [];

        for (var a = 0; a < 440; a++) {
            var x = random(width);
            var y = random(height);
            food.push(createVector(x, y));
        }
        for (var a = 0; a < 60; a++) {
            var x = random(width);
            var y = random(height);
            poison.push(createVector(x, y));
        }
        for (var a = 0; a < population.population.length; a++) {
            population.population[a].vecQnt.push(population.population[a].quantidade)
            population.population[a].quantidade = 0;
            population.population[a].position = createVector(random(width), random(height));

        }

        if (frames == 600) {
            frames = 0;
            let media = 0.0;

            population.calcMedia();
            population.calcFitness();
            population.naturalSelection();
            population.generate();
            media = population.calcMediaFitnes();

            for (var a = 0; a < population.population.length; a++) {
                population.population[a].vecQnt = [];
                if (media > 0.985) {
                    //print(population.population[a].dna)
                    theBest = true;
                    //car = new Vehicle(200,200);
                    //car.dna = population.population[a].dna
                }
            }
        }
    }
    else if(frames % 60 == 0 && theBest) {
        food = [];
        poison = [];

        for (var a = 0; a < 440; a++) {
            var x = random(width);
            var y = random(height);
            food.push(createVector(x, y));
        }
        for (var a = 0; a < 60; a++) {
            var x = random(width);
            var y = random(height);
            poison.push(createVector(x, y));
        }

        for (var a = 0; a < population.population.length; a++) {
            population.population[a].vecQnt.push(population.population[a].quantidade)
            population.population[a].quantidade = 0;
            population.population[a].position = createVector(random(width), random(height));

        }
        if(frames == 600){
            frames = 0
            let media = 0.0
            population.calcFitness();
            //media = population.calcMediaFitnes();
            for (var a = 0; a < population.population.length; a++) {
                print(parseInt(population.population[a].calcQnt()))
                population.population[a].vecQnt = [];

            }
        }

    }

    frames += 1;

}
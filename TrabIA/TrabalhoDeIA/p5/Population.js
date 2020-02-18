class Population {

    mutationRate;
    population = [];
    matingPool = [];
    target;
    generetions = 0;
    finished;
    perfectScore = 0;

    constructor(target, mutation, pop) {
        this.target = target;
        this.mutationRate = mutation;
        for (var i = 0; i < pop; i++) {
            this.population.push(new Vehicle(random(width), random(height)))
        }
        this.calcFitness();
        this.finished = false;
        this.generations = 0;
        this.perfectScore = 1;
    }

    calcFitness() {
        for (var i = 0; i < this.population.length; i++) {
            this.population[i].resultFitness(this.target)
        }
    }

    naturalSelection() {
        this.matingPool = [];
        let maxFitness = 0;

        for (var i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > maxFitness) {
                maxFitness = this.population[i].fitness
            }
        }

        for (var i = 0; i < this.population.length; i++) {
            let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
            let n = parseInt(fitness * 100);
            for (var j = 0; j < n; j++) {
                this.matingPool.push(this.population[i]);
            }
        }

    }
    generate() {
        for (var i = 0; i < this.population.length; i++) {
            let a = parseInt(random(this.matingPool.length));
            let b = parseInt(random(this.matingPool.length));
            let partnerA = this.matingPool[a];
            let partnerB = this.matingPool[b];
            let child = partnerA.crossover(partnerB);
            this.population[i].dna = child;
            this.population[i].mutate(this.mutationRate);
            //child.mutate(mutationRate);
            //this.population[i] = child;
        }
        this.generations++;
    }

    calcMedia(){
        for (var i = 0; i < this.population.length; i++) {
            this.population[i].calcQnt()
        }
    }

    calcMediaFitnes(){
        let media = 0.0
        for (var i = 0; i < this.population.length; i++) {
            print(this.population[i].resultFitness(this.target))
            media += this.population[i].resultFitness(this.target)
        }
        media = media/parseFloat(this.population.length)
        print("A media deu"+media)
        return media
    }
}
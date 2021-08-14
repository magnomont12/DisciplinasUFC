class Vehicle {
    position;
    velocity;
    acceleration;
    r;
    maxforce;
    //dna[5];
    dna = []
    vecQnt = []
    quantidade=0;
    fitness=0;

    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 4;
        this.maxforce = 0.1;
        this.dna[0]=parseInt(random(30,-15));
        this.dna[1]=parseInt(random(30,-15));
        this.dna[2]=parseInt(random(30,-15));
        this.dna[3]=parseInt(random(30,-15));
        this.dna[5] = random(0,8);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.dna[5]);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    display() {
        let theta = this.velocity.heading() + PI / 2;
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);

        strokeWeight(3);
        stroke(0, 255, 0);
        noFill();
        strokeWeight(2);
        line(0, 0, 0, -this.dna[0] * 15);
        ellipse(0,0,abs(this.dna[2]*10));
        stroke(255, 0, 0);
        line(0, 0, 0, -this.dna[1] * 15);
        ellipse(0,0,abs(this.dna[3]*10));

        fill(255);
        stroke(200);

        strokeWeight(1);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the position to the target
    
        // Scale to maximum speed
        desired.setMag(this.dna[5]);
    
        // Steering = Desired minus velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);  // Limit to maximum steering force
    
        return steer;
        //this.applyForce(steer);
      }

    eat(list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var a = list.length-1; a>=0 ; a--) {
          //var d = dist(this.position.x, this.position.y, list[a].x, list[a].y);
          var d = this.position.dist(list[a]);
          if (d < this.dna[5]) {
            list.splice(a, 1);
            if(list == food){
              this.quantidade+=1;
            }
            else if(list == poison){
              this.quantidade-=1;
            }
          }else{
            if (d < record && d < perception) {
              record = d;
              closest = list[a];
            }
          }
        }
        //This is the moment eating
        if (closest != null) {
          return this.seek(closest);
        }
        return createVector(0, 0);
      }

    behaviors(good, bad) {
        var steerG = this.eat(good, 0.1, abs(this.dna[2] * 10));
        var steerB = this.eat(bad, -0.5, abs(this.dna[3] * 10));

        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    boundaries() {
        var d = 25;
        let desired = null;

        if (this.position.x < d) {
            desired = createVector(this.dna[5], this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.dna[5], this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.dna[5]);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.dna[5]);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.dna[5]);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    resultFitness(target){
      if (this.quantidade > target){
        this.fitness = target/this.quantidade
      }
      else{
        this.fitness = this.quantidade/target
      }
      return this.fitness;
    }

    crossover(partner){
      let child = [];
      for(var a=0; a<this.dna.length;a++){
        child[a] = 0
      }
      let midpoint = parseInt(random(this.dna.length));
  
      for(var i=0; i<this.dna.length;i++){
        if(i > midpoint){
          child[i] = this.dna[i];
        }else{
          child[i]= partner.dna[i];
        }
      }
      return child;
    }

    mutate(mutationRate){
      for(var i=0; i<this.dna.length;i++){
        if(random(1) < mutationRate){
          this.dna[i] = parseInt(random(30,-15));
        }
      }
    }

    calcQnt(){
      let soma=0;
      for(var a=0; a<this.vecQnt.length;a++){
        soma += this.vecQnt[a];
      }
      this.quantidade = soma / this.vecQnt.length;
      return this.quantidade;
    }

}
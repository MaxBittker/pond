import V from './vector.js';
import synaptic from 'synaptic'
import food from './food.js';


class Creature {
  constructor(x, y) {
    this.p = new V(x,y)
    this.v = (new V()).random()
    this.network = new synaptic.Architect.Perceptron(6, 25, 25, 2);
    this.energy = 0;
  }

  get angle() {
    return this.v.angle();
  }

  tick(bounds,neighbors){
    // this.energy*=.995
    let processedInputs = this.getInputs(neighbors)
    //this.p.copy().add(this.getInputs(neighbors))
    // debugger;
    let activation = this.activate(processedInputs)
    this.move(activation)
    this.p.wrap(bounds)
    this.eat(neighbors)
  }
  eat(neighbors){
    neighbors.length
    let com = new V()
    neighbors.forEach(n=>{
      if(n instanceof food && this.p.dist(n.p) < 10){
        n.marked = true
        this.energy+=1;
      }
    })
  }
  getInputs(entities){
    if(entities.length===0){
      return {COM:new V(0,0),
              f1:new V(0,0)}
    }
    let closestfood = entities[0].p.copy()
    let sum = entities.reduce((avg,e)=>{
      avg.add(e.p)
      if(this.p.dist(e.p)<this.p.dist(closestfood)){
        closestfood = e.p.copy()
      }
      return avg
    },(new V(0,0)))
    return {COM:  sum.div(entities.length).sub(this.p).normalize(),
            f1:   closestfood.sub(this.p).normalize()
          }
  }
  activate(processedInputs) {
    var input = [];
    input.push(processedInputs.COM.x);
    input.push(processedInputs.COM.y);
    input.push(processedInputs.f1.x);
    input.push(processedInputs.f1.y);
    input.push(Math.random());
    input.push(Math.random());


    var output = this.network.activate(input);

    // var learningRate = .01;
    // var target = [Math.random(),Math.random()];
    // this.network.propagate(learningRate, target);
    return (new V(output[0]-0.5,output[1]-0.5).normalize())
  }

  move(a) {
    let aV = a.normalize()
    aV.div(1)
    this.v.add(aV)
    this.v.normalize()
    this.p.add(this.v)
  }

}


export {Creature}
export default Creature

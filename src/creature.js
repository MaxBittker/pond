import V from './vector.js';
import synaptic from 'synaptic'
import food from './food.js';


class Creature {
  constructor(x, y) {
    this.p = new V(x,y)
    this.v = (new V()).random()
    this.network = new synaptic.Architect.Perceptron(2, 25, 2);
    this.energy = 0;
  }

  get angle() {
    return this.v.angle();
  }

  tick(bounds,neighbors){
    this.energy*=.995
    let localFoodCOM = this.getCOM(neighbors).sub(this.p).normalize()
    //this.p.copy().add(this.getCOM(neighbors))

    var activation = this.activate(localFoodCOM)
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
        this.energy+=5;
      }
    })
  }
  getCOM(entities){
    if(entities.length===0){
      return (new V(0,0))
    }
    let sum = entities.reduce((avg,e)=>{
      avg.add(e.p)
      return avg
    },(new V(0,0)))
    return sum.div(entities.length)
  }
  activate(COM) {
    var input = [];
    input.push(COM.x);
    input.push(COM.y);
    // input.push(this.p.y);
    // input.push(this.p.x);

    var output = this.network.activate(input);


    var learningRate = .3;
    var target = [COM.x,COM.y];

    this.network.propagate(learningRate, target);
    return output
  }

  move([ax, ay]) {
  let aV = (new V(ax-.5, ay-.5)).normalize()
  // move(a) {
    // let aV = a.normalize()
    aV.div(9)
    this.v.add(aV)
    this.v.normalize()
    this.p.add(this.v)
  }

}


export {Creature}
export default Creature

import V from './vector.js';
import synaptic from 'synaptic'
let many = 0;
let sum = 0;


class Creature {
  constructor(x, y) {
    this.p = new V(x,y)
    this.v = (new V()).random()
    this.network = new synaptic.Architect.Perceptron(2, 25, 2);
  }

  get angle() {
    return this.v.angle();
  }

  tick(bounds,foods){
    var activation = this.activate()
    this.move(activation)
    this.wrap(bounds)
    // this.eat(foods)
  }
  eat(foods){
    var nf = foods.filter(f=>this.p.dist(f)>10)
    return nf
  }
  activate() {
    var input = [];
    // input.push(Math.random());
    // input.push(Math.random());
    input.push(this.p.y);
    input.push(this.p.x);

    var output = this.network.activate(input);


    var learningRate = .3;
    var target = [Math.random(),Math.random()];

    this.network.propagate(learningRate, target);
    return output
  }

  move([ax, ay]) {
    let aV = (new V(ax-.5, ay-.5)).normalize()
    aV.div(5)
    this.v.add(aV)
    this.v.normalize()
    this.p.add(this.v)
  }

  wrap({w,h}){
    const wr = (d,l) => (d+l) % l
    this.p.set(wr(this.p.x,w),wr(this.p.y,h))
  }
}


export {Creature}
export default Creature

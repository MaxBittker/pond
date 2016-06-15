import V from './vector.js';
import synaptic from 'synaptic'
import food from './food.js';


class Creature {
  constructor(p) {
    this.p = p
    this.v = (new V()).random()
    this.network = new synaptic.Architect.Perceptron(10, 24,24, 2);
    this.energy = 0;
    this.radius = 7
  }

  get angle() {
    return this.v.angle();
  }

  tick(bounds,{fBin,cBin}){
    // this.energy*=.995
    let processedInputs = this.getInputs({fBin,cBin})
    //this.p.copy().add(this.getInputs(neighbors))
    // debugger;
    let activation = this.activate(processedInputs)
    this.move(activation)
    this.p.wrap(bounds)
    this.eat(fBin)
  }
  eat(neighbors){
    neighbors.length
    let com = new V()
    neighbors.forEach(n=>{
      if(n instanceof food && this.p.dist(n.p) < this.radius){
        n.marked = true
        this.energy+=1;
      }
    })
  }

  getInputs({fBin,cBin}){
    let inputs = this.getFoodInputs(fBin)
    Object.assign(inputs, this.getCreatureInputs(cBin))
    return inputs
  }

  getCreatureInputs(creatures){
    if(creatures.length===0){
      return {c1p:new V(0,0),
              c1v:new V(0,0)}
    }
    let closestCreature = creatures.reduce((clostest,e)=>{
      if(this.p.dist(e.p)<this.p.dist(clostest.p)){
        return e
      }
      return clostest
    })
    return {c1p: closestCreature.p.copy().sub(this.p).normalize(),
            c1v:   closestCreature.v.copy().normalize()
          }
  }

  getFoodInputs(entities){
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

    input.push(processedInputs.c1p.x);
    input.push(processedInputs.c1p.y);
    input.push(processedInputs.c1v.x);
    input.push(processedInputs.c1v.y);

    input = input.map(i=>(i + 1) / 2)

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
    this.p.add(this.v.copy().mul(2))
  }
  getGenome () {
        var genome = [];
        this.network.neurons().forEach(function(o){
            for(var type in o.neuron.connections){
                if(type!=='projected') continue;
                var connection = o.neuron.connections[type];
                for(var id in connection){
                    var weight = connection[id].weight;
                    genome.push(weight);
                }
            }
            if(o.layer !== 'input') genome.push(o.neuron.selfconnection.weight);
        });
        return genome;
    }

    setGenome (genome) {
        var genome = genome.slice(0); //clone, TODO: find better solution, not efficient
        this.network.neurons().forEach(function(o){
            for(var type in o.neuron.connections){
                if(type!=='projected') continue;
                var connection = o.neuron.connections[type];
                for(var id in connection){
                    var c = connection[id];
                    var weight = genome.shift();
                    c.weight = weight;
                }
            }
            if(o.layer !== 'input') o.neuron.selfconnection.weight = genome.shift();
        });
        this.setColor()
    }
    setColor(){
      // this.getGenome().
    }

}


export {Creature}
export default Creature

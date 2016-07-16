import V from './vector.js';
import synaptic from 'synaptic'
import food from './food.js';

class Creature {
  constructor(p) {
    this.p = p
    this.v = (new V()).random()
    this.network = new synaptic.Architect.Perceptron(8, 20, 8, 2);
    this.energy = 0;
    this.radius = 6
    this.hue = 0;
    this.setColor()
  }

  get angle() {
    return this.v.angle();
  }

  tick(bounds,{fBin,cBin},speed){
    let packedInputs = this.getInputs({fBin,cBin},bounds)

    let activation = this.activate(packedInputs)
    this.move(activation,speed,bounds)
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
  getClosestWall(bounds){

     let wallpoints = [(new V(this.p.x,0)),
                       (new V(this.p.x,bounds.y)),
                       (new V(0,this.p.y)),
                       (new V(bounds.x,this.p.y))]

     let closestwall = wallpoints.reduce((min,wp)=>{
       if(this.p.dist(wp)<this.p.dist(min)){
         return wp
       }
       return min
     })
     return closestwall
  }

  getInputs({fBin,cBin},bounds){
    let inputs = this.getFoodInputs(fBin)
    Object.assign(inputs, this.getCreatureInputs(cBin))
    inputs.cw = this.getClosestWall(bounds).sub(this.p).normalize()
    inputs.wd = Math.min(this.getClosestWall(bounds).dist(this.p)/ (200),0.99)

    var packedInputs = [];
    packedInputs.push(inputs.COM.x);//0
    packedInputs.push(inputs.COM.y);//1
    packedInputs.push(inputs.f1.x);//2
    packedInputs.push(inputs.f1.y);//3
    packedInputs.push(inputs.f1d); //4
    //
    // packedInputs.push(inputs.c1p.x);
    // packedInputs.push(inputs.c1p.y);
    // packedInputs.push(inputs.c1v.x);
    // packedInputs.push(inputs.c1v.y);
    // packedInputs.push(inputs.c1d); //9

    packedInputs.push(inputs.cw.x) //5//10
    packedInputs.push(inputs.cw.y) //6//11
    packedInputs.push(inputs.wd) //7//12


    packedInputs = packedInputs.map(i=>(i + 1) / 2)
    // packedInputs.push(Math.random());

    return packedInputs
  }

  getCreatureInputs(creatures){
    if(creatures.length<2){
      return {c1p:new V(0,0),
              c1v:new V(0,0),
              c1d: 1.0}
    }
    let noSelf = creatures.filter(e=>e!==this)
    let closestCreature = noSelf.reduce((clostest,e)=>{
      if(this.p.dist(e.p)<this.p.dist(clostest.p)){
        return e
      }
      return clostest
    })
    return {c1p: closestCreature.p.copy().sub(this.p).normalize(),
            c1v: closestCreature.v.copy().normalize(),
            c1d: closestCreature.p.copy().sub(this.p).mag()/ 141
          }
  }
  getFoodInputs(entities){
    if(entities.length===0){
      return {COM:new V(0,0),
              f1:new V(0,0),
              f1d: 1.0}
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
            f1:   closestfood.copy().sub(this.p).normalize(),
            f1d:  closestfood.copy().sub(this.p).mag()/ (141)
          }
  }

  activate(packedInputs) {
    var output = this.network.activate(packedInputs);
    // var learningRate = .01;
    // var target = [Math.random(),Math.random()];
    // this.network.propagate(learningRate, target);
    return (new V(output[0]-0.5,output[1]-0.5).normalize())
  }

  move(a,d,bounds) {
    let aV = a.normalize()
    aV.div(2)
    this.v.add(aV)
    this.v.normalize()

    let nextP = this.p.copy().add(this.v.copy().mul(d))
    if(nextP.dist(this.getClosestWall(bounds))>this.radius){
      this.p = nextP
    }
    else {
      this.p = this.p.copy().add(this.v.copy().mul(d*-2))
    }
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
      let c = this.getGenome()
                .reduce((sum,w,i)=>sum + (Math.pow(1.04,i)*w),
                        0)
      this.hue = Math.abs((c / 500))|0
    }

}


export {Creature}
export default Creature

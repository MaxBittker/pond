import V from './vector.js';
import synaptic from 'synaptic'
import food from './food.js';


class P {
  constructor(p) {
    this.p = p
    this.radius = 25
  }

  tick(bounds,{fBin,cBin},speed){
    let processedInputs = this.getInputs({fBin,cBin})
    //this.p.copy().add(this.getInputs(neighbors))
    // debugger;
    let activation = this.activate(processedInputs)
    this.move(activation,speed)
    this.p.wrap(bounds)
    this.eat(fBin)
  }
  eat(neighbors){
    neighbors.length
    let com = new V()
    neighbors.forEach(n=>{
      if(n instanceof food && this.p.dist(n.p) < this.radius){
        n.marked = true
        this.foundfood+=1;
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


  move(a,d) {
    let aV = a.normalize()
    aV.div(1)
    this.v.add(aV)
    this.v.normalize()
    this.p.add(this.v.copy().mul(d))
  }


}


export {Creature}
export default Creature

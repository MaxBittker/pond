import V from './vector.js';
import synaptic from 'synaptic'
import creature from './creature.js';


const energyBounds = entities => {
  let max = entities.reduce((max,e)=>Math.max(max,e.energy),0)
  let min = entities.reduce((min,e)=>Math.min(min,e.energy),Infinity)
  return {max, min}
}


const nBest = (entities,n) => {
  entities.sort((a,b)=>b.energy-a.energy)
  let genString = entities.map((e,i)=>{
     let s= e.energy
    if(i===n){
      s+=">Cutoff>"
    }
    return s
  })
  console.log(genString.join("|"))
  return entities.slice(0,n)
}


const buildGeneration = (entities, randLoc, factor) => {
  let newborns =entities.map(e=>{
    let newborn = new creature(randLoc())
    newborn.setGenome(mutateGenome(e.getGenome(),factor))
    return newborn
  })
  return newborns
}

const mutateGenome = (genome, factor) => {
  let mutated = genome.map(weight=>{
    if(weight===undefined) return 0.0
    let mW =  weight+((Math.random()*factor) - (factor/2))
    mW = Math.max(mW, -.999999)
    mW = Math.min(mW, .999999)
    return mW
  })
    return mutated
}




export {energyBounds, nBest, buildGeneration}

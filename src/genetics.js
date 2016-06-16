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
  let crossovers = generateCrossovers(entities)

  let newborns =crossovers.map(genome=>{
    let newborn = new creature(randLoc())
    newborn.setGenome(genome)
    return newborn
  })
  return newborns
}

const generateCrossovers = (entities)=>{
  let crossovers = entities.map(e=>{
    return crossGenomes(e.getGenome(),
                        entities[0].getGenome(),
                        Math.random()*0.5)
  })
  return crossovers
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

const crossGenomes = (g1, g2, factor) => {
  let glength = g1.length
  let crossPoint = Math.random()*glength|0
  let newGenomes = [new Array(glength),new Array(glength)]

  for(var i =0; i<glength;i++){
      let l = 0;
      let r = 1;
      if(i<crossPoint){
        let l = 1;
        let r = 0;
      }
      newGenomes[l][i]= g1[i]
      newGenomes[r][i]= g1[i]
  }
  return mutateGenome(newGenomes[0],factor)
}




export {energyBounds, nBest, buildGeneration, generateCrossovers}

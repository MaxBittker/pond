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


const buildGeneration = (entities, randLoc, factor,snapshots) => {
  // let crossovers = generateCrossovers(entities)
  // let newborns =crossovers.map(genome=>{
  //   let newborn = new creature(randLoc())
  //   newborn.setGenome(genome)
  //   return newborn
  // })
    let asNewborns = distributeChildren(entities, entities.length,factor, randLoc)
    let PhenoNewborns = generatePhenoChildren(entities, entities.length, factor, randLoc, snapshots)

    return PhenoNewborns.concat(asNewborns)
}

const distributeChildren = (entities, c, factor, randLoc)=>{
  let minEnergy =energyBounds(entities).min
  let totalEnergy= entities.reduce((sum,e)=>sum+(e.energy - minEnergy),0)
  let ePc = totalEnergy /c

  let children = []
  let etoSpend = totalEnergy
  let i =0;
  while(totalEnergy>1){
    let eEngery = entities[i].energy - minEnergy
    while(eEngery>1){
      eEngery -= ePc
      let newborn = new creature(randLoc())
      newborn.setGenome(mutateGenome(entities[i].getGenome(),factor))
      children.push(newborn)
    }
    totalEnergy -= entities[i].energy - minEnergy
    i++
  }
  return children
}


// const generateCrossovers = (entities)=>{
//   let crossovers = entities.map(e=>{
//     return crossGenomes(e.getGenome(),
//                         entities[0].getGenome(),
//                         Math.random()*0.3)
//   })
//   return crossovers
// }

const generatePhenoChildren = (entities, c,factor, randLoc, snapshots)=>{
  let minEnergy = energyBounds(entities).min
  let totalEnergy= entities.reduce((sum,e)=>sum+(e.energy - minEnergy),0)
  let ePc = totalEnergy /c

  let children = []
  let etoSpend = totalEnergy
  let i =0;
  while(totalEnergy>1){
    let eEngery = entities[i].energy - minEnergy
    while(eEngery>1){
      eEngery -= ePc

      let newborn = new creature(randLoc())
      newborn.setGenome(entities[Math.random()*entities.length |0].getGenome())
      trainApprentice(entities[i], newborn, snapshots) //todo by reference?
      children.push(newborn)

    }
    totalEnergy -= entities[i].energy - minEnergy
    i++
  }
  return children
}

const trainApprentice = (teacher, apprentice, snapshots) => {
  snapshots.forEach(snap => {
    let target = teacher.network.activate(snap);
    let result = apprentice.network.activate(snap);
    var learningRate = .01;
    apprentice.network.propagate(learningRate, target);
  })

}
const mutateGenome = (genome, factor) => {
  let mutated = genome.map(weight=>{
    if(weight===undefined) return 0.0
    if(Math.random()>factor) return weight
    let mW =  weight+((Math.random()*factor) - (factor/2))
    mW = Math.max(mW, -.999999)
    mW = Math.min(mW, .999999)
    return mW
  })
    return mutated
}
//
// const crossGenomes = (g1, g2, factor) => {
//   let glength = g1.length
//   let crossPoint = Math.random()*glength|0
//   let newGenomes = [new Array(glength),new Array(glength)]
//
//   for(var i =0; i<glength;i++){
//       let l = 0;
//       let r = 1;
//       if(i<crossPoint){
//         let l = 1;
//         let r = 0;
//       }
//       newGenomes[l][i]= g1[i]
//       newGenomes[r][i]= g1[i]
//   }
//   return mutateGenome(newGenomes[0],factor)
// }




export {energyBounds, nBest, buildGeneration}

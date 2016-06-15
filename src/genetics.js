import V from './vector.js';
import synaptic from 'synaptic'


const energyBounds = entities => {
  let max = entities.reduce((max,e)=>Math.max(max,e.energy),0)
  let min = entities.reduce((min,e)=>Math.min(min,e.energy),Infinity)
  return {max, min}
}


const nBest = (entities,n) => {
  entities.sort((a,b)=>b.energy-a.energy)
  return entities.slice(0,n)
}


const nBest = (entities,n) => {
  entities.sort((a,b)=>b.energy-a.energy)
  return entities.slice(0,n)
}

const mutateGenom = (genome, factor) => {
  return genome.map(weight=>weight+Math.random()*factor)
}

export {energyBounds, nBest}

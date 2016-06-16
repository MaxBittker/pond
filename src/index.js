import world from './world.js';
import creature from './creature.js';
import food from './food.js';

import V from './vector.js';
import { energyBounds, nBest, buildGeneration } from './genetics.js';
import { render } from './render.js';
import {ui} from './ui.js';


let start = null;
let UI = new ui()


const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const {width, height} = ctx.canvas

let t = 1
let population = 50
let creatures = []
let foods = []
let foodMap = new world(width, height, 50)
let creatureMap = new world(width, height, 50)

const randomLoc = ()=>{
  return new V((0.0 + (1.0*Math.random()))*width,
               (0.0 + (1.0*Math.random()))*height)
}
const genFood = () =>  {
  return (new food(randomLoc()))
}

const everyNFrames = (n,callback)=>{
  if(t % n === 0){
    callback()
  }
}

const updateMap = (emap, entityArray) => {
  emap.initializeMap()
  emap.buildMap(entityArray)
}


for(var i=0; i<population ;i+=1){
  creatures.push(new creature(randomLoc()))
}
const step = ()=> {

    while(foods.length<100){
      foods.push(genFood())
    }
    updateMap(foodMap,foods)
    updateMap(creatureMap,creatures)

    const eBounds = energyBounds(creatures)
    let gTime = 1000000
    everyNFrames(gTime,()=>{
      let g = (t/gTime) |0
      UI.setGeneration(g)
      console.log("generation: " + g+ " f: " +(eBounds.max/ (eBounds.min+0.1)))
      creatures = nBest(creatures,(population/2)|0)
      creatures = creatures.concat(
                                    // buildGeneration(creatures,randomLoc,0.1),
                                    // buildGeneration(creatures,randomLoc,0.2),
                                    buildGeneration(creatures,randomLoc,0.3))
      creatures = creatures.map(c=>{c.energy = 0
                                    return c})
    })
    everyNFrames(UI.speed,()=>{
      render(ctx,creatures,foods,foodMap, eBounds)
    })

    creatures.forEach(c=>{
      let fBin = foodMap.getNeighbors(c.p)
      let cBin = creatureMap.getNeighbors(c.p)
      c.tick({x:width,y:height},{fBin, cBin},UI.speed>1? 2 : 1)
    })

    foods = foods.filter(f=>!f.marked)
}


const frame = (timestamp) => {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  for(var s =0; s<UI.speed;s++){
    step()
    t++;
  }
  window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

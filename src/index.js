import world from './world.js';
import creature from './creature.js';
import food from './food.js';

import V from './vector.js';
import { foundfoodBounds, nBest, buildGeneration } from './genetics.js';
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
let foodMap = new world(width, height, 25)
let creatureMap = new world(width, height, 25)

const randomLoc = ()=>{
  return new V((0.025 + (0.95*Math.random()))*width,
               (0.025 + (0.95*Math.random()))*height)
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


for(var i=0; i<100 ;i+=1){
  creatures.push(new creature(randomLoc()))
}
let gTime = 3000

const newGeneration = (eBounds)=>{
  let g = (t/gTime) |0
  UI.setGeneration(g)
  console.log("generation: " + g+ " f: " +(eBounds.max/ (eBounds.min+0.1)))
  creatures = nBest(creatures,(population/3)|0)
  console.log(creatures[0].getGenome())
  creatures = creatures.concat(
                                // buildGeneration(creatures,randomLoc,0.1),
                                // buildGeneration(creatures,randomLoc,0.2),
                                buildGeneration(creatures,randomLoc,0.3))
  creatures = creatures.map(c=>{c.foundfood = 0
                                return c})
}

const birthEvent = (eBounds)=>{
  creatures = nBest(creatures, (population - 1 | 0))
  // console.log(creatures[0].getGenome())
  creatures = creatures.concat(
    buildGeneration(creatures,
                    (population - creatures.length),
                    randomLoc,0.3))
  creatures = creatures.map(c=>{c.foundfood = 0
                                return c})
}

const step = ()=> {

    while(foods.length<500){
      foods.push(genFood())
    }
    foods[Math.random()*foods.length|0].marked = Math.random()>0.5
    updateMap(foodMap,foods)
    updateMap(creatureMap,creatures)

    const eBounds = foundfoodBounds(creatures)

    // everyNFrames(gTime,()=>newGeneration(eBounds))
    if(creatures.length < population * (3/4) ){
      birthEvent(eBounds)
    }
    if(UI.shouldNG()){
      newGeneration(eBounds)
    }

    creatures.forEach(c=>{
      let fBin = foodMap.getNeighbors(c.p)
      let cBin = creatureMap.getNeighbors(c.p)
      c.tick({x:width,y:height},{fBin, cBin},UI.speed>1? 2 : 1)
    })

    foods = foods.filter(f=>!f.marked)
    creatures = creatures.filter(f=>f.energy>0)


    everyNFrames(UI.speed,()=>{
      render(ctx,creatures,foods,foodMap, eBounds)
    })
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

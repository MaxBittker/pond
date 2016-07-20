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
c.onmousedown = e => {
  let p = new V(e.offsetX,e.offsetY)
  for(var i =0; i<8; i++){
    foods.push(new food(p.copy().mul(0.95).add(randomLoc().mul(0.05))))//.sub(randomLoc().mul(0.024))))
  }
  e.preventDefault()
}

let foodMap = new world(width, height, 50)
let creatureMap = new world(width, height, 50)

const randomLoc = ()=>{
  return new V((0.04 + (0.92*Math.random()))*width,
               (0.04 + (0.92*Math.random()))*height)
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
let deadFramesN = 0;
let lastGeneration = t;
let snapshots = []


const newGeneration = (eBounds)=>{
  deadFramesN = 0;
  lastGeneration = t;

  let g = (t/gTime) |0
  UI.incGeneration()
  console.log("generation: " + g+ " f: " +(eBounds.max/ (eBounds.min+0.1)))
  creatures = nBest(creatures,(population/3)|0)
  // console.log(creatures[0].getGenome())
  creatures = creatures.concat(buildGeneration(creatures,randomLoc,UI.mutationRate, snapshots))
  creatures = creatures.map(c=>{c.energy = 0; c.p = new V(width/2,height/2);return c})
  snapshots = []
}
const step = ()=> {

    while(foods.length<350){
      foods.push(genFood())
    }
    let foodRespawn = Math.random()>0.85
    foods[Math.random()*foods.length|0].marked = foodRespawn
    updateMap(foodMap,foods)
    updateMap(creatureMap,creatures)

    const eBounds = energyBounds(creatures)

    if(UI.shouldNG()|| deadFramesN>200|| ((t-lastGeneration)>gTime)){
      newGeneration(eBounds)
    }
    creatures.forEach((c,i)=>{
      let fBin = foodMap.getNeighbors(c.p)
      let cBin = creatureMap.getNeighbors(c.p)

      if(snapshots.length < 2500 && (t%50 === 25)){
        snapshots.push(c.getInputs({fBin, cBin}, {x:width,y:height}))
      }

      c.tick({x:width,y:height},{fBin, cBin},UI.speed>1? 2 : 1)
    })
    let foodsNum = foods.length
    foods = foods.filter(f=>!f.marked)
    if(foodsNum - foods.length<(foodRespawn? 2 : 1)){
      deadFramesN++
      // console.log(deadFramesN)
    } else {
      deadFramesN = 0;
    }
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

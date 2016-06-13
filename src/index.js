import world from './world.js';
import creature from './creature.js';
import food from './food.js';

import V from './vector.js';
import { render } from './render.js';
let start = null;



const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const {width, height} = ctx.canvas


let creatures = []
let foods = []


let W = new world(width, height, 25)

const genFood = () =>  {
  return (new food(Math.random()*width, Math.random()*height))
}

for(var i=0; i<50 ;i+=1){
  creatures.push(new creature(Math.random()*width,Math.random()*height))
  foods.push(genFood())
}



const step = ()=> {

    // foods.push(genFood())
    // foods.push(genFood())
    foods.push(genFood())
    foods.push(genFood())
    // foods.push(genFood())

    W.initializeMap()
    // W.buildMap(creatures.concat(foods))
    W.buildMap(foods)

    render(ctx,creatures,foods,W)
    // debugger
    creatures.forEach(c=>{
      let cBin = W.getNeighbors(c.p)
      c.tick({x:width,y:height},cBin)
    })

    foods = foods.filter(f=>!f.marked)
}






const frame = (timestamp) => {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  step()
  window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

import creature from './creature.js';
import world from './world.js';
import { render } from './render.js';
let start = null;



const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const {height, width} = ctx.canvas


let creatures = []
let foods = []

const genFood = () =>  {
  return {x:Math.random()*width,y:Math.random()*height}
}

for(var i=0; i<100 ;i+=2){
  creatures.push(new creature(Math.random()*width,Math.random()*height))
  foods.push(genFood())
}



const step = ()=> {
    foods.push(genFood())
    foods.push(genFood())
    foods.push(genFood())
    foods.push(genFood())
    foods.push(genFood())
    
    render(ctx,creatures,foods)
    creatures.forEach(c=>{
      foods = c.eat(foods)
      c.tick({w:width,h:height})
    })
}






const frame = (timestamp) => {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  step()
  window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

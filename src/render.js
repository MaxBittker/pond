import husl from 'husl'
const render = (ctx, creatures, foods, world, {max: maxEnergy, min: minEnergy}) => {
  const {height, width} = ctx.canvas

  for(let x = 0; x < world.maxTiles.x; x+=1){
    for(let y = 0; y < world.maxTiles.y; y+=1){
      let bin = world.tiles[x][y]
      if(bin!==undefined){
        ctx.fillStyle = `hsla(${180+(bin.length*10)},30%,30%,0.2)`
      }
      else
        ctx.fillStyle = `hsla(180,30%,30%,0.2)`

      ctx.fillRect(x*world.tileSize,y*world.tileSize,world.tileSize,world.tileSize);
    }
  }
  const sweep = Math.PI/1.6;
  ctx.lineWidth=0.2;

  ctx.strokeStyle = "#daa"
  ctx.fillStyle = "#afa";
  foods.forEach(e=>{
    ctx.beginPath();
    ctx.arc(e.p.x|0,e.p.y|0, 2 + 0.5*Math.random(), 0, Math.PI*2);
    ctx.stroke()
  })
  // ctx.fill();
  ctx.lineWidth=1.7;
  ctx.strokeStyle = "#aad"
  creatures.forEach(e=>{
    ctx.beginPath();
    let fitness = Math.max(Math.min((e.energy - minEnergy)/ (maxEnergy-minEnergy),1),0.1)
    ctx.fillStyle = husl.toHex((e.hue|0), (fitness*99)|0, 60)
    // try{}
    // catch(a){
      // debugger
    // }
    // `hsl(${e.hue},${fitness*99}%,50%)`
    ctx.arc(e.p.x|0,e.p.y|0, e.radius, e.angle - sweep, e.angle +sweep);
    ctx.stroke()
    ctx.fill();
  })



}

export {render}

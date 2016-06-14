
const render = (ctx, creatures, foods, world) => {
  const {height, width} = ctx.canvas
  const  grd = ctx.createLinearGradient(0,0,width,height);
  grd.addColorStop(0,'#baf');
  grd.addColorStop(.5,"#bbe");
  grd.addColorStop(1,'#abf');

  // Fill with gradient
  ctx.fillStyle = grd;
  // ctx.fillRect(0,0,width,height);

  for(let x = 0; x < world.maxTiles.x; x+=1){
    for(let y = 0; y < world.maxTiles.y; y+=1){
      let bin = world.tiles[x][y]
      if(bin!==undefined){
        ctx.fillStyle = `hsl(${180+(bin.length*10)},30%,30%)`
      }
      else
        ctx.fillStyle = `hsl(180,30%,30%)`

      ctx.fillRect(x*world.tileSize,y*world.tileSize,world.tileSize,world.tileSize);
    }
  }


  const sweep = Math.PI/1.6;
  ctx.lineWidth=0.8;

  ctx.strokeStyle = "#daa"
  ctx.fillStyle = "#afa";
  foods.forEach(e=>{
    ctx.beginPath();
    ctx.arc(e.p.x,e.p.y, 2 + 0.5*Math.random(), 0, Math.PI*2);
    ctx.stroke()
  })
  // ctx.fill();

  ctx.strokeStyle = "#0a0"
  creatures.forEach(e=>{
    ctx.beginPath();
    ctx.fillStyle = `hsl(10,${e.energy}%,50%)`;
    ctx.arc(e.p.x,e.p.y, 10+ 0.5*Math.random(), e.angle - sweep, e.angle +sweep);
    ctx.stroke()
    ctx.fill();
  })



}

export {render}

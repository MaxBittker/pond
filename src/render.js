
const render = (ctx, creatures, foods) => {
  const {height, width} = ctx.canvas
  const  grd = ctx.createLinearGradient(0,0,width,height);
  grd.addColorStop(0,'#baf');
  grd.addColorStop(.5,"#bbe");
  grd.addColorStop(1,'#abf');

  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,width,height);

  const sweep = Math.PI/1.6;

  ctx.fillStyle = "#afa";
  ctx.strokeStyle = "#daa"
  foods.forEach(e=>{
    ctx.beginPath();
    ctx.arc(e.x,e.y, 2 + 0.5*Math.random(), 0, Math.PI*2);
    ctx.stroke()
    ctx.fill();
  })

  ctx.fillStyle = "#faa";
  ctx.strokeStyle = "#3a3"
  creatures.forEach(e=>{
    ctx.beginPath();
    ctx.arc(e.p.x,e.p.y, 10+ 0.5*Math.random(), e.angle - sweep, e.angle +sweep);
    ctx.stroke()
    ctx.fill();
  })



}

export {render}

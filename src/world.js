import V from './vector.js';
import synaptic from 'synaptic'


class World {
  constructor(width, height, tileSize) {
    this.worldsize = new V(width,height)
    this.tileSize = tileSize
    this.maxTiles = new V(this.worldsize.x/tileSize|0,
                          this.worldsize.y/tileSize|0)
    this.tiles = this.initializeMap()
  }
  initializeMap(){
    this.tiles = new Array(this.maxTiles.x)
    for(let x = 0; x < this.maxTiles.x; x+=1){
      this.tiles[x] = new Array(this.maxTiles.y)
    }
  }
  hashLoc(p){
    let hx = (p.x / this.tileSize)|0
    let hy = (p.y / this.tileSize)|0
    return (new V(hx,hy))
  }
  getBin(p,prehashed){
    let hp = this.hashLoc(p)
    if (prehashed === true){
      hp = p
    }
    let bin = this.tiles[hp.x][hp.y]
    if(bin!==undefined)
      return bin
    return []
  }
  getNeighbors(p){
    let hp = this.hashLoc(p)
    let neighbors = []
    for(var dx = -1; dx<=1; dx++){
      for(var dy = -1; dy<=1; dy++){
        let np = hp.copy().add(new V(dx,dy)).wrap(this.maxTiles)
        let nBin = this.getBin(np,true)
        neighbors = neighbors.concat(nBin)
      }
    }
    return neighbors
  }
  buildMap(entities) {
    for(let e of entities){
      let hp = this.hashLoc(e.p)
      if(this.tiles[hp.x][hp.y] === undefined)
        this.tiles[hp.x][hp.y] = [e]
      else
        this.tiles[hp.x][hp.y].push(e)
    }
  }

}


export {World}
export default World

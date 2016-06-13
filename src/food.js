import V from './vector.js';


class food {
  constructor(x, y) {
    this.p = new V(x,y)
    this.marked = false
  }
}


export {food}
export default food

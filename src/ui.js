

class ui {
  constructor() {
    this.speedSlider = document.getElementById("speed")
    this.generation = document.getElementById("generation")
    this.triggerG = document.getElementById("triggerG")
    this.newG = false
    this.speed = this.getSpeed()

    this.speedSlider.addEventListener("input", () => {
      this.speed = this.getSpeed()
    })
    this.triggerG.addEventListener("click", () => {
      this.newG = true
    })
  }
  setGeneration(g){
      this.generation.innerHTML = g.toString()
  }
  getSpeed(){
    return this.shapeSpeed(this.speedSlider.valueAsNumber)
  }
  shapeSpeed(raw){
    return (Math.pow((raw/10),2.0)|0)+1
  }
  shouldNG(){
      let ng = this.newG
      this.newG = false
      return ng
  }

}


export {ui}
export default ui

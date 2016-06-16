

class ui {
  constructor() {
    this.speedSlider = document.getElementById("speed")
    this.generation = document.getElementById("generation")

    this.speed = this.getSpeed()
    this.speedSlider.addEventListener("input", () => {
      this.speed = this.getSpeed()
    })
  }
  setGeneration(g){
      this.generation.innerHTML = g.toString()
  }
  getSpeed(){
    return this.shapeSpeed(this.speedSlider.valueAsNumber)
  }
  shapeSpeed(raw){
    return (Math.pow((raw/10),1.5)|0)+1
  }

}


export {ui}
export default ui

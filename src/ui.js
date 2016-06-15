

class ui {
  constructor() {
    this.speedSlider = document.getElementById("speed")
    this.speed = this.getSpeed()
    this.speedSlider.addEventListener("input", () => {
      this.speed = this.getSpeed()
    })
  }
  getSpeed(){
    return this.shapeSpeed(this.speedSlider.valueAsNumber)
  }
  shapeSpeed(raw){
    return (Math.pow((raw/10),2)|0)+1
  }

}


export {ui}
export default ui

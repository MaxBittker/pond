

class ui {
  constructor() {
    this.speedSlider = document.getElementById("speed")
    this.mutationSlider = document.getElementById("mutation")
    this.generation = document.getElementById("generation")
    this.mrElement = document.getElementById("mr")
    this.triggerG = document.getElementById("triggerG")
    this.newG = false
    this.speed = this.getSpeed()
    this.mutationRate = this.getMutation()
    this.g = 0
    this.speedSlider.addEventListener("input", () => {
      this.speed = this.getSpeed()
    })
    this.mutationSlider.addEventListener("input", () => {
      this.mutationRate = this.getMutation()
    })
    this.triggerG.addEventListener("click", () => {
      this.newG = true
    })
  }
  incGeneration(){
    this.g++
    this.generation.innerHTML = this.g.toString()
  }
  getSpeed(){
    return this.shapeSpeed(this.speedSlider.valueAsNumber)
  }
  getMutation(){
    let rate = (this.mutationSlider.valueAsNumber)/100
    let rateAsText = "Low"
    if(rate>0.2)rateAsText = "Moderate"
    if(rate>0.5)rateAsText = "High"
    if(rate>0.8)rateAsText = "Extreme"
    this.mrElement.innerHTML = rateAsText
    return rate
  }
  shapeSpeed(raw){
    return (Math.pow((raw/10),1.6)|0)+1
  }
  shouldNG(){
      let ng = this.newG
      this.newG = false
      return ng
  }

}


export {ui}
export default ui

import "./style.css";
class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    // 로직

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientHeight;
    this.stageHeight = document.body.clientWidth;

    // 더블 사이즈로 해야지 레티나 디스플레이에서 잘보임
    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.context.scale(2, 2);
  }

  animate() {
    this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};

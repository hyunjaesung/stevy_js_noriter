import { Ball } from "./ball";
import { Block } from "./block";
import "./styles.css";
class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.ball = new Ball(this.stageWidth, this.stageHeight, 60, 5);
    this.block = new Block(700, 30, 300, 450);

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientHeight;
    this.stageHeight = document.body.clientWidth;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    this.context.scale(2, 2);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.block.draw(this.context);
    this.ball.draw(this.context, this.stageWidth, this.stageHeight, this.block);
  }
}

window.onload = () => {
  new App();
};

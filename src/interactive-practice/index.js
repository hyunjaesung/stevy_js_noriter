import "./style.css";
import { WaveGroup } from "./WaveGroup";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    this.waveGroup = new WaveGroup();

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientHeight;
    this.stageHeight = document.body.clientWidth;

    // 더블 사이즈로 해야지 레티나 디스플레이에서 잘보임
    // 레티나 디스플레이는 보통 디스플레이보다 픽셀 개수가 4배나 많음 (면적 기준. 가로 2배 * 세로 2배)
    // 따라서 캔버스의 픽셀 사이즈를 가로 세로 각각 2배씩 늘려주고, 캔버스 내부 컨텍스트의 크기를 2배로 확대시키면
    // 레티나 디스플레이에서 작게 보이는 현상이 없어짐.
    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.context.scale(2, 2);

    this.waveGroup.resize(this.stageWidth, this.stageHeight);
  }

  animate() {
    this.context.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.waveGroup.draw(this.context);
    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};

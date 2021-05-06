import { Wave } from "./Wave";

export class WaveGroup {
  constructor() {
    this.totalWaves = 3;
    this.totalPoints = 5;

    this.color = [
      "rgba(102,51,204,0.4)",
      "rgba(0,220,342,0.4)",
      "rgba(0,200,323,0.4)",
    ];

    this.waves = [];

    for (let i = 0; i < this.totalWaves; i++) {
      const wave = new Wave(i, this.totalPoints, this.color[i]);
      this.waves.push(wave);
    }
  }

  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      this.waves[i].resize(stageWidth, stageHeight);
    }
  }

  draw(context) {
    for (let i = 0; i < this.totalWaves; i++) {
      this.waves[i].draw(context);
    }
  }
}

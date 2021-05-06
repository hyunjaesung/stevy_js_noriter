import { Point } from "./Point";

export class Wave {
  constructor(index, totalPoints, color) {
    this.index = index;
    this.totalPoints = totalPoints;
    this.color = color;
    this.points = [];
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    // 화면 중간 값 가져오기
    // this.centerX = stageWidth / 2;
    this.centerY = stageHeight / 2;
    this.pointGap = this.stageWidth / (this.totalPoints - 1);
    this.init();
  }

  init() {
    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point(this.index + i, this.pointGap * i, this.centerY);
      this.points.push(point);
    }
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;

    let prevX = this.points[0].x;
    let prevY = this.points[0].y;

    context.moveTo(prevX, prevY);

    for (let i = 1; i < this.totalPoints; i++) {
      if (i < this.totalPoints - 1) {
        // 첫번째랑 마지막 포인트는 멈춰있도록
        this.points[i].update();
      }

      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;

      // 선을 그릴때 지금 값과 이전 값의 중간 값을 적어 줘야지 부드러운 곡선 만들수 있다
      //   context.lineTo(cx,cy);
      context.quadraticCurveTo(prevX, prevY, cx, cy);

      //   context.arc(prevX, prevY, 35, 0, 2 * Math.PI); // Start point
      //   context.arc(cx, cy, 15, 0, 2 * Math.PI); // End point

      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    context.lineTo(prevX, prevY);
    context.lineTo(this.stageWidth, this.stageHeight);
    context.lineTo(this.points[0].x, this.stageHeight);
    context.fill();
    context.closePath();
  }
}

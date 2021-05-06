export class Point {
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.1;
    this.current = index; // index를 넘겨서 몇번째 포인트인지 정의
    this.max = Math.random() * 100 + 150;
  }

  update() {
    this.current += this.speed;

    // sin 함수로 위아래 좌표 번화
    // sin은 -1 과 1 왔다갔다 cos 도 된다
    this.y = this.fixedY + Math.cos(this.current) * this.max;
    // this.y = this.fixedY + this.current * this.max;
  }
}

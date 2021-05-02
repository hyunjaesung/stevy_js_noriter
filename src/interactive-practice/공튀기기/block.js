export const Block = class {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.maxX = width + x;
    this.maxY = height + y;
  }

  draw(context) {
    const xGap = 70;
    const yGap = 60;

    context.fillStyle = "#ff384e";
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fill();

    context.fillStyle = "orange";
    context.beginPath();
    context.moveTo(this.maxX, this.maxY);
    context.lineTo(this.maxX - xGap, this.maxY + yGap);
    context.lineTo(this.x - xGap, this.maxY + yGap);
    context.lineTo(this.x, this.maxY);
    context.fill();

    context.fillStyle = "#9d0919";
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.maxY);
    context.lineTo(this.x - xGap, this.maxY + yGap);
    context.lineTo(this.x - xGap, this.y + yGap);
    context.fill();
  }
};

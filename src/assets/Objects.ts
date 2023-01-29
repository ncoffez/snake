class Field {
  x: number = 0;
  y: number = 0;
  field() {
    return this.y * 25 + this.x;
  }
  constructor(x: number, y: number) {
    (this.x = x), (this.y = y);
  }
}

class Snake extends Field {
  length: number = 1;
  direction: 'left' | 'right' | 'bottom' | 'top' = 'right';
  tail: Field[] = [];
  move() {
    if (this.length > 1) {
      this.tail = [...this.tail.slice(1), new Field(this.x, this.y)];
    }
    if (this.direction === 'left') this.x--;
    if (this.direction === 'right') this.x++;
    if (this.direction === 'top') this.y--;
    if (this.direction === 'bottom') this.y++;
  }
  alive: boolean = true;
  reset() {
    this.x = Math.floor(25 * 0.15);
    this.y = Math.floor(25 * 0.5);
    this.length = 1;
    this.direction = 'right';
  }
  eat() {
    if (this.length >= 25 * 25) return "gameIsWon";
    this.length++;
    this.tail = [...this.tail, new Field(this.x, this.y)];
  }
  constructor() {
    super(Math.floor(25 * 0.15), Math.floor(25 * 0.5));
  }
}

class Food extends Field {
  next(busy: Field[]) {
    let nextField: Field;
    do {
      nextField = new Field(Math.floor(Math.random() * 25), Math.floor(Math.random() * 25));
    } while (busy.some(field => field.field() === nextField.field()))
    this.x = Math.floor(Math.random() * 25);
    this.y = Math.floor(Math.random() * 25);
  }

  constructor() {
    super(Math.floor(Math.random() * 25), Math.floor(Math.random() * 25));
  }
}



export { Snake, Food, Field };

class Group {
  add(value) {
    if (!this.has(value)) {
      this.members.push(value);
    }
  }
  delete(value) {
    this.members = this.members.filter((v) => v !== value);
  }
  has(value) {
    return this.members.includes(value);
  }
  static from(iterable) {
    let group = new Group();
    for (let value of iterable) {
      group.add(value);
    }
    return group;
  }
  constructor() {
    this.members = [];
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index >= this.members.length) {
          return { done: true };
        } else {
          let value = this.members[index];
          index++;
          return { value, done: false };
        }
      },
    };
  }
}

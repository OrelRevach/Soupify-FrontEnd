export default class List {
  constructor(items) {
    this.items = items;
  }

  add(item) {
    const index = this.items.indexOf(item);
    if (index === -1) this.items.push(item);
  }

  remove(item) {
    const index = this.items.indexOf(item);
    if (index > -1) this.items.splice(index, 1);
  }

  clear() {
    this.items = [];
  }
}

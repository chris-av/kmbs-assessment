const LinkedList = require('./LinkedList');

describe("test LinkedList", () => {
  test("test that head and tail are the same on first node", () => {
    const list = new LinkedList({ x: 0, y: 1 });
    expect(list.head.stringify()).toEqual(list.tail.stringify());
    list.add({ x: 0, y: 2 })
    expect(list.head.stringify()).not.toEqual(list.tail.stringify());
  });
  test("test that we can grab the tail at any point in time", () => {
    const list = new LinkedList({ x: 0, y: 0 }).add({ x: 0, y: 1 });
    expect(list.tail.stringify()).toEqual("01")
    list.add({ x: 1, y: 1 }).add({ x: 2, y: 1 }).add({ x: 2, y: 2 });
    expect(list.tail.stringify()).toEqual("22");
  });
  test("cannot add the same node twice", () => {
    const list = new LinkedList({ x: 0, y: 0 }).add({ x: 0, y: 1 })
    expect(() => {
      list.add({ x: 0, y: 0 });
    }).toThrow();
    expect(() => {
      const list = new LinkedList({ x: 0, y: 0 });
      list.add({ x: 0, y: 0 });
    }).toThrow();
  });
});

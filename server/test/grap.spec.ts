import { findPath, Edge } from "../src/utils/graph";

describe("Graph - Find Path", () => {
  it("should return true if there is a path between a and d", async () => {
    const edges: Edge[] = [
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd'],
      ['f', 'g'],
      ['g', 'h'],
      ['h', 'k'],
    ];

    const path = findPath(edges, 'a', 'd');
    expect(path).toEqual(true);
  });

  it("should return false if there is no path between a and d", async () => {
    const edges: Edge[] = [
      ['a', 'b'],
      ['c', 'd'],
    ];

    const path = findPath(edges, 'a', 'd');
    expect(path).toEqual(false);
  });

  it("should return true if there is path between a and d, no matter the order", async () => {
    const edges: Edge[] = [
      ['a', 'b'],
      ['c', 'b'],
      ['d', 'c'],
    ];

    const path = findPath(edges, 'a', 'd');
    expect(path).toEqual(true);
  });

});

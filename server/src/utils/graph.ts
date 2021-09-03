export type Edge = [string, string];
type Neighbors = { [key: string]: Set<string> };

function precalcNeighbors(edges: Edge[]): Neighbors {
  return edges.reduce(
    (acc: Neighbors, [a, b]) => {
      acc[a] = (acc[a] || new Set()).add(b);
      acc[b] = (acc[b] || new Set()).add(a);

      return acc;
    },
    {},
  );
}

export function findPath(edges: Edge[], from: string, to: string) {
  if (!edges.length) {
    return false;
  }

  const neighborsHash = precalcNeighbors(edges);
  const visited = { [from]: true };
  const queue = [from];

  while (!!queue.length) {
    const vertex = queue.shift();

    if (!vertex) {
      return false;
    }

    if (vertex === to) {
      return true;
    }

    const neighbors = neighborsHash[vertex] || new Set();
    for (let neighbor of neighbors) {
      if (neighbor === to) {
        return true;
      }

      if (!visited[neighbor]) {
        queue.push(neighbor);
        visited[neighbor] = true;
      }
    }
  }

  return false;
}

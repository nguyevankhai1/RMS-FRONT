interface Config {
  id: string;
  parentId: string;
  name: string;
  childs: string;
}

const useTree = (list: any[], configs?: Partial<Config>) => {
  const defaultConfig: Config = {
    id: "id",
    parentId: "parentId",
    name: "name",
    childs: "childs",
  };

  list = deepCopy(list) as any[]
  const { id, parentId, name, childs } = { ...defaultConfig, ...configs };
  var map: any = {},
    node,
    roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i][id]] = i; // initialize the map
    list[i][childs] = []; // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];

    node.label = node[name];
    node.id = node[id];
    if (
      node[parentId] != undefined &&
      node[parentId] != "0" &&
      list[map[node[parentId]]] != undefined
    ) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node[parentId]]][childs].push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};
export default useTree;

const recursion = (index: number, input: any[], output: any[]) => {
  if(index >= input.length) return;
  if( input[index].children &&  input[index].children.length > 0) {
    const {children, ...rest} = input[index]
    output.push(rest)
    recursion(0, children, output)
  } else {
    const {children, ...rest} = input[index];
    output.push(rest)
  }

  recursion(index + 1, input, output)
}

export const useFlatTreeItems = (list: any[], configs?:  Partial<Config>) => {
  let output: any[] = []
  recursion(0, list, output);
  
  const flatArray = output.reduce((acc, current) => {
    const x = acc.find((item: any) => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return flatArray;
}
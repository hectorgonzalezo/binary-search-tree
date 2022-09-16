class Node {
  constructor(value, leftChild = null, rightChild = null) {
    this.value = value;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

class Tree {
  #root;
  constructor(array = []) {
    // Makes tree right away with unput array
    this.array = this.buildTree(array);
  }

  #removeDuplicates(array) {
    const set = new Set(array);
    return Array.from(set);
  }

  // Recursive function, called by buildTree
  #build(array) {
    if (array.length < 1) {
      return null;
    } else {
      const end = array.length - 1;
      const midPoint = Math.ceil(end / 2);
      const leftHalf = array.slice(0, midPoint);
      const rightHalf = array.slice(midPoint + 1);
      // Create Node
      const newNode = new Node(array[midPoint]);
      // Add children
      newNode.leftChild = this.#build(leftHalf);
      newNode.rightChild = this.#build(rightHalf);

      return newNode;
    }
  }

  // Makes a new tree.
  buildTree(array) {
    //sort  and remove duplicates from array;
    const sortedArray = array.sort((a, b) => a - b);
    const uniqueArray = this.#removeDuplicates(sortedArray);

    this.#root = this.#build(uniqueArray, 0, uniqueArray.length - 1);

    return this.#root;
  }

  prettyPrint(node = this.#root, prefix = "", isLeft = true) {
    if (node.rightChild !== null) {
      this.prettyPrint(
        node.rightChild,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.leftChild !== null) {
      this.prettyPrint(
        node.leftChild,
        `${prefix}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }

  find(value) {
    let currentNode = this.#root;
    while (currentNode.value !== value) {
      if (currentNode.rightChild === null && currentNode.leftChild === null) {
        currentNode = -1;
        break;
      }
      if (currentNode.value > value) {
        currentNode = currentNode.leftChild;
      } else {
        currentNode = currentNode.rightChild;
      }
    }
    return currentNode;
  }

  // Adds a value to tree
  insert(value, node = this.#root) {
    // recursive case
    if (node.value > value) {
      // Base case of recurssion
      if (node.leftChild === null) {
        // Add as child if we reached the end.
        node.leftChild = new Node(value);
        return;
      }
      this.insert(value, node.leftChild);
    } else if (node.value < value) {
      // Base case of recurssion
      if (node.rightChild === null) {
        node.rightChild = new Node(value);
        return;
      }
      this.insert(value, node.rightChild);
    } else if (node.value === value) {
      console.log(`${value} already exists in tree`);
    }
  }

  delete(value, node = this.#root) {
    if(node === null){
        console.log(`No ${value} exists in tree`);
    }
    let nodeToDelete;
    let side;
    // All of these are base cases
    // value is on left
    if (node.leftChild != null && node.leftChild.value === value) {
      nodeToDelete = node.leftChild;
      side = 'leftChild'
    } else if (node.rightChild != null && node.rightChild.value === value) {
      nodeToDelete = node.rightChild;
      side = 'rightChild';
    } else if(node.value === value){
        nodeToDelete = node
    }

    // If value is either in the left or rightside
    if (nodeToDelete !== undefined) {
      // If its found and has no children, simply delete it;
      // Case 1
      if (nodeToDelete.leftChild === null && nodeToDelete.rightChild === null) {
        node[side] = null;
        return;
      }

      // Case 2
      // If it has a single child, put it in the original's place
      if (nodeToDelete.leftChild !== null && nodeToDelete.rightChild === null) {
        node[side] = nodeToDelete.leftChild;
        return;
      } else if (nodeToDelete.rightChild !== null && nodeToDelete.leftChild === null) {
        node[side] = nodeToDelete.rightChild;
        return;
      }

      // Case 3
      // If it has two children
        // Find the next biggest item, it's in the leftmost position of its right subtree
    let nodeBeforeBiggest;
    let nextBiggest = nodeToDelete.rightChild;
    while(nextBiggest.leftChild !== null){
        nodeBeforeBiggest = nextBiggest
        nextBiggest = nextBiggest.leftChild
    }

        // If it has no children, 
        if(nextBiggest.rightChild === null){
            
          //switch it with the original
          const original = {...nodeToDelete}
          
          if(nodeToDelete === this.#root){
            this.#root = {...nextBiggest};
            this.#root.rightChild = original.rightChild;
            this.#root.leftChild = original.leftChild;
        } else {
          node[side] = {...nextBiggest};
          node[side].rightChild = original.rightChild;
          node[side].leftChild = original.leftChild
        }
          
          // Add null instead
          nodeBeforeBiggest.leftChild = null
          return
        }

        // It it has a right subtree
          //switch it with the original
          const original = nodeToDelete
          
          if(nodeToDelete === this.#root){
            this.#root = {...nextBiggest};
            this.#root.rightChild = original.rightChild;
            this.#root.leftChild = original.leftChild;
        } else {
          node[side] = {...nextBiggest};
          node[side].rightChild = original.rightChild;
          node[side].leftChild = original.leftChild
        }
          // Add children instead instead
          nodeBeforeBiggest.leftChild= nextBiggest.rightChild;
          return
    }

    // Recursive case
    if (node.value > value) {
      this.delete(value, node.leftChild);
    } else if (node.value < value) {
      this.delete(value, node.rightChild);
    }
  }

  get root() {
    return this.#root;
  }
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

// tree.buildTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

tree.insert(6);

tree.prettyPrint();
console.log("");

tree.delete(23);

tree.prettyPrint();

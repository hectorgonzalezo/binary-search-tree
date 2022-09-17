class Node {
  constructor(value, leftChild = null, rightChild = null) {
    this.value = value;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

class Tree {
  #root;
  #queue = [this.#root];
  #nodesArray = [];
  constructor(array = []) {
    // Makes tree right away with unput array
    this.array = this.buildTree(array);
  }

  // This is used as the default callback function by levelOrder
  #addToNodesArray(node) {
    this.#nodesArray.push(node.value);
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
    if (node === null) {
      console.log(`No ${value} exists in tree`);
    }
    let nodeToDelete;
    let side;
    // All of these are base cases
    // value is on left
    if (node.leftChild != null && node.leftChild.value === value) {
      nodeToDelete = node.leftChild;
      side = "leftChild";
    } else if (node.rightChild != null && node.rightChild.value === value) {
      nodeToDelete = node.rightChild;
      side = "rightChild";
    } else if (node.value === value) {
      nodeToDelete = node;
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
      } else if (
        nodeToDelete.rightChild !== null &&
        nodeToDelete.leftChild === null
      ) {
        node[side] = nodeToDelete.rightChild;
        return;
      }

      // Case 3
      // If it has two children
      // Find the next biggest item, it's in the leftmost position of its right subtree
      let nodeBeforeBiggest;
      let nextBiggest = nodeToDelete.rightChild;
      while (nextBiggest.leftChild !== null) {
        nodeBeforeBiggest = nextBiggest;
        nextBiggest = nextBiggest.leftChild;
      }

      // If it has no children,
      if (nextBiggest.rightChild === null) {
        //switch it with the original
        const original = { ...nodeToDelete };

        if (nodeToDelete === this.#root) {
          this.#root = { ...nextBiggest };
          this.#root.rightChild = original.rightChild;
          this.#root.leftChild = original.leftChild;
        } else {
          node[side] = { ...nextBiggest };
          node[side].rightChild = original.rightChild;
          node[side].leftChild = original.leftChild;
        }

        // Add null instead
        nodeBeforeBiggest.leftChild = null;
        return;
      }

      // It it has a right subtree
      //switch it with the original
      const original = nodeToDelete;

      if (nodeToDelete === this.#root) {
        this.#root = { ...nextBiggest };
        this.#root.rightChild = original.rightChild;
        this.#root.leftChild = original.leftChild;
      } else {
        node[side] = { ...nextBiggest };
        node[side].rightChild = original.rightChild;
        node[side].leftChild = original.leftChild;
      }
      // Add children instead instead
      nodeBeforeBiggest.leftChild = nextBiggest.rightChild;
      return;
    }

    // Recursive case
    if (node.value > value) {
      this.delete(value, node.leftChild);
    } else if (node.value < value) {
      this.delete(value, node.rightChild);
    }
  }

  // Runs callback function with every node in tree, in breadth-first order
  // If no callback if provided, add every node to array
  // and then print the result
  levelOrder(callback = this.#addToNodesArray, node = this.#root) {
    // Enqueue both children
    if (node.leftChild !== null) {
      this.#queue.push(node.leftChild);
    }
    if (node.rightChild !== null) {
      this.#queue.push(node.rightChild);
    }

    // Dequeue self
    this.#queue.shift();

    callback.call(this, node);

    // Base case
    if (this.#queue.length < 1) {
      // Restart queue
      this.#queue.push(this.#root);
      // Print array with Nodes if not provided with callback function
      if (callback === this.#addToNodesArray) {
        const arrayCopy = [...this.#nodesArray]
        this.#nodesArray = []
        return arrayCopy
      }
    } else {
      // if theres anything in the queue, call it
      return this.levelOrder(callback, this.#queue[0]);
    }
  }

  // Traverse the tree in depth-first order
  // run callback function with Node
  inorder(callback = this.#addToNodesArray, node = this.#root) {
    // Left Subtree
    if (node.leftChild !== null) {
      this.inorder(callback, node.leftChild);
    }

    // root
    callback.call(this, node);

    // Right Subtree
    if (node.rightChild !== null) {
      this.inorder(callback, node.rightChild);
    }

    if(callback === this.#addToNodesArray && node === this.#root){
        const arrayCopy = [...this.#nodesArray]
        this.#nodesArray = []
        return arrayCopy
    }

    return;

  }

  preorder(callback = this.#addToNodesArray, node = this.#root) {
    // root
    callback.call(this, node);

    // Left Subtree
    if (node.leftChild !== null) {
      this.preorder(callback, node.leftChild);
    }

    // Right Subtree
    if (node.rightChild !== null) {
      this.preorder(callback, node.rightChild);
    }

    if(callback === this.#addToNodesArray && node === this.#root){
        const arrayCopy = [...this.#nodesArray]
        this.#nodesArray = []
        return arrayCopy
    }

    return;
  }

  postorder(callback = this.#addToNodesArray, node = this.#root) {
    // Left Subtree
    if (node.leftChild !== null) {
      this.postorder(callback, node.leftChild);
    }

    // Right Subtree
    if (node.rightChild !== null) {
      this.postorder(callback, node.rightChild);
    }

    // root
    callback.call(this, node);

    if(callback === this.#addToNodesArray && node === this.#root){
        const arrayCopy = [...this.#nodesArray]
        this.#nodesArray = []
        return arrayCopy
    }

    return;
  }

  #findHeight(node){
    if(node.leftChild === null && node.rightChild === null){
        return 0
    }
    let depthLeft = 0;
    if(node.leftChild !== null){
    depthLeft = 1 + this.#findHeight(node.leftChild)
    }
    let depthRight = 0;
    if(node.rightChild !== null){
    depthRight = 1 + this.#findHeight(node.rightChild)
    }

    return Math.max(depthLeft, depthRight)
  }
  #findDepth(node) {
    const value = node.value;
    let currentNode = this.#root;
    let count = 0;
    while (currentNode.value !== value) {
      if (currentNode.rightChild === null && currentNode.leftChild === null) {
        count = -1
        break;
      }
      if (currentNode.value > value) {
        currentNode = currentNode.leftChild;
        count++
      } else {
        currentNode = currentNode.rightChild;
        count++
      }
    }
    return count;
  }

  // Returns number of edges in longest path from leaf node
  height(node){
    const requestedNode = this.find(node);
    return this.#findHeight(requestedNode);
  }

  // Returns number of edges in longest path from root
  depth(node){
    const requestedNode = this.find(node);
    return this.#findDepth(requestedNode)
  }

  // Returns true if the difference between heights of left and right subtrees
  // are less than 1
  isBalanced(){
    const difference = this.#findHeight(this.#root.leftChild) - this.#findHeight(this.#root.rightChild);
    return Math.abs(difference) <= 1
  }

  // 
  rebalance(){
    const arrayFromTree = this.inorder();
    this.buildTree(arrayFromTree)
    return this.#root
  }

  get root() {
    return this.#root;
  }
}

export default Tree
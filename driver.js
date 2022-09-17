import  Tree from './binary-search-tree.js';

// Create a binary search tree from an array of random numbers. 
function randomArray(length = 30){
    return Array.from(Array(length)).map(x=> Math.floor(Math.random() * 300))
}

const tree = new Tree(randomArray(40));

tree.prettyPrint();

// Confirm that the tree is balanced 

console.log(`It's ${tree.isBalanced()} that the tree is balanced`);

// Print out all elements in level, pre, post, and in order

console.log(`Breadth-first: ${tree.levelOrder()}`);
console.log(`Depth-first preorder: ${tree.preorder()}`);
console.log(`Depth-first postorder:  ${tree.postorder()}`);
console.log(`Depth-first inorder:  ${tree.inorder()}`);


// Unbalance the tree by adding several numbers > 100

randomArray(15).forEach(number => tree.insert(number + 300))
tree.prettyPrint();

// Confirm that the tree is unbalanced by calling isBalanced

console.log(`It's ${tree.isBalanced()} that the tree is balanced`);


// Balance the tree by calling rebalance

tree.rebalance();
tree.prettyPrint();

// Confirm that the tree is balanced by calling isBalanced
console.log(`It's ${tree.isBalanced()} that the tree is balanced`);


// Print out all elements in level, pre, post, and in order

console.log(`Breadth-first: ${tree.levelOrder()}`);
console.log(`Depth-first preorder: ${tree.preorder()}`);
console.log(`Depth-first postorder:  ${tree.postorder()}`);
console.log(`Depth-first inorder:  ${tree.inorder()}`);
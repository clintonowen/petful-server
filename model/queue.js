'use strict';

class _Node {
  constructor(value) {
    this.value=value,
    this.next=null,
    this.prev=null;
  }
}

class Queue {
  constructor() {
    this.first = null;
    this.last = null;
  }

  enqueue(data) {
    // create a node with the data that you want to add to the queue
    const node = new _Node(data);

    // if the queue is empty, make the node the first node in the queue
    if (this.first === null) {
      this.first = node;
    }
    // if there is something in the queue already, take the node that is
    // currently at the end of the queue and link it to the new node
    if (this.last) {
      node.next = this.last;
      this.last.prev = node;
    }
    // make the new node the last item in the queue
    this.last = node;
  }

  dequeue() {
    // if the queue is empty, there is nothing to return
    if (this.first === null) {
      return;
    }
    // make the first item on the queue to be the the item that is next in the
    // queue (the item after the current first item)
    const node = this.first;
    this.first = node.prev;

    // if this is the last item in the queue
    if (node === this.last) {
      this.last = null;
    }
    return node.value;
  }
}

function peek(q) {
  return q.first.value;
}

function display(q) {
  console.log('Displaying queue:');
  let node = q.first;
  while (node !== null) {
    console.log(node.value);
    node = node.prev;
  }
}

module.exports = { Queue, peek, display };

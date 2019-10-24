import { IfcNode } from '../types'

interface IfcPoint {
	x: number,
	y: number
}

const isSameNode = (a: IfcNode,b: IfcNode) => {
	return a.x === b.x && a.y === b.y
}

const sortArr = (arr: IfcNode[]) => {
	arr.sort((a, b) => a.distance - b.distance)
}

const serialize = (node: IfcNode | IfcPoint) => {
	return `${node.x}__${node.y}`
}

const deserialize = (str: string) => {
	const strArr = str.split('__')
	return {
		x: strArr[0],
		y: strArr[1]
	}
}

const getNodesAround = (grid: IfcNode[][], currNode: IfcNode): IfcPoint[] => {
	const maxRows = grid.length
	const maxCols = grid[0].length
	
	const nodesToCheck = []

	// up
	if(currNode.x - 1 >= 0) nodesToCheck.push({x: currNode.x - 1, y: currNode.y})
	// down
	if(currNode.x + 1 < maxRows) nodesToCheck.push({x: currNode.x + 1, y: currNode.y})
	
	// left
	if(currNode.y - 1 >= 0) nodesToCheck.push({x: currNode.x, y: currNode.y -1})
	
	// right
	if(currNode.y + 1 < maxCols) nodesToCheck.push({x: currNode.x, y: currNode.y + 1})

	return nodesToCheck
}

const test = deserialize('1111')


const dijkstra = (grid: IfcNode[][], start: IfcNode, end: IfcNode) => {
	const unvisitedSet = []
	const nodesCheckedInOrder = []
	const isUnvisitedLookup: any = {}
	
	// Step 1
	// mark all nodes unvisited.
	// create a set of all unvisited nodes
	for(let x=0;x<grid.length; x++) {
		for(let y=0; y<grid[0].length; y++) {
			
			// Step 2
			// Assign to every node a tentative distance value.
			// 0 for initial node, infinity for all other nodes
			// set initial node as current
			if(isSameNode(grid[x][y], start)) {
				grid[x][y].distance = 0
			} else {
				grid[x][y].distance = Infinity
			}
			unvisitedSet.push(grid[x][y])
			isUnvisitedLookup[serialize(grid[x][y])] = true
		}
	}

	sortArr(unvisitedSet)

	let currNode: IfcNode
	
	// Step 3
	// For the current node, consider all unvisited neighbors and calculate tentative distances through current node.
	// compare newly calculated tentative distance to current assigned value.  If smaller, assign smaller one.
	// for each unvisited node, need to calculate distances, then if it is cheaper, then assign distance here.

	let shouldContinue = true
	while(unvisitedSet.length && shouldContinue){
		currNode = unvisitedSet.shift()!

		const nodesAround = getNodesAround(grid, currNode)

		const nodesCheckedThisTurn: string[] = []
		
		nodesAround.map(node => {
			if(!isUnvisitedLookup[serialize(node)]) return

			nodesCheckedThisTurn.push(serialize(node))

			const nodeObj = grid[node.x][node.y]

			// TODO: Here is where adding path length goes.
			const newDistance = currNode.distance + 1
			
			if( newDistance < nodeObj.distance) {
				nodeObj.distance = newDistance
				nodeObj.prevNode = serialize(currNode)
			}
		})

		nodesCheckedInOrder.push(nodesCheckedThisTurn)
		
		// Step 4
		// When done considering all unvisited neighbors, mark current node as visited, remove from unvisited.  A visited node will never be checked again
		isUnvisitedLookup[serialize(currNode)] = false

		// Step 5
		// If destination node has been marked visited, or if smallest tentative distance among nodes in the unvisited set is infinity, then stop.  Algo has finished.
		if(!isUnvisitedLookup[serialize(end)]) shouldContinue = false
		
		sortArr(unvisitedSet)
		// Step 6
		// Otherwise, select unvisited node that marked with smallest tentitve distance, set as current node, then go back to Step 3.
	}

	// console.log('grid:',grid)
	
	// we now need to backtrack.  Start with end node, then backtrack
	const { x, y } = end
	
	const pathToTarget = []

	currNode = grid[x][y]
	while(!currNode.isStart) {
		pathToTarget.unshift(currNode.prevNode)
		
		const prevNodeObj: any = deserialize(currNode.prevNode)
		grid[prevNodeObj.x][prevNodeObj.y].isPartOfPath = true
		currNode = grid[prevNodeObj.x][prevNodeObj.y]
	}

	// console.log('nodesInOrder:',pathToTarget)
	// console.log('nodesCheckedInOrder:',nodesCheckedInOrder)
	
	return {grid, pathToTarget, nodesCheckedInOrder}
}

export default dijkstra
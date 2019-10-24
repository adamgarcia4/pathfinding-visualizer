/* eslint-disable */

import React, { useState, useEffect } from 'react'
import styled, { keyframes, css }  from 'styled-components'
import dijkstra from '../../algorithms/dijkstra'

import { IfcNode } from '../../types'

const maxRows = 10;
const maxCols = 10;

const visitedAnimation = keyframes`
	0% {
    background: blue;
  }

	50% {
		background: red;
	}

  100% {
    background: orange;
  }
`
const deserialize = (str: string) => {
	const strArr = str.split('__')
	return {
		x: parseInt(strArr[0]),
		y: parseInt(strArr[1])
	}
}

interface INodeProps {
	isVisited: boolean
}

styled.th
const NodeDiv = styled.th<INodeProps>`
	width: 30px;
	height: 30px;
	outline: 1px solid blue;

	
	animation: ${({ isVisited }) => {
	if(!isVisited) return null
	return css`1s ${visitedAnimation}`
	}}

	${({ isVisited }) => {
		return isVisited && css`background: orange`;
	}}
`

// eslint-disable
interface NodeInput {
	data: IfcNode,
	onClick: Function
}

const Node = (props: NodeInput) => {
	const { data, onClick } = props
	let content = ''

	// if(data.prevNode !== '') content = data.prevNode
	if(data.distance && data.distance !== Infinity) content = data.distance.toString()
	if(data.isPartOfPath) content = '*'
	if(data.isStart) content = 'S'
	if(data.isEnd) content = 'E'

	return (
		<NodeDiv onClick={() => onClick(data)} isVisited={data.isVisited}>
			{content}
		</NodeDiv>
	)
}

const getNodeInitialState = (x: number,y: number) => ({
	x,
	y,
	isStart: false,
	isEnd: false,
	distance: Infinity,
	prevNode: '',
	isPartOfPath: false,

	isVisited: false
})

const getNodes = () => {
	const nodes = []

	for(let row = 0; row < maxRows; row++) {
		const currentRow = []

		for(let col = 0; col < maxCols; col++) {
			currentRow.push(getNodeInitialState(row, col))
		}

		nodes.push(currentRow)
	}
	
	return nodes
}

interface IfcGridInput {
	nodes: IfcNode[][],
	onGridClick: Function
}

const Grid = (props: IfcGridInput) => {
	const { nodes, onGridClick } = props

	// Do I want to bubble this up?
	const onClick = (e: IfcNode) => {
		console.log('e:',e)
		onGridClick({
			node: e,
			visited: true
		})
	}

	return (
		<table>
			{nodes.map((yArr, yIndex) => {
				const rowDiv: JSX.Element[] = []

				{yArr.map((xArr, xIndex) => {
					const nodeData = nodes[xIndex][yIndex]
					const currPos = { xCurr: xIndex, yCurr: yIndex }

					rowDiv.push(<Node key={`${currPos.xCurr}__${currPos.yCurr}`} data={nodeData} onClick={onClick}/>)
				})}
				
				return (
					<tbody key={`${yIndex}`}>
						<tr>
							{rowDiv}
						</tr>
					</tbody>
				)
			})}
		</table>
	)
}

const timeout = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}


const GridContainer = () => {
	const [nodes, setNodes] = useState(getNodes())
	const [nodesVisited, setNodesVisited] = useState<string[][] | null>(null)

	nodes[2][1].isStart = true
	nodes[8][2].isEnd = true

	const startNode = nodes[2][1]
	const endNode = nodes[8][2]

	useEffect(() => {
		const { grid, pathToTarget, nodesCheckedInOrder } = dijkstra(nodes, startNode, endNode)
	
		setNodes(JSON.parse(JSON.stringify(grid)))
		setNodesVisited(nodesCheckedInOrder)
	}, [])

	useEffect(() => {
		// I need to convert an array into an array of promises.  Then loop through these sequentially.
		if(!nodesVisited) return
		
		const applyNodesVisited = async() => {
			for(const nodesArr of nodesVisited) {
				nodesArr.map(node => {
					const { x, y } = deserialize(node)
					nodes[x][y].isVisited = true
				})
	
				setNodes(JSON.parse(JSON.stringify(nodes)))
				await timeout(30)
			}
		}

		applyNodesVisited()
	}, [nodesVisited])
	
	const onButtonClick = () => {
		console.log('hi')
		console.log('nodes:',nodes)
		
	}

	interface IfcGridClickInput {
		node: IfcNode,
		visited: boolean
	}

	const onGridClick = (test: IfcGridClickInput) => {
		const { node, visited } = test
		nodes[node.x][node.y].isVisited = visited
		setNodes(JSON.parse(JSON.stringify(nodes)))
	}

	return (
		<div>
			<Grid nodes={nodes} onGridClick={onGridClick}/>
			<button onClick={onButtonClick}>HII</button>
		</div>
	)
}

export default GridContainer
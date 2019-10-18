/* eslint-disable */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dijkstra from '../../algorithms/dijkstra'

import { IfcNode } from '../../types'

const maxRows = 10;
const maxCols = 10;

const NodeDiv = styled.th`
	width: 30px;
	height: 30px;
	outline: 1px solid blue;

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
	if(data.isPartOfPath) content = '*'
	if(data.isStart) content = 'S'
	if(data.isEnd) content = 'E'

	return (
		<NodeDiv onClick={() => onClick(data)}>
			{content || data.distance}
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
	isPartOfPath: false
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

const Grid = () => {
	const [nodes, setNodes] = useState(getNodes())
	
	useEffect(() => {
		const newGrid = dijkstra(nodes, startNode, endNode)
		setNodes(JSON.parse(JSON.stringify(newGrid)))
	}, [])

	nodes[2][1].isStart = true
	nodes[8][2].isEnd = true
	
	const startNode = nodes[2][1]
	const endNode = nodes[8][2]

	const onClick = (e: IfcNode) => {
		console.log('e:',e)
		
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

export default Grid
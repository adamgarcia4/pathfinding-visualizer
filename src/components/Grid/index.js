/* eslint-disable */

import React from 'react'
// import cx from 'classnames'
// import styles from './Style.module.css'
import styled from 'styled-components'
import dijkstra from '../../algorithms/dijkstra'

const maxRows = 5;
const maxCols = 5;

const NodeDiv = styled.th`
	width: 30px;
	height: 30px;
	outline: 1px solid blue;

`

// eslint-disable
const Node = ({ data, onClick }) => {
	let content = ''

	if(data.isStart) content = 'S'
	if(data.isEnd) content = 'E'

	return (
		<NodeDiv onClick={() => onClick(data)}>
			{content}
		</NodeDiv>
	)
}

const getNodeInitialState = (x,y) => ({
	x,
	y,
	isStart: false,
	isEnd: false,
	distance: Infinity
})

const getNodes = () => {
	const nodes = []

	for(let row = 0; row < maxRows; row++) {
		const currentRow = []

		for(let col = 0; col < maxCols; col++) {
			currentRow.push(getNodeInitialState(col, row))
		}

		nodes.push(currentRow)
	}
	
	return nodes
}

const Grid = () => {
	const nodes = getNodes()
	
	nodes[1][2].isStart = true
	nodes[3][4].isEnd = true
	
	const startNode = nodes[1][2]
	const endNode = nodes[3][4]

	return (
		<table>
			{nodes.map((row, rowIndex) => {
				const rowDiv = []

				{row.map((col, colIndex) => {
					const nodeData = nodes[colIndex][rowIndex]
					const currPos = { xCurr: rowIndex, yCurr: colIndex }

					rowDiv.push(<Node key={`${rowIndex}__${colIndex}`} data={nodeData} currPos={currPos} onClick={e => {
						// console.log('e:',e)
						console.log('algo: ', dijkstra(nodes, startNode, endNode))
					}}/>)
				})}

				
				return (
					<tbody key={`${rowIndex}`}>
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
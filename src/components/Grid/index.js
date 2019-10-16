/* eslint-disable */

import React from 'react'
// import cx from 'classnames'
// import styles from './Style.module.css'
import styled from 'styled-components'

const maxRows = 10;
const maxCols = 10;

const NodeDiv = styled.th`
	width: 30px;
	height: 30px;
	outline: 1px solid blue;

`

// eslint-disable
const Node = ({ type, data, currPos }) => {
	let content = ''

	if(data.isStart) content = 'S'
	if(data.isEnd) content = 'E'

	return (
		<NodeDiv>
			{content}
		</NodeDiv>
	)
}

const getNodeInitialState = () => ({
	isStart: false,
	isEnd: false
})

const getNodes = () => {
	const nodes = []

	for(let row = 0; row < maxRows; row++) {
		const currentRow = []

		for(let col = 0; col < maxCols; col++) {
			currentRow.push(getNodeInitialState())
		}

		nodes.push(currentRow)
	}
	
	return nodes
}

const Grid = () => {
	const nodes = getNodes()
	
	nodes[1][2].isStart = true
	nodes[3][4].isEnd = true
	
	return (
		<table>
			{nodes.map((row, rowIndex) => {
				const rowDiv = []

				{row.map((col, colIndex) => {
					
					
					const nodeData = nodes[rowIndex][colIndex]
					const currPos = { xCurr: rowIndex, yCurr: colIndex }

					rowDiv.push(<Node key={`${rowIndex}__${colIndex}`} data={nodeData} currPos={currPos}/>)
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
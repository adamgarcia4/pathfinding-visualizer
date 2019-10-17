import React from 'react'

import { IfcNode } from '../../types'
import styled from 'styled-components'

const NodeDiv = styled.th`
	width: 30px;
	height: 30px;
	outline: 1px solid blue;
`
interface IfcNodeInput {
	data: IfcNode,
	onClick: Function
}
// eslint-disable
const Node = (props: IfcNodeInput) => {
	let content: string = ''
	const { data, onClick } = props

	if(data.isStart) content = 'S'
	if(data.isEnd) content = 'E'

	return (
		<NodeDiv onClick={() => onClick(data)}>
			{content}
		</NodeDiv>
	)
}

export default Node
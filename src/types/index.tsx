export interface IfcNode {
	x: number,
	y: number,
	isStart: boolean,
	isEnd: boolean,
	distance: number,
	prevNode: string,
	isPartOfPath: boolean,

	isVisited: boolean,
}

export const _ = ''
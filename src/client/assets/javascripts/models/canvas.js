type Circle = {
  id: string,
  label: string,
  type: string,
  cx: number,
  cy: number,
  r: number,
};

type Ellipse = {
  id: string,
  label: string,
  type: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
};

type Text = {
	id: string,
  label: string,
  type: string,
  x: number,
  y: number,
  text: string,
}

type Line = {
	id: string,
  label: string,
  type: string,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
}

type Rect = {
	id: string,
  label: string,
  type: string,
  x: number,
  y: number,
  w: number,
  h: number,
}

type Shape = | Circle | Text | Rect | Line | Ellipse;

export type State = {
  shapes: Array<Shape>,
  selected: string,
  x: number,
  y: number
};

type Source = {
	id: string,
	description: string, 
	schema: Object,
}

export type State = {
  sources: Array<Source>,
  selected: string,
};
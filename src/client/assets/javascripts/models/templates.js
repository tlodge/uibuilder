type TemplateById = {
  id?: number,
  type: string
};

// This is the model of our module state
export type State = {
  templates: number[],
  templatesById: Array<TemplateById>
};

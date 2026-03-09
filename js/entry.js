import { renderMermaidSVG } from 'beautiful-mermaid';

export function render(opts) {
  const { code } = opts;
  
  return {
    data: renderMermaidSVG(code)
  };
}

import {filter} from 'unist-util-filter';
import visit from 'unist-util-visit';
import { addExport } from '../remark/utils.js';
import {toHtml} from 'hast-util-to-html';

const langFilename = (className) => {
  switch (className) {
    case 'language-shell':
      return 'Bash';
    case 'language-json':
      return 'JSON';
    case 'language-js':
      return 'JavaScript'
    default:
      const language = className.substring(9);
      return language.charAt(0).toUpperCase() + language.slice(1);
  }
}
const withApiComponents = () => {
  return (tree) => {
    let apiComponents = [];
    visit(tree, 'mdxJsxFlowElement', (node) => {
      if(['ResponseExample', 'RequestExample'].includes(node.name)) {
        const nodeType = node.name.slice(0, -7);
        // remove all jsx components to convert to html (removes <ResponseExample> and <Editor>)
        const children = node.children.map((child, i) => {
          const preComponent = child.children[0];
          const html = toHtml(preComponent);
          let filename = i === 0 ? nodeType : `${nodeType} ${i + 1}`;
          const className = preComponent?.properties?.className[0];
          if (className) {
            filename = langFilename(className)
          }
          if (child?.attributes && child.attributes.length > 0) {
            filename = child.attributes[0]?.value;
          }
          return {
            filename,
            html
          }
        });
        apiComponents.push({
          type: node.name,
          children
        })
      }
    });
    addExport(tree, 'apiComponents', apiComponents);
    return filter(tree, node => !['ResponseExample', 'RequestExample'].includes(node.name));
  }
}

export default withApiComponents;

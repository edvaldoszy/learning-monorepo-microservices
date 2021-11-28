import { FieldNode, SelectionNode } from 'graphql';

export function getFieldsFromSelectionNode(selectionNode: FieldNode) {
  return selectionNode
    .selectionSet!
    .selections
    .filter((field: SelectionNode): field is FieldNode => field.kind === 'Field')
    .map(field => field.name.value);
}

export default {};

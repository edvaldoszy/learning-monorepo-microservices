function omit(object: Record<string, any>, attributes: string[]): any {
  if (!attributes.length) {
    return { ...object };
  }

  const shallow = { ...object };
  const { hasOwnProperty } = Object;

  attributes.forEach(key => {
    if (hasOwnProperty.call(shallow, key)) {
      delete shallow[key];
    }
  });

  return shallow;
}

export default omit;

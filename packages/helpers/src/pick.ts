function pick(object: Record<string, any>, attributes: string[]): any {
  if (!attributes.length) {
    return {};
  }

  const { hasOwnProperty } = Object;
  return attributes.reduce((shallow, key) => {
    if (hasOwnProperty.call(object, key)) {
      return {
        ...shallow,
        [key]: object[key],
      };
    }
    return shallow;
  }, {});
}

export default pick;

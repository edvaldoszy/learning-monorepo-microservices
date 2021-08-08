import pick from './pick';

describe('pick', () => {
  it('should return an object', () => {
    const output = pick({}, []);

    expect(String(output) === '[object Object]')
      .toBe(true);
  });

  it('should return only attributes', () => {
    const input = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const output = pick(input, ['key1', 'key3']);

    expect(output)
      .toMatchObject({
        key1: 'value1',
        key3: 'value3',
      });
  });

  it('should not return other keys', () => {
    const input = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const output = pick(input, ['key1']);

    expect(output.key1)
      .toBeTruthy();
    expect(output.key2)
      .not.toBeTruthy();
  });
});

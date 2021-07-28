import { odd } from '~/helpers';

describe('customer', () => {
  it('should be quals to 10', () => {
    expect(odd(10)).toBe(true);
  });
});

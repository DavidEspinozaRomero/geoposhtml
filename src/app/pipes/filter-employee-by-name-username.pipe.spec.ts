import { FilterEmployeeByNameUsernamePipe } from './filter-employee-by-name-username.pipe';

describe('FilterEmployeeByNameUsernamePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterEmployeeByNameUsernamePipe();
    expect(pipe).toBeTruthy();
  });
});

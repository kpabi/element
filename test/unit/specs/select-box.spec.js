import { createTest, destroyVM } from '../util';
import SelectBox from 'packages/select-box';

describe('SelectBox', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(SelectBox, true);
    expect(vm.$el).to.exist;
  });
});


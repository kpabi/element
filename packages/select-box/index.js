import SelectBox from './src/select-box';

/* istanbul ignore next */
SelectBox.install = function(Vue) {
  Vue.component(SelectBox.name, SelectBox);
};

export default SelectBox;

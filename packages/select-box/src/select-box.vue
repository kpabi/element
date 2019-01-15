<template>
    <div class="el-select-box" ref="reference" @click="handleFocus" v-clickoutside="handleClose">
      <div>hello</div>
      <el-select-menu
         v-show="visible"
        ref="popper"
        :append-to-body="popperAppendToBody">
        <el-input
              v-model="selectedLabel"
              ref="input"
              @keyup.native="debouncedOnInputChange"
              @keydown.native.down.stop.prevent="navigateOptions('next')"
              @keydown.native.up.stop.prevent="navigateOptions('prev')"
              @keydown.native.esc.stop.prevent="visible = false"
              @keydown.native.tab="visible = false"
              >
             
        </el-input>
        <el-scrollbar
          wrap-class="el-select-box-dropdown__wrap"
          view-class="el-select-box-dropdown__list"
          tag="div"
          ref="scrollbar"         
         >
          <slot></slot>
        </el-scrollbar>
      </el-select-menu>
      
    </div>
</template>

<script type="text/babel">
  import Emitter from 'element-ui/src/mixins/emitter';
  import Focus from 'element-ui/src/mixins/focus';
  import Locale from 'element-ui/src/mixins/locale';
  import ElInput from 'element-ui/packages/input';
  import debounce from 'throttle-debounce/debounce';
  import ElSelectMenu from './select-box-dropdown.vue';
  import ElOption from '../../select/src/option.vue';
  import ElTag from 'element-ui/packages/tag';
  import ElScrollbar from 'element-ui/packages/scrollbar';
  import Clickoutside from 'element-ui/src/utils/clickoutside';
  import NavigationMixin from './navigation-mixin';

  export default {
    name: 'ElSelectBox',

    created() {
      this.debouncedOnInputChange = debounce(this.debounce, () => {
        this.onInputChange();
      });
    },

    componentName: 'ElSelectBox',

    directives: { Clickoutside },

    mixins: [Emitter, Locale, Focus('reference'), NavigationMixin],

    components: {
      ElInput,
      ElSelectMenu,
      ElOption,
      ElTag,
      ElScrollbar
    },

    mounted() {
      this.$on('handleOptionClick', this.handleOptionSelect);
    },

    provide() {
      return {
        'select': this
      };
    },

    props: {
      name: String,
      id: String,
      value: {
        required: true
      },
      autocomplete: {
        type: String,
        default: 'off'
      },
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      placeholder: {
        type: String,
        default() {
          return '';
        }
      },
      defaultFirstOption: Boolean,
      reserveKeyword: Boolean,
      valueKey: {
        type: String,
        default: 'value'
      },
      popperAppendToBody: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        filteredOptionsCount: 0,
        options: [],
        hoverIndex: -1,
        optionsCount: 0,
        filteredOptionsCount: 0,
        visible: false,
        query: '',
        selectedLabel: '',
        previousQuery: null
      };
    },
    methods: {
      scrollToOption(option) {
        // const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el;
        // if (this.$refs.popper && target) {
        //   const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
        //   scrollIntoView(menu, target);
        // }
        // this.$refs.scrollbar && this.$refs.scrollbar.handleScroll();
      },

      handleOptionSelect(option, byClick) {
        this.$emit('input', option.value);
        this.emitChange(option.value);
        this.visible = false;
        this.isSilentBlur = byClick;
        // this.setSoftFocus();
        if (this.visible) return;
        this.$nextTick(() => {
          this.scrollToOption(option);
        });
      },

      handleFocus(event) {
        this.visible = !this.visible;
      },
      handleBlur(event) {

      },

      handleClose() {
        this.visible = false;
      },

      onInputChange() {
        if (this.filterable && this.query !== this.selectedLabel) {
          this.query = this.selectedLabel;
          this.handleQueryChange(this.query);
        }
      },

      handleQueryChange(val) {
        if (this.previousQuery === val) return;
        if (
          this.previousQuery === null &&
          (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')
        ) {
          this.previousQuery = val;
          return;
        }
        console.info('mad city')
        this.previousQuery = val;
        this.$nextTick(() => {
          if (this.visible) this.broadcast('ElSelectDropdown', 'updatePopper');
        });
        this.hoverIndex = -1;
        if (this.remote && typeof this.remoteMethod === 'function') {
          console.info('mad kid')
          this.hoverIndex = -1;
          this.remoteMethod(val);
        }
      }
    },

    watch: {
      visible(val) {
        if (!val) {
          this.broadcast('ElSelectDropdown', 'destroyPopper');
        } else {
          this.broadcast('ElSelectDropdown', 'updatePopper');
          this.$nextTick(() => {
            this.$refs.input.focus();
          });
        }
        this.$emit('visible-change', val);
      },
      text() {
      }
    }
  };
</script>

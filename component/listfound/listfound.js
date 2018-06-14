// component/listfound/listfound.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: { location: 'ssss' }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap(e) {
      console.log('222')
      console.log(this.data.item)
    }
  }

})

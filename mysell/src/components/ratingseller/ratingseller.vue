<template>
  <div class="ratingseller">
    <div class="rating-type border-1px">
      <span @click="select(2, $event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}} <span class="count"></span>{{ratings.length}}</span>
      <span @click="select(0, $event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}} <span class="count"></span>{{positives.length}}</span>
      <span @click="select(1, $event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}} <span class="count"></span>{{negatives.length}}</span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      // 选择类型
      selectType: {
        type: Number,
        default: ALL
      },
      // 是否有内容
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives() {
        //   filter返回数组中的满足回调函数中指定的条件的元素。
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      // 选项卡tab
      select(type, event) {
        if (!event._constructed) {
          return
        }
        // 把事件传递到父组件select事件中
        this.$emit('select', type)
      },
      // 点击看内容
      toggleContent(event) {
        if (!event._constructed) {
          return
        }
        this.$emit('toggle')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingseller
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0px
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        line-height 16px
        color rgb(77,85,93)
        &.active
          color #fff
        .count
          font-size 8px
          margin-left 2px
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background rgba(0,160,220,1)
        &.negative
          background rgba(77,85,93,0.2)
          &.active
            background rgba(77,85,93,1)


    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display inline-block
        font-size 24px
        margin-right 4px
      .text
        display inline-block
        font-size 12px
        vertical-align: top;

</style>

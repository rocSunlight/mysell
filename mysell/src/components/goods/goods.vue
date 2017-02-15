<template>
  <div>
    <!--meun布局-->
    <div class="goods">
      <div class="meun-wrapper" ref="meunWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="meun-item " ref="meunItem" :class="{'current':currentIndex===index}" @click="selectMeun(index,$event)">
            <!--判断是否有活动-->
            <span class="text border-1px"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="item in goods" class="foods-list" ref="foodsList">
            <h1 class="title">{{item.name}}</h1>
            <ul >
              <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item  border-1px">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" :alt="food.name">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <v-cartcontrol @add="addFood" :food="food"></v-cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--引入购物车组件-->
      <v-shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
    </div>
    <v-food @add="addFood" :food="selectedFood" ref="food"></v-food>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入滚动better-scroll
  import BScroll from 'better-scroll'
  import shopCart from 'components/shopcart/shopcart'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import Food from 'components/food/food'

  const ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.error === ERR_OK) {
          this.goods = response.data
          // $nextTick将回调延迟到下次 DOM 更新循环之后执行。
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      }, response => {

      })
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = []
        // 先遍历获取每一个商品，再遍历每个商品价格
        this.goods.forEach((item) => {
          item.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      // selectFood组件把food数据传给子组件
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      },
      // 定义target 事件再传到子组件cartcontrol组件中
      addFood(target) {
        this._drop(target)
      },
      // 体验优化,异步执行下落动画
      _drop(target) {
        // 在获取购物车的target事件
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      // 点击左边导航时，滚动到相应的位置
      selectMeun(index, event) {
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodsList
        let el = foodList[index]
        this.foodsScoll.scrollToElement(el, 300)
      },
      // 滚动
      _initScroll() {
        this.meunScroll = new BScroll(this.$refs.meunWrapper, {
          click: true
        })
        this.foodsScoll = new BScroll(this.$refs.foodWrapper, {
          probeType: 3,
          click: true
        })
        this.foodsScoll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        let foodsList = this.$refs.foodsList
        let height = 0
        // 获取第一个高度 把每一层的高度存到数组
        this.listHeight.push(height)
        for (let i = 0; i < foodsList.length; i++) {
          let item = foodsList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      'v-shopcart': shopCart,
      'v-cartcontrol': cartcontrol,
      'v-food': Food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .meun-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .meun-item
        display table
        height 54px
        width 56px
        padding: 0 12px;
        line-height 14px
        &.current
          position relative
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image(decrease_3)
          &.discount
            bg-image(discount_3)
          &.guarantee
            bg-image(guarantee_3)
          &.invoice
            bg-image(invoice_3)
          &.special
            bg-image(special_3)
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            font-size 14px
            margin 2px 0 8px 0
            height 14px
            line-height 14px
          .desc, .extra
            font-size 10px
            line-height 10px
            color rgb(147,153,159)
          .desc
            margin-bottom 8px
            line-height 14px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147,153,159)


          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>

<template>
<!-- 根据 https://github.com/Wanderxx/vue-fullcalendar 来订制的 -->
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-month="currentMonth"
      :first-day="firstDay"
      :locale="locale"
      @change="emitChangeMonth">

      <div slot="header-left">
        <slot name="fc-header-left">
        </slot>
      </div>

      <div slot="header-right">
        <slot name="fc-header-right">
        </slot>
      </div>
    </fc-header>
    <!-- body display date day and events -->
    <div class="full-calendar-body">
      <div class="weeks">
        <strong class="week" v-for="dayIndex in 7">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="dates" ref="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="week in currentDates">
            <div class="day-cell" v-for="day in week"
                 :class="{'today' : day.isToday, 'not-cur-month' : !day.isCurMonth}"
                 @click.stop="dayClick(day.date, $event)">
              <template v-if="day.isCurMonth">
                <p class="day-number">{{ day.monthDay }}</p>
                <span class="text-success small" v-if="calcDayPrice(day.date) > 0">
                  {{calcDayPrice(day.date)}}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import dateFunc from '../common/dateFunc.js'
import FcHeader from './my-trip-date-picker-header.vue'

export default {
  props: {
    locale: {
      type: String,
      default: 'zh-cn'
    },
    firstDay: {
      type: Number | String,
      validator (val) {
        const res = parseInt(val)
        return res >= 0 && res <= 6
      },
      default: 0
    },
    prices: null
  },
  components: {
    'fc-header': FcHeader
  },
  data () {
    return {
      currentMonth: moment().startOf('month'),
      isLismit: true,
      eventLimit: 3,
      showMore: false,
      morePos: {
        top: 0,
        left: 0
      },
      selectDay: {}
    }
  },
  computed: {
    currentDates () {
      return this.getCalendar()
    }
  },
  mounted: function () {
    this.emitChangeMonth(this.currentMonth)
  },
  methods: {
    calcDayPrice (showDate) {
      const date0 = showDate.format('YYYY-MM-DD')
      const now0 = moment()
      const spanMonths = moment.duration(showDate - now0).months()
      const spanDays = moment.duration(showDate - now0).days()

      if (spanDays < 0) return -1

      const totalSpanDays = spanMonths * 30 + spanDays

      for (let i = 0; i < this.prices.length; i++) {
        const info = this.prices[i]

        if (info.ddate === date0) {
          if (totalSpanDays < info.advanceDays) {
            return 0
          } else {
            return info.price
          }
        }
      }
    },
    getCalendar () {
      // calculate 2d-array of each month
      const monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay)
      const calendar = []

      for (let perWeek = 0; perWeek < 6; perWeek++) {
        const week = []

        for (let perDay = 0; perDay < 7; perDay++) {
          week.push({
            monthDay: monthViewStartDate.date(),
            isToday: monthViewStartDate.isSame(moment(), 'day'),
            isCurMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
            weekDay: perDay,
            date: moment(monthViewStartDate)
            // events: this.slotEvents(monthViewStartDate)
          })

          monthViewStartDate.add(1, 'day')
        }
        calendar.push(week)
      }

      return calendar
    },
    emitChangeMonth (firstDayOfMonth) {
      this.currentMonth = firstDayOfMonth

      const start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay)
      const end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay)

      this.$emit('changeMonth', start, end, firstDayOfMonth)
    },
    dayClick (day, jsEvent) {
      const price = this.calcDayPrice(day)
      if (price > 0) {
        this.$emit('dateSelected', day.format('YYYY-MM-DD'), price, jsEvent)
      }
    }
  },
  filters: {
    localeWeekDay (weekday, firstDay, locale) {
      firstDay = parseInt(firstDay)
      const localMoment = moment().locale(locale)
      return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7]
    }
  }
}
</script>

<style lang="scss">
  .comp-full-calendar{
    padding: 2px;
    background: #fff;
    max-width: 960px;
    margin:0 1;
    ul,p{
      margin:0;
      padding:0;
    }
  }

  .full-calendar-body{
    margin-top: 5px;
  .weeks{
    display: flex;
    border-top:1px solid #e0e0e0;
    border-bottom:1px solid #e0e0e0;
    border-left:1px solid #e0e0e0;
  .week{
    flex:1;
    text-align: center;
    border-right:1px solid #e0e0e0;
  }
  }
  .dates {
    position:relative;
  .week-row{
  // width: 100%;
  // position:absolute;
    border-left:1px solid #e0e0e0;
    display: flex;
  .day-cell{
    flex:1;
    min-height: 50px;
    padding:4px;
    border-right:1px solid #e0e0e0;
    border-bottom:1px solid #e0e0e0;
  .day-number{
    text-align: right;
  }
  &.today{
     background-color:#fcf8e3;
   }
  &.not-cur-month{
  .day-number{
    color:rgba(0,0,0,.24);
  }
  }
  }
  }
  .dates-events{
    position:absolute;
    top:0;
    left:0;
    z-index:1;
    width: 100%;
  .events-week{
    display: flex;
  .events-day{
    cursor: pointer;
    flex:1;
    min-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  .day-number{
    text-align: right;
    padding:4px 5px 4px 4px;
    opacity: 0;
  }
  &.not-cur-month{
  .day-number{
    color:rgba(0,0,0,.24);
  }
  }
  .event-box{
  .event-item{
    cursor: pointer;
    font-size:12px;
    background-color:#C7E6FD;
    margin-bottom:2px;
    color: rgba(0,0,0,.87);
    padding:0 0 0 4px;
    height: 18px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  &.is-start{
     margin-left: 4px;
   // border-top-left-radius:4px;
   // border-bottom-left-radius:4px;
   }
  &.is-end{
     margin-right: 4px;
   // border-top-right-radius:4px;
   // border-bottom-right-radius:4px;
   }
  &.is-opacity{
     opacity: 0;
   }
  }
  .more-link{
    cursor: pointer;
  // text-align: right;
    padding-left: 8px;
    padding-right: 2px;
    color: rgba(0,0,0,.38);
    font-size: 14px;
  }
  }
  }
  }
  }
  .more-events{
    position:absolute;
    width: 150px;
    z-index: 2;
    border:1px solid #eee;
    box-shadow: 0 2px 6px rgba(0,0,0,.15);
  .more-header{
    background-color:#eee;
    padding:5px;
    display: flex;
    align-items : center;
    font-size: 14px;
  .title{
    flex:1;
  }
  .close{
    margin-right: 2px;
    cursor: pointer;
    font-size: 16px;
  }
  }
  .more-body{
    height: 146px;
    overflow: hidden;
  .body-list{
    height: 0px;
    padding:5px;
    overflow: auto;
    background-color:#fff;
  .body-item{
    cursor: pointer;
    font-size:12px;
    background-color:#C7E6FD;
    margin-bottom:2px;
    color: rgba(0,0,0,.87);
    padding:0 0 0 4px;
    height: 18px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  }
  }
  }
  }
  }
</style>

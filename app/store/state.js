export const state = {
  items: {},
  airports: [],
  sc: {
    rowCount: 0,
    pageNo: 1,
    pageSize: 10,
    pageTotal: 0
  },

  bottomTabBarShowed: true,
  logined: false,
  username: '',
  fullname: '',
  searchParams: {
    dcity: '',
    dcityName: '',
    acity: '',
    acityName: '',
    ddate: '',
    sortBy: 0,
    onlyCarrier: '',
  },
  order: {
    flights: [],
    psgs: [],
    pnrNo: '',
    pnrDetail: '',
    policyId: 0
  },
  historyStep: 0,
  userInfo: {
    freeBalance: 0,
    cashBalance: 0,
    frozenBalance: 0,
    creditLimit: 0
  },
  flightInfo: null,
  orderId: 0,
  orderDetail: null,
  policyDetail: null,
  pnrDetail: null,

  errAlert: false,
  errMsg: '',
  errMsgType: 'warning',
  
  loading: false,
  loadingText: '数据加载中',

  wxInfo: {
    code: '',
    openid: '',
    nickname: '',
    headimgurl: '',
    subscribe: 0
  },
  // 申请退票信息
  refundInfo: {
    ticketNo: '',
    psgName: '',
    orderId: 0
  },
  // 申请改期信息
  changeInfo: {
    ticketNo: '',
    psgName: '',
    orderId: 0
  },
  refundOrderInfo: null,
  changeOrderInfo: null
}

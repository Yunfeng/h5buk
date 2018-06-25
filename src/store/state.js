export const state = {
  workMode: 0, // 0 - 普通网站, 1- 微信公众号, 2-企业微信, 8-企业微信服务商
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
  isAdmin: false,
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
  policyIdSelected: 0,
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
  wwopen: {
    authCode: '',
    avatar: '',
    code: ''
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

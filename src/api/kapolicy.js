import { APP_FLIGHT_PATH, callService } from '../common/common.js'

export function getPortDesc(val) {
  if (val === '*') {
    return '全国'
  } else if (val.length > 7) {
    return val.substring(0, 7) + '...'
  } else {
    return val
  }
}

export function getStatusDesc(val) {
  if (val === 1) {
    return '启用中'
  } else {
    return '停用'
  }
}

export function getRouteTypeDesc(val) {
  if (val === 1) {
    return '往返'
  } else {
    return '单程'
  }
}

export function getIntlPolicyDesc(val) {
  if (val === 1) {
    return '国际'
  } else {
    return '国内'
  }
}

export function getPolicyTypeDesc(val) {
  if (val === 1) {
    return '特殊-票面低'
  } else if (val === 0) {
    return '普通-票面相符'
  } else {
    return ''
  }
}

export function getIdTypeLimitDesc(val) {
  // console.log(val)
  if (val === '0' || val === null) {
    return '任意'
  } else if (val === '1') {
    return '居民身份证'
  } else {
    return '其它'
  }
}
export function getPayTypeLimitDesc(val) {
  if (val === '0' || val === null) {
    return '无限制'
  } else if (val === '1') {
    return '账户余额'
  } else if (val === '2') {
    return '微信支付'
  } else {
    return ''
  }
}

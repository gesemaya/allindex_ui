import { colors } from '../../constants/colors'
import useMobile from '../../hooks/useMobile'
import { OrderStatusEnums } from '../../types/Enums'
import { IOrderStatusTag } from '../../types/Interface'
import { T3 } from '../typography/Typography'
import { useEffect, useState } from 'react'

const OrderStatusTag = (props: IOrderStatusTag) => {
  const [bgColor, setBgColor] = useState(colors.blue[800])
  const [textColor, setTextColor] = useState(colors.blue[500])
  const [title, setTitle] = useState('')

  useEffect(() => {
    switch (props.status.toUpperCase()) {
      case OrderStatusEnums.OPEN:
        setBgColor(colors.green[700])
        setTextColor(colors.green[400])
        setTitle('Open')
        break
      case OrderStatusEnums.FILLED:
        setBgColor(colors.blue[700])
        setTextColor(colors.blue[400])
        setTitle('Filled')
        break
      case OrderStatusEnums.CLOSED:
        setBgColor(colors.blue[800])
        setTextColor(colors.blue[500])
        setTitle('Closed')
        break
      case OrderStatusEnums.CLAIMED:
        setBgColor(colors.blue[800])
        setTextColor(colors.blue[500])
        setTitle('Claimed')
        break
      case OrderStatusEnums.IN_RANGE:
        setBgColor(colors.green[700])
        setTextColor(colors.green[400])
        setTitle('In range')
        break
      case OrderStatusEnums.OUT_OF_RANGE:
        setBgColor(colors.gray[700])
        setTextColor(colors.yellow[100])
        setTitle('Out of range')
        break
      case OrderStatusEnums.CANCELLED:
        setBgColor(colors.gray[600])
        setTextColor(colors.gray[300])
        setTitle('Cancelled')
        break
      default:
        setBgColor(colors.gray[600])
        setTextColor(colors.gray[300])
        setTitle('Unknown')
        break
    }
  }, [props.status])
  const { isDesktop } = useMobile()
  return (
    <div
      className="py-1 text-[14px] font-regular rounded-[6px] flex items-center justify-center"
      style={{ backgroundColor: bgColor, width: isDesktop ? '94px' : '75px' }}
    >
      <T3 color={textColor}>{title}</T3>
    </div>
  )
}

export default OrderStatusTag

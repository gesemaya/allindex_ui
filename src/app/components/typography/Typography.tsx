import useBreakpoint from '../../hooks/useBreakpoint'
import { FontWeightEnums } from '../../types/Enums'
import { ITypography } from '../../types/Interface'

export const T1 = (props: ITypography) => {
  const { weight = FontWeightEnums.REGULAR, children, color = '#FFFFFF', className } = props
  const fontSize = useBreakpoint({ base: '16px', sm: '16px' })
  const lineHeight = useBreakpoint({ base: '18px', sm: '18px' })
  return (
    <div
      className={className}
      style={{
        fontWeight: weight,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: color,
      }}
    >
      {children}
    </div>
  )
}

export const T2 = (props: ITypography) => {
  const { weight = FontWeightEnums.REGULAR, children, color = '#FFFFFF', className } = props
  const fontSize = useBreakpoint({ base: '12px', sm: '14px' })
  const lineHeight = useBreakpoint({ base: '14px', sm: '16px' })
  return (
    <div
      className={className}
      style={{
        fontWeight: weight,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: color,
      }}
    >
      {children}
    </div>
  )
}

export const T3 = (props: ITypography) => {
  const { weight = FontWeightEnums.REGULAR, children, color = '#FFFFFF', className } = props
  const fontSize = useBreakpoint({ base: '12px', sm: '12px' })
  const lineHeight = useBreakpoint({ base: '14px', sm: '14px' })
  return (
    <div
      className={className}
      style={{
        fontWeight: weight,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: color,
      }}
    >
      {children}
    </div>
  )
}

export const T4 = (props: ITypography) => {
  const { weight = FontWeightEnums.REGULAR, children, color = '#FFFFFF', className, fontSize } = props
  const baseFontSize = useBreakpoint({ base: '10px', sm: '10px' })
  const lineHeight = useBreakpoint({ base: '12px', sm: '12px' })
  return (
    <p
      style={{
        fontWeight: weight,
        fontSize: fontSize ? fontSize : baseFontSize,
        lineHeight: lineHeight,
        color: color,
      }}
      className={className}
    >
      {children}
    </p>
  )
}

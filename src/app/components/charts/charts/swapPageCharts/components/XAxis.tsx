import { T3 } from '../../../../typography/Typography'
import { colors } from '../../../../../constants/colors'
import { IXAxis } from '../types'

function XAxis(props: IXAxis) {
  const { height, width, data } = props

  return (
    <div className="relative" style={{ height: height, width: width }}>
      {data && (
        <div className="relative flex flex-row overflow-hidden" style={{ maxWidth: width, height: height }}>
          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="absolute  flex justify-center items-center "
                  style={{ width: item.width, height: height, marginLeft: item.location }}
                >
                  <T3 color={colors.gray[500]}>{item.value}</T3>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default XAxis

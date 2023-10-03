import { T2 } from '../typography/Typography'

function isCallback<T>(maybeFunc: T): maybeFunc is T {
  return typeof maybeFunc === 'function'
}

function resolveResolvable<T>(inp: T | ((...args: any[]) => T), ...params: any[]) {
  if (isCallback(inp)) {
    return (inp as any)(...params)
  } else {
    return inp
  }
}

export interface ColumnProps<T> {
  title: string | JSX.Element
  headerClass: string | (() => string)
  dataClass: string | ((arg: T, idx?: number) => string)
  render: (arg: T) => JSX.Element | string
  show?: boolean | (() => boolean)
}

export interface TableProps<T> {
  tableClass: string | (() => string)
  tbodyClass: string | (() => string)
  headerRowClass: string | (() => string)
  dataRowClass: string | ((arg: T, idx?: number) => string)
}

export class TableDrawer<T extends any> {
  headers: Array<ColumnProps<T>> = []
  config: TableProps<T>
  data: Array<T> = []

  constructor(headers: Array<ColumnProps<T>>, config: TableProps<T>) {
    this.headers.push(...headers)
    this.config = config
  }

  withData(data: Array<T>): TableDrawer<T> {
    this.data = data
    return this
  }

  render(): JSX.Element {
    return (
      <table className={resolveResolvable(this.config.tableClass)}>
        <tbody className={resolveResolvable(this.config.tbodyClass)}>
          <>
            <tr className={resolveResolvable(this.config.headerRowClass)}>
              {this.headers.map((header, idx) => {
                const thClass = resolveResolvable(header.headerClass)
                if (typeof header.title === 'string') {
                  return (
                    <th key={idx} className={thClass}>
                      <T2>{header.title}</T2>
                    </th>
                  )
                } else {
                  return (
                    <th key={idx} className={thClass}>
                      {header.title}
                    </th>
                  )
                }
              })}
            </tr>
            {this.data
              .map((datum, idx) => {
                const clasName = resolveResolvable(this.config.dataRowClass, datum, idx)
                const row = (
                  <tr key={idx} className={clasName}>
                    {this.headers
                      .filter((x) => {
                        if (x.show !== undefined) {
                          if (x.show === false) {
                            return false
                          } else if (x.show === true) {
                            return true
                          } else {
                            return x.show()
                          }
                        }
                        return true
                      })
                      .map((header, idx2) => {
                        const tdClass = resolveResolvable(header.dataClass, datum, idx)
                        const rendered = header.render(datum)
                        return (
                          <td key={idx2} className={tdClass}>
                            {rendered}
                          </td>
                        )
                      })}
                  </tr>
                )
                return row
              })
              .filter((x) => x !== undefined)}
          </>
        </tbody>
      </table>
    )
  }
}

import React from 'react'

interface IBackground {
  children: React.ReactNode
}

function DashboardBackground(props: IBackground) {
  const { children } = props
  const baseBackground = '#000000'
  return <div className="flex flex-col bg-black w-full min-h-screen">{children}</div>
}

export default DashboardBackground

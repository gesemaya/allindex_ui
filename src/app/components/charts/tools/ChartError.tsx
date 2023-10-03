import { T2 } from '../../typography/Typography'
import React from 'react'

function ChartError() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <svg width="57" height="50" viewBox="0 0 57 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28.6206 19.992V29.992M3.81262 38.9947C1.50328 42.9947 4.39128 47.992 9.00728 47.992H48.2339C52.8473 47.992 55.7353 42.9947 53.4286 38.9947L33.818 5C31.5086 1 25.7326 1 23.4233 5L3.81262 38.9947ZM28.6206 37.992H28.6393V38.0133H28.6206V37.992Z"
          stroke="url(#paint0_linear_1863_55394)"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1863_55394"
            x1="28.6199"
            y1="2"
            x2="28.6199"
            y2="47.992"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3779D0" />
            <stop offset="1" stopColor="#0050FF" />
          </linearGradient>
        </defs>
      </svg>
      <T2>Error Loading Chart</T2>
    </div>
  )
}

export default ChartError

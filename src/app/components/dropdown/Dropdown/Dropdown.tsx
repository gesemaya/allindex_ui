// use radix-iu library for dropdown component
import './dropdown.module.css'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import React from 'react'

interface DropdownProps {
  trigger: React.ReactNode | string
  items: React.ReactNode[]
  arrow?: boolean
}

const Dropdown = ({ trigger, items }: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="rounded-[12px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideRightAndFade z-10 border border-gray-700"
          sideOffset={6}
        >
          {items.map((item) => (
            <DropdownMenu.Item className="DropdownMenuItem bg-gray-900 hover:bg-gray-800 first:rounded-t-[12px] last:rounded-b-[12px] cursor-pointer">
              {item}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default Dropdown

export const DropdownTrigger = ({
  trigger,
  classes,
  hasCarot = false,
}: {
  trigger: React.ReactNode | string
  classes?: string
  hasCarot?: boolean
}) => {
  return (
    <DropdownMenu.Trigger asChild>
      <div
        className={`hover:opacity-70 items-center justify-between gap-1 p-2 rounded-[8px] cursor-pointer ${
          hasCarot ? 'flex' : ''
        } ${classes}`}
      >
        {trigger} {hasCarot && <ChevronDownIcon className="ChevronDown w-3 h-3" color="white" aria-hidden />}
      </div>
    </DropdownMenu.Trigger>
  )
}

export const DropdownItem = ({
  children,
  classes,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  classes?: string
  onClick?: ((event: Event) => void) | undefined
  disabled?: boolean
}) => {
  return (
    <DropdownMenu.Item
      className={`DropdownMenuItem bg-gray-900 hover:bg-gray-800 first:rounded-t-[12px] last:rounded-b-[12px] cursor-pointer ${classes}`}
      onSelect={onClick}
      disabled={disabled}
    >
      {children}
    </DropdownMenu.Item>
  )
}

export const DropdownItemsContainer = ({
  children,
  align,
  sideOffset,
}: {
  children: React.ReactNode
  align?: 'center' | 'end' | 'start' | undefined
  sideOffset?: number | undefined
}) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className="DropdownMenuContent rounded-[12px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideRightAndFade z-10 border bg-gray-900 border-gray-700"
        sideOffset={sideOffset}
        align={align}
        collisionPadding={6}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

import ChatBubble from '../../assets/chat-bubble.svg'
import { T2 } from '../typography/Typography'
import { useAuthContext } from '../../context/naked/AuthContext'
import { TrollboxMessageData, useTrollboxContext } from '../../context/TrollboxContext'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { track } from '@multibase/js'
import { useCallback, useRef, useState } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'

export const TrollBoxBar = () => {
  const { maximized, setTrollboxX } = useTrollboxContext()
  const [isDragging, setIsDragging] = useState(false)

  const dragControl: DraggableEventHandler = (event, data) => {
    event.preventDefault()
    setTrollboxX(data.x)
    if (event.type === 'mousemove' || event.type === 'touchmove') {
      setIsDragging(true)
    }
    if (event.type === 'mouseup' || event.type === 'touchend') {
      setTimeout(() => {
        setIsDragging(false)
      }, 100)
    }
  }

  const nodeRef = useRef(null)
  return (
    <Draggable
      nodeRef={nodeRef}
      axis="x"
      handle=".handle"
      onStart={dragControl}
      onDrag={dragControl}
      onStop={dragControl}
      scale={0.85}
      bounds="parent"
    >
      <div ref={nodeRef} className="flex flex-col bottom-0 right-0 fixed z-20">
        <div className="handle">
          <TrollboxTitlebar isDragging={isDragging} />
        </div>
        {maximized ? <TrollboxBody /> : null}
      </div>
    </Draggable>
  )
}

const TrollboxMessage = (props: TrollboxMessageData) => {
  return (
    <div
      className={`
    flex flex-row my-1 outline-1 outline-gray-800
    text-sm
    ml-2
    `}
    >
      <div className={`text-gray-200`}>{props.sender}</div>
      <div className={`text-white ml-2 w-72 whitespace-normal break-all`}>{props.message}</div>
    </div>
  )
}

const TrollboxBody = () => {
  const { messages, sendMessage } = useTrollboxContext()
  const { idToken, login } = useAuthContext()

  const onSubmit = useCallback(
    (e: any) => {
      e.preventDefault()
      const input = (e.target as any).trollboxInput
      let dat = input.value as string
      input.value = ''
      dat = dat.trim()
      if (input && dat.length > 0) {
        sendMessage(dat)
      }
    },
    [sendMessage]
  )

  const [showLoginPane, setShowLoginPane] = useState(true)

  const loginPane = (
    <div className="flex flex-col justify-center items-center bg-gray-800 h-96">
      <button
        className="text-white bg-gray-900 p-2 rounded hover:bg-blue-600 transition-colors"
        onClick={async () => {
          await login()
          setShowLoginPane(false)
        }}
      >
        Login with GFX
      </button>
      <button
        className="text-white bg-gray-900 p-2 rounded hover:bg-blue-600 transition-colors mt-12"
        onClick={() => {
          setShowLoginPane(false)
        }}
      >
        Chat Anonymously
      </button>
    </div>
  )

  const chatBody = (
    <>
      <div className="flex bg-gray-dark overflow-y-scroll h-96 flex-col-reverse no-scrollbar">
        {messages.map((msg, idx) => {
          return <TrollboxMessage key={idx} sender={msg.sender} message={msg.message} />
        })}
      </div>
      <div className="flex flex-row bg-black border-gray-700 border-t">
        <form className="grow p-2 border-gray-700 border-r" onSubmit={onSubmit}>
          <input
            name="trollboxInput"
            autoComplete="off"
            autoCorrect="off"
            placeholder={idToken !== undefined ? '' : 'chatting anonymously'}
            className="grow text-white bg-gray-900 outline outline-gray-700 outline-1 rounded-[17px] pl-3 py-1 w-full overflow-scroll focus:outline-none"
            onKeyDown={(e) => {
              const maxSize = 300
              if (e.currentTarget.value.length > maxSize) {
                e.currentTarget.value = e.currentTarget.value.slice(0, maxSize)
                e.preventDefault()
              }
            }}
          />
        </form>
        {idToken === undefined ? (
          <button
            className="flex flex-row items-center justify-between pr-6 pl-6 bg-gray-700 gap-x-4"
            onClick={async () => {
              await login()
            }}
          >
            <span className="text-white">Login</span>
            <span>
              <LockClosedIcon width={16} color="white" />
            </span>
          </button>
        ) : (
          <button className="pr-4 pl-4">
            <FaceSmileIcon width={16} color="gray" />
          </button>
        )}
      </div>
    </>
  )

  return <div>{showLoginPane && idToken === undefined ? loginPane : chatBody}</div>
}

const TrollboxTitlebar = ({ isDragging }: { isDragging: boolean }) => {
  const { maximized, setMaximized, hasNewMessages, setLastDisplayedMessageCount, messages } = useTrollboxContext()

  const handleMaximize = () => {
    if (isDragging) return
    track('opened chatbox', {})

    setLastDisplayedMessageCount(messages.length)
    setMaximized((maximized) => !maximized)
  }

  return (
    <>
      <div
        onClick={handleMaximize}
        className="cursor-pointer inline w-full place-content-between flex flex-row bg-gray-900 border border-gray-700 rounded-t-[20px] z-[1]"
      >
        <div className={`py-3 pl-4 gap-x-2 flex`}>
          <div
            className={`absolute left-[12px] w-2 h-2 bg-red-500 rounded-full absolute ${
              !maximized && hasNewMessages ? 'block' : 'hidden'
            }`}
          ></div>

          <img src={ChatBubble} alt="Chat Bubble" className="max-w-[20px] max-h-[18px]" />
          <T2>Chatbox</T2>
        </div>
        <div className="inline py-4 pr-4 ml-32">{maximized ? <PointingDown /> : <PointingUp />}</div>
      </div>
    </>
  )
}

const PointingDown = () => (
  <svg width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.8125 1.125L6.5 4.875L1.1875 1.125"
      stroke="#99A1BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PointingUp = () => (
  <svg width="13" height="6" viewBox="0 0 13 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.1875 4.875L6.5 1.125L11.8125 4.875"
      stroke="#99A1BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

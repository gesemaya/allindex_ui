import { useAuthContext } from './naked/AuthContext'
import { useConfigContext } from './naked/ConfigContext'
import { GFX_CHAT } from '../constants/chainInfo'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'

export interface TrollboxMessageData {
  sender: string
  message: string
}

interface TrollboxContextProps {
  maximized: boolean
  setMaximized: React.Dispatch<React.SetStateAction<boolean>>
  addMessage: (value: TrollboxMessageData) => void

  sendMessage: (content: string) => void

  messages: Array<TrollboxMessageData>

  hasNewMessages: boolean
  setLastDisplayedMessageCount: (value: number) => void
  trollboxX: number
  setTrollboxX: React.Dispatch<React.SetStateAction<number>>
}

const TrollboxContext = createContext({} as TrollboxContextProps)

const blankMessage = (idx: number) => {
  return {
    sender: '',
    message: '',
  }
}
const defaultMsg = [...new Array(10).keys()].map(blankMessage)

interface MsgData {
  Sender: MsgSender
  Timestamp: string
  Extra: string
  Content: string
  Substitutions: any
}

interface MsgSender {
  AuthName: string
  DisplayName: string
  Timestamp: string
}

interface KeyData {
  Key: string
}

export const TrollboxContextProvider = ({ children }: { children: any }) => {
  const [maximized, setMaximized] = useState(false)
  const [socket, setSocket] = useState<ReconnectingWebSocket | undefined>(undefined)
  const [messages, setMessages] = useState<Array<TrollboxMessageData>>([...defaultMsg])
  const [lastDisplayedMessageCount, setLastDisplayedMessageCount] = useState<number>(0)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [trollboxX, setTrollboxX] = useState<number>(0)

  useEffect(() => {
    if (messages.length > 0) {
      setHasNewMessages(lastDisplayedMessageCount < messages.length)
    }
  }, [messages, lastDisplayedMessageCount])

  const [key, setKey] = useState<string>('')
  const {
    features: {
      Chat: { url: chatUrl },
    },
  } = useConfigContext()
  const { idToken, nonce } = useAuthContext()

  const addMessage = (msg: TrollboxMessageData) => {
    setMessages((copy) => {
      if (copy.length > 256) {
        copy.pop()
      }
      return [msg, ...copy]
    })
  }

  const defaultSender = (content: string): void => {
    addMessage({ message: 'not connected to chat', sender: '#system' })
    return
  }

  const currentChannel = 'localhost'

  const acceptedChannels = ['', currentChannel]
  const messageHandlers: any = {
    message: (channel: string, data: MsgData) => {
      if (acceptedChannels.includes(channel)) {
        addMessage({ message: data.Content, sender: data.Sender.DisplayName })
      }
    },
    key: (channel: string, data: KeyData) => {
      setKey(data.Key)
    },
  }

  useEffect(() => {
    const chatSocket = new ReconnectingWebSocket(GFX_CHAT.WS_PATH(chatUrl))
    setSocket((current) => {
      if (current) {
        current?.close()
      }
      return chatSocket
    })
  }, [chatUrl])

  useEffect(() => {
    if (socket === undefined || idToken === undefined || nonce === undefined) {
      return
    }
    socket.send(
      JSON.stringify({
        Type: 'login',
        Args: [idToken, nonce],
      })
    )
  }, [idToken, socket])

  const sendMessage = useCallback(
    (content: string) => {
      if (socket) {
        socket.send(
          JSON.stringify({
            Type: 'send',
            Channel: currentChannel,
            Message: content,
          })
        )
        return
      }
      defaultSender(content)
    },
    [socket]
  )

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (evt) => {
        const dat = JSON.parse(evt.data)
        const h = messageHandlers[dat.Type]
        if (h) {
          if (dat.Channel !== undefined) {
            h(dat.Channel, dat.Data)
          }
        }
      })
      socket.addEventListener('close', () => {
        addMessage({ message: 'disconnected from server...', sender: '#system' })
      })

      socket.addEventListener('error', (err) => {
        addMessage({ message: 'trollbox socket error: ' + err.message, sender: '#system' })
      })
      socket.addEventListener('open', () => {
        socket.send(
          JSON.stringify({
            Type: 'join',
            Args: [currentChannel],
          })
        )
      })
    }
  }, [socket])

  return (
    <TrollboxContext.Provider
      value={{
        maximized,
        setMaximized,
        messages,
        addMessage,
        sendMessage,
        hasNewMessages,
        setLastDisplayedMessageCount,
        trollboxX,
        setTrollboxX,
      }}
    >
      {children}
    </TrollboxContext.Provider>
  )
}

export const useTrollboxContext = (): TrollboxContextProps => {
  const context = useContext<TrollboxContextProps>(TrollboxContext)
  if (context === null) {
    throw new Error('"useTrollboxContext" should be used inside a "TrollboxContextProvider"')
  }

  return context
}

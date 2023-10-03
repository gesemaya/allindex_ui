import { useAuthContext } from '../../context/naked/AuthContext'
import { useConfigContext } from '../../context/naked/ConfigContext'
import { WhitelistBox } from './box'
import { WhitelistActionButton, WhitelistDiscordButton } from './button'
import { WhitelistH1, WhitelistH2, WhitelistHeaders } from './header'
import { WhitelistLogo } from './logo'
import { WhitelistScreen } from './screen'

export const WhitelistProtected = ({ children }: { children: React.ReactNode }) => {
  const {
    features: {
      Whitelist: { enabled },
    },
  } = useConfigContext()
  const { idToken, whitelisted, login, logout } = useAuthContext()

  if (enabled === 'false') {
    return <>{children}</>
  }

  if (idToken === undefined) {
    return (
      <WhitelistScreen>
        <WhitelistBox>
          <WhitelistLogo />
          <WhitelistHeaders>
            <WhitelistH1>Welcome to Oku</WhitelistH1>
            <WhitelistH2>Connect your wallet to start testing the app.</WhitelistH2>
          </WhitelistHeaders>
          <WhitelistActionButton onClick={() => login()}>Connect Wallet</WhitelistActionButton>
        </WhitelistBox>
      </WhitelistScreen>
    )
  }

  if (!whitelisted) {
    return (
      <WhitelistScreen>
        <WhitelistBox>
          <WhitelistLogo />
          <WhitelistHeaders>
            <WhitelistH1>Address not whitelisted</WhitelistH1>
            <WhitelistH2>Reach out to us on Discord if you think you should be on the list.</WhitelistH2>
          </WhitelistHeaders>
          <WhitelistActionButton onClick={() => logout()}>Disconnect</WhitelistActionButton>
          <WhitelistDiscordButton onClick={() => window.open('https://discord.gg/AYVYhPpGyN')} />
        </WhitelistBox>
      </WhitelistScreen>
    )
  }

  return <>{children}</>
}

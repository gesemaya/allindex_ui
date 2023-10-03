import discord from '../../assets/discord-logo.svg'

export const WhitelistActionButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <button
      onClick={() => onClick?.()}
      className={'text-white w-full rounded-[11px] bg-[#4C82FB] hover:bg-[#1267D6] h-[48px] font-medium'}
    >
      {children}
    </button>
  )
}

export const WhitelistDiscordButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className={'mx-auto w-max mt-[32px]'}>
      <button
        onClick={() => onClick?.()}
        className={'h-[40px] w-[40px] bg-[#1A1B1F] rounded-full border border-[#1A1B1F] hover:border-[#1267D6]'}
        style={{
          backgroundImage: `url(${discord})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></button>
    </div>
  )
}

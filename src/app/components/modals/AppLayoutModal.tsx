import { T3 } from '../typography/Typography'
import { colors } from '../../constants/colors'
import { useThemeContext } from '../../context/naked/ThemeContext'
import useMobile from '../../hooks/useMobile'
import { FontWeightEnums, LayoutEnums, ThemeEnums } from '../../types/Enums'
import { MegaphoneIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { useModalContext } from '../../context/naked/ModalContext'

interface IThemeChoice {
  title: string
  color1: string
  color2: string
  currentTheme: ThemeEnums
  setTheme: (value: ThemeEnums) => void
  id: ThemeEnums
}

const ThemeChoice = (props: IThemeChoice) => {
  const { id, currentTheme, setTheme, title, color1, color2 } = props
  const [hovered, setHovered] = useState(false)
  const { isMobile } = useMobile()
  return (
    <button
      className="flex flex-row w-full justify-between items-center p-2 rounded-[10px]"
      style={{ backgroundColor: hovered ? '#FFFFFF10' : '#00000000' }}
      onClick={() => setTheme(id)}
      onMouseEnter={() => {
        setHovered(true)
      }}
      onMouseLeave={() => {
        setHovered(false)
      }}
    >
      <div className="flex gap-2 items-center">
        <div
          className="border-[1px] border-[#404963]"
          style={{
            height: isMobile ? '9px' : '12px',
            width: isMobile ? '9px' : '12px',
            borderRadius: isMobile ? '2px' : '4px',
            backgroundColor: currentTheme === id || hovered ? '#404963' : '#00000000',
          }}
        ></div>
        <T3 weight={FontWeightEnums.REGULAR}>{title}</T3>
      </div>
      <div className="flex gap-2">
        <div
          style={{
            height: isMobile ? '16px' : '24px',
            width: isMobile ? '16px' : '24px',
            borderRadius: isMobile ? '6px' : '8px',
            borderWidth: '1px',
            borderColor: colors.gray[600],
            backgroundColor: color1,
          }}
        ></div>
        <div
          style={{
            height: isMobile ? '16px' : '24px',
            width: isMobile ? '16px' : '24px',
            borderRadius: isMobile ? '6px' : '8px',
            borderWidth: '1px',
            borderColor: colors.gray[600],
            backgroundColor: color2,
          }}
        ></div>
      </div>
    </button>
  )
}

interface ILayout {
  appLayout: LayoutEnums
  setAppLayout: (value: LayoutEnums) => void
}

const DefaultLayout = (props: ILayout) => {
  const { appLayout, setAppLayout } = props

  const isDefault = appLayout === 'default'
  return (
    <button
      className="flex flex-col items-center gap-[6px]"
      onClick={() => {
        setAppLayout(LayoutEnums.DEFAULT)
      }}
    >
      <div
        className="flex flex-col gap-1.5 h-[82px] w-[107px] rounded-[6px] bg-black  hover:scale-[1.05] transition ease-in-out"
        style={{
          borderColor: '#FFFFFF',
          borderWidth: isDefault ? '1px' : '0px',
          padding: isDefault ? '3px' : '4px',
        }}
      >
        <div
          className="flex flex-1 bg-[#141B2B] rounded-[4px] pt-[5px] pb-2 px-[2px] gap-[1px]"
          style={{
            borderColor: '#293249',
            borderWidth: isDefault ? '0px' : '1px',
            paddingTop: isDefault ? '5px' : '4px',
            paddingBottom: isDefault ? '8px' : '7px',
            paddingRight: isDefault ? '2px' : '1px',
            paddingLeft: isDefault ? '2px' : '1px',
          }}
        >
          <div className="flex flex-1 bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
          <div className="flex w-[43px] flex-col gap-[1px]  rounded-[6px]">
            <div className="flex flex-1 bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
            <div className="flex w-full h-[23px] bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
          </div>
          <div className="flex flex-1 bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
        </div>
      </div>
      <h1 className="text-white">Default</h1>
    </button>
  )
}
const AlternateLayout = (props: ILayout) => {
  const { appLayout, setAppLayout } = props

  return (
    <button className="flex flex-col items-center gap-[6px] " onClick={() => setAppLayout(LayoutEnums.ALTERNATE)}>
      <div
        className="flex flex-col gap-1.5 h-[82px] w-[107px] rounded-[6px] bg-black hover:scale-[1.05] transition ease-in-out"
        style={{
          borderColor: '#FFFFFF',
          borderWidth: appLayout === 'alternate' ? '1px' : '0px',
          padding: appLayout === 'alternate' ? '3px' : '4px',
        }}
      >
        <div
          className="flex flex-1 bg-[#141B2B] rounded-[4px] pt-[5px] pb-2 px-[2px] gap-[1px]"
          style={{
            borderColor: '#293249',
            borderWidth: appLayout === 'alternate' ? '0px' : '1px',
            paddingTop: appLayout === 'alternate' ? '5px' : '4px',
            paddingBottom: appLayout === 'alternate' ? '8px' : '7px',
            paddingRight: appLayout === 'alternate' ? '2px' : '1px',
            paddingLeft: appLayout === 'alternate' ? '2px' : '1px',
          }}
        >
          <div className="flex flex-1 bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
          <div className="flex w-[43px] flex-col gap-[1px]  rounded-[6px]">
            <div className="flex flex-1 gap-[1px]">
              <div className="flex flex-1 bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
              <div className="flex flex-1 bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
            </div>
            <div className="flex w-full h-[20px] bg-[#141B2B border-[1px] border-[#293249] rounded-[6px]"></div>
          </div>
        </div>
      </div>
      <h1 className="text-white">Alternate</h1>
    </button>
  )
}

function AppLayoutModal() {
  const { setShowCreatePoolModal } = useModalContext()
  const { appLayout, setAppLayout, setColorScheme, colorScheme } = useThemeContext()
  const { isMobile } = useMobile()
  return (
    <div className={`p-2 pb-[8px]`}>
      <div className="flex justify-center flex-col items-center mx-2 gap-4">
        <T3>Style</T3>
        {!isMobile && (
          <div className="flex flex-row gap-4">
            <DefaultLayout appLayout={appLayout} setAppLayout={setAppLayout} />
            <AlternateLayout appLayout={appLayout} setAppLayout={setAppLayout} />
          </div>
        )}
      </div>
      {!isMobile && <div className="border-[1px] border-[#293249] mt-[19px] mb-7 mx-2"></div>}
      <div
        className="flex flex-col"
        style={{ width: isMobile ? '170px' : '316px', marginTop: isMobile ? '4px' : '0px' }}
      >
        <ThemeChoice
          id={ThemeEnums.DEFAULT}
          currentTheme={colorScheme}
          setTheme={setColorScheme}
          title={'Default'}
          color1={'#FA2B39'}
          color2={'#209853'}
        />
        <ThemeChoice
          id={ThemeEnums.UNICORN_POWER}
          currentTheme={colorScheme}
          setTheme={setColorScheme}
          title={'Unicorn Power'}
          color1={'#FB118E'}
          color2={'#587BFF'}
        />
        <ThemeChoice
          id={ThemeEnums.ACCESSIBLE}
          currentTheme={colorScheme}
          setTheme={setColorScheme}
          title={'Accessible'}
          color1={'#FF7A00'}
          color2={'#004DFA'}
        />
        <ThemeChoice
          id={ThemeEnums.GALACTIC}
          currentTheme={colorScheme}
          setTheme={setColorScheme}
          title={'Galactic'}
          color1={'#2346FD'}
          color2={'#5CFE9D'}
        />
      </div>
      {/*
        {!isMobile && <div className="border-[1px] border-[#293249] mt-[19px] mb-7 mx-2"></div>}
        {!isMobile && <LanguageSelector></LanguageSelector>}
        */}
      {!isMobile && <div className="border-[1px] border-[#293249] mt-[24px] mb-1 mx-2"></div>}
      <a
        href="https://support.gfx.xyz/t/oku-trade"
        target="_blank"
        rel="noreferrer"
        className="rounded-[10px] flex justify-between px-2 py-4 hover:bg-[#FFFFFF10]"
      >
        <T3 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
          Send Feedback
        </T3>
        <MegaphoneIcon width={12} color={colors.gray[100]} />
      </a>
      <div
        className="rounded-[10px] flex justify-between px-2 cursor-pointer py-4 hover:bg-[#FFFFFF10]"
        onClick={() => {
          setShowCreatePoolModal((state) => !state)
        }}
      >
        <T3 weight={FontWeightEnums.SEMIBOLD} color={colors.gray[100]}>
          Create Pool
        </T3>
        <PlusCircleIcon
          color={colors.gray[400]}
          width={16}
          height={16}
          className="hover:stroke-gray-200 cursor-pointer"
          onClick={() => setShowCreatePoolModal((state) => !state)}
        />
      </div>
    </div>
  )
}

export default AppLayoutModal

import SettingsIcon from '../../assets/Icon/Outline/Settings'

function SettingsButton({ classes, iconClasses }: { classes?: string; iconClasses?: string }) {
  return (
    <button className={`hover:bg-[#293249] rounded-full p-2 cursor-pointer ${classes}`}>
      <SettingsIcon classes={iconClasses} />
    </button>
  )
}

export default SettingsButton

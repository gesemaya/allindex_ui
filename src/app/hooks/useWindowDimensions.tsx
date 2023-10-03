import { useWindowContext } from '../context/naked/WindowContext'

function useWindowDimensions() {
  const { width, height } = useWindowContext()
  return { width, height }
}

export default useWindowDimensions

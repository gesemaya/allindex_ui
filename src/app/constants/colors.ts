import tailwindConfig from '../../../tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig)

//TODO: need to fix the typing around this
export const colors = fullConfig.theme?.colors as any

import * as camelcaseKeys from 'camelcase-keys'

export const remove0x = (hex: string): string => {
  if (hex.startsWith('0x')) {
    return hex.substring(2)
  }
  return hex
}

export const append0x = (hex?: string): string => {
  return hex?.startsWith('0x') ? hex : `0x${hex}`
}

export const toCamelcase = (object: any) => {
  try {
    return JSON.parse(
      JSON.stringify(
        camelcaseKeys(object, {
          deep: true,
        }),
      ),
    )
  } catch (error) {
    console.error(error)
  }
  return null
}

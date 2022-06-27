import { SECP256K1_BATCH_TESTNET_LOCK } from './constants'
import { Byte20, ExtraArgs } from './types'

export const generateSecp256k1BatchLock = (pubkeyHash: Byte20, extraArgs: ExtraArgs): CKBComponents.Script => {
  const args = `0x${pubkeyHash}${extraArgs}`
  return {
    ...SECP256K1_BATCH_TESTNET_LOCK,
    args,
  }
}

import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { SECP256K1_BATCH_TESTNET_LOCK } from './constants'
import { Byte20, ExtraArgs } from './types'
import { remove0x } from './utils'

export const generateSecp256k1BatchLock = (pubkeyHash: Byte20, extraArgs: ExtraArgs): CKBComponents.Script => {
  if (remove0x(pubkeyHash).length != 40) {
    throw new Error('The byte length of public hash must be equal to 20')
  }
  if (remove0x(extraArgs).length > 88) {
    throw new Error('The byte length of extra args cannot be greater than 44')
  }
  const args = `0x${remove0x(pubkeyHash)}${remove0x(extraArgs)}`
  return {
    ...SECP256K1_BATCH_TESTNET_LOCK,
    args,
  }
}

export const generateSecp256k1BatchAddress = (
  pubkeyHash: Byte20,
  extraArgs: ExtraArgs,
  isMainnet?: boolean,
): string => {
  const lock = generateSecp256k1BatchLock(pubkeyHash, extraArgs)
  return scriptToAddress(lock, isMainnet)
}

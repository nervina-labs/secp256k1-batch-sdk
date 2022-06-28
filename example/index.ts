import { addressToScript, blake160, privateKeyToPublicKey, scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { generateSecp256k1BatchLock, getCells, collectInputs, SECP256K1_BATCH_TESTNET_CELL_DEP } from '../src'
import CKB from '@nervosnetwork/ckb-sdk-core'

const CKB_NODE = 'https://testnet.ckb.dev/rpc'
const CKB_INDEXER_URL = 'https://testnet.ckb.dev/indexer'
const PRIVATE_KEY = '0x-private-key'
const TRANSFER_CAPACITY = BigInt(200) * BigInt(100000000)
const TO_ADDRESS = 'ckt1qyq897k5m53wxzup078jwkucvvsu8kzv55rqqm6glm'
const FEE = BigInt(2000)

const generateOutputs = async (
  inputCapacity: bigint,
  toLock: CKBComponents.Script,
  changeLock: CKBComponents.Script,
): Promise<CKBComponents.CellOutput[]> => {
  const toOutput = {
    capacity: `0x${TRANSFER_CAPACITY.toString(16)}`,
    lock: toLock,
    type: null,
  }

  const changeCapacity = inputCapacity - FEE - TRANSFER_CAPACITY
  const changeOutput = {
    capacity: `0x${changeCapacity.toString(16)}`,
    lock: changeLock,
    type: null,
  }
  return [toOutput, changeOutput]
}

const bootstrap = async (isMainnet = false) => {
  const pubkeyHash = blake160(privateKeyToPublicKey(PRIVATE_KEY), 'hex')
  const extraArgs = '0x1234567890abcdef'
  const lock = generateSecp256k1BatchLock(pubkeyHash, extraArgs)
  const address = scriptToAddress(lock, isMainnet)

  console.log(address)

  const ckb = new CKB(CKB_NODE)

  const liveCells = await getCells(CKB_INDEXER_URL, lock)
  if (!liveCells) {
    throw new Error('Capacity not enough')
  }
  const { inputs, capacity } = await collectInputs(liveCells, TRANSFER_CAPACITY, FEE)

  const toLock = addressToScript(TO_ADDRESS)

  const outputs = await generateOutputs(capacity, toLock, lock)

  const outputsData = outputs.map(() => '0x')

  const cellDeps = [SECP256K1_BATCH_TESTNET_CELL_DEP]

  let rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' })),
  }

  const signedTx = ckb.signTransaction(PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  const txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.log(`txHash: ${txHash}`)
}

bootstrap()

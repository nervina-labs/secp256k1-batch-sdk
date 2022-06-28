import axios from 'axios'
import { MIN_CAPACITY } from './constants'
import { CollectResult, IndexerCell } from './types'
import { toCamelcase } from './utils'

export const getCells = async (
  ckbIndexerUrl: string,
  lock: CKBComponents.Script,
  type?: CKBComponents.Script,
): Promise<IndexerCell[] | undefined> => {
  const filter = type
    ? {
        script: {
          code_hash: type.codeHash,
          hash_type: type.hashType,
          args: type.args,
        },
      }
    : {
        script: null,
        output_data_len_range: ['0x0', '0x1'],
      }
  let payload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'get_cells',
    params: [
      {
        script: {
          code_hash: lock.codeHash,
          hash_type: lock.hashType,
          args: lock.args,
        },
        script_type: 'lock',
        filter,
      },
      'asc',
      '0x64',
    ],
  }
  const body = JSON.stringify(payload, null, '  ')
  let response = (
    await axios({
      method: 'post',
      url: ckbIndexerUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 20000,
      data: body,
    })
  ).data
  if (response.error) {
    console.error(response.error)
    throw Error('Get cells error')
  } else {
    return toCamelcase(response.result.objects)
  }
}

export const collectInputs = async (
  liveCells: IndexerCell[],
  needCapacity: bigint,
  fee: bigint,
): Promise<CollectResult> => {
  let inputs: CKBComponents.CellInput[] = []
  let sum = BigInt(0)
  for (let cell of liveCells) {
    inputs.push({
      previousOutput: {
        txHash: cell.outPoint.txHash,
        index: cell.outPoint.index,
      },
      since: '0x0',
    })
    sum = sum + BigInt(cell.output.capacity)
    if (sum >= needCapacity + MIN_CAPACITY + fee) {
      break
    }
  }
  if (sum < needCapacity + fee) {
    throw Error('Capacity not enough')
  }
  if (sum < needCapacity + MIN_CAPACITY + fee) {
    throw Error('Capacity not enough for change')
  }
  return { inputs, capacity: sum }
}

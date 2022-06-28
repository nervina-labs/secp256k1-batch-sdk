/// <reference types="@nervosnetwork/ckb-types" />

export type Byte20 = string
export type Hex = string
// The length of ExtraArgs is [0, 44]
export type ExtraArgs = string

export interface IndexerCell {
  blockNumber: CKBComponents.BlockNumber
  outPoint: CKBComponents.OutPoint
  output: CKBComponents.CellOutput
  outputData: Hex[]
  txIndex: Hex
}

export interface CollectResult {
  inputs: CKBComponents.CellInput[]
  capacity: bigint
}

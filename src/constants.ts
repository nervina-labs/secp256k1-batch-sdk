export const MIN_CAPACITY = BigInt(61) * BigInt(100000000)

export const SECP256K1_BATCH_TESTNET_LOCK = {
  codeHash: '0xbfb3059fb28ded2cdec0b187e265b40f6cb593ca05d7824ee80993e8b388ec95',
  hashType: 'type',
  args: '0x',
} as CKBComponents.Script

export const SECP256K1_BATCH_TESTNET_CELL_DEP = {
  outPoint: { txHash: '0xc42410965e06385d452f47f98908706b26a74014b3842b9fe37a981104440891', index: '0x0' },
  depType: 'depGroup',
} as CKBComponents.CellDep

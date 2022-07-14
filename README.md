# Ownership Transfer Bot

## Description

This bot detects transactions where a contract ownership transfer event is emitted.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this bot

- OWNER-TRANSFER
  - Fired when a transaction contains an Ownership Transfer from a non zero address.
  - Severity is always set to "info".
  - Type is always set to "info".
  - Metadata
    - 'previousOwner': The address for the previous owner.
    - 'newOwner': The address for the new owner.
    - 'contractAddress': The contract address with the ownership transfer.


## Test Data

The bot behaviour can be verified with the following transactions:

- tx: 0x73c1a6f45e8eba3e2a62d81e3689d6f96cf0dc73f02e27a98499c6b0f21d320f {
    previousOwner: "0x2372fd8d69da29b4b328b518c6d7e84f3aa25dc3",
    newOwner: "0xb8da95a3b01a6486f8066c16644596d391586579",
    contractAddress: "0x5eb30edfbc45cbd75664e4f04dfcc5218d114aac"
}
-tx: 0x49d889c424fa9c1989f3712ff0ad9c950935d4af9e5fa419b133d4813e0963ef {
    previousOwner: "0xd00e2b1d6b4a1fcfc1a3b0af195595339d02f951",
    newOwner: "0x0000000000000000000000000000000000000000",
    contractAddress: "0x5f3a07dbc2a44d6e1eb792697aae27e13321c9e0"
}

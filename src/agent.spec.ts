import { FindingType, FindingSeverity, Finding, HandleTransaction, createTransactionEvent } from "forta-agent";

import { provideHandleTransaction } from "./agent";
import { isZeroAddress, zeroAddress } from "ethereumjs-util";
import { TRANSFER_OWNER_EVENT } from "./constants";

const testAddress1 = "0x6b51cb10119727a5e5ea3538074fb341f56b09cb";
const testAddress2 = "0x9a1cb10119727a5e5ea3538074fb341f56b05ea";
const testContractAddress = "0x7f51eb44623745a5e5ea3538074fb341f56b07ef";

describe("contract ownership transfer agent", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = provideHandleTransaction();
  });

  describe("handleTransaction", () => {
    it("returns empty findings if there is no OwnershipTransfers event", async () => {
      mockTxEvent.filterLog = jest.fn().mockReturnValue([]);
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(TRANSFER_OWNER_EVENT);
    });

    it("returns empty findings if there is an OwnershipTransfer event from a zero address", async () => {
      const mockOwnershipTransferEvent = { args: { previousOwner: zeroAddress(), newOwner: testAddress2 } };

      mockTxEvent.filterLog = jest.fn().mockReturnValue([mockOwnershipTransferEvent]);
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(TRANSFER_OWNER_EVENT);
    });

    it("returns a finding if there is an OwnershipTransfer event from a non zero address", async () => {
      const mockOwnershipTransferEvent = {
        name: "OwnershipTransferred",
        args: {
          previousOwner: testAddress1,
          newOwner: testAddress2,
        },
        address: testContractAddress,
      };

      mockTxEvent.filterLog = jest.fn().mockReturnValue([mockOwnershipTransferEvent]);
      const findings = await handleTransaction(mockTxEvent);

      const mockEventName = mockOwnershipTransferEvent.name;
      const mockPreviousOwner = mockOwnershipTransferEvent.args.previousOwner;
      const mockNewOwner = mockOwnershipTransferEvent.args.newOwner;
      const mockContractAddress = mockOwnershipTransferEvent.address;

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Ownership Transfer Detection",
          description: `Agent detected ${mockEventName} event.`,
          alertId: "OWNER-TRANSFER-AGENT",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            previousOwner: mockPreviousOwner.toLowerCase(),
            newOwner: mockNewOwner.toLowerCase(),
          },
          addresses: [mockContractAddress],
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(TRANSFER_OWNER_EVENT);
    });
  });
});

import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createNewFinding = (
  eventName: string,
  previousOwner: string,
  newOwner: string,
  contractAddress: string
): Finding => {
  return Finding.fromObject({
    name: "Ownership Transfer Detection",
    description: `Agent detected ${eventName} event.`,
    alertId: "OWNER-TRANSFER-AGENT",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    metadata: {
      previousOwner: previousOwner.toLowerCase(),
      newOwner: newOwner.toLowerCase(),
    },
    addresses: [contractAddress],
  });
};

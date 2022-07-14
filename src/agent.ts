import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { TRANSFER_OWNER_EVENT } from "./constants";
import { createNewFinding } from "./utils";
import { isZeroAddress } from "ethereumjs-util";

export function provideHandleTransaction(): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];
    txEvent.filterLog(TRANSFER_OWNER_EVENT).forEach((ownershipEvent) => {
      //IGNORE WHEN NO OWNERSHIP EVENTS ARE FOUND OR PREVIOUSOWNER == 0X0000...
      if (!ownershipEvent || isZeroAddress(ownershipEvent.args.previousOwner)) {
        return findings;
        //RETURN FINDING WHEN OWNERSHIP IS TRANSFERRED
      } else {
        findings.push(
          createNewFinding(ownershipEvent.args.previousOwner, ownershipEvent.args.newOwner, ownershipEvent.address)
        );
      }
    });
    return findings;
  };
}
export default {
  handleTransaction: provideHandleTransaction(),
};

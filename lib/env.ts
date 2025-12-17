import { zeroAddress, type Address } from "viem";

export const DonationContractAddress =
  (process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS as Address) ?? zeroAddress;

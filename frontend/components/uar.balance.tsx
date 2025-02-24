import { ethers } from "ethers";

import { UbiquityAutoRedeem__factory } from "../src/types/factories/UbiquityAutoRedeem__factory";
import { UbiquityAlgorithmicDollarManager__factory } from "../src/types/factories/UbiquityAlgorithmicDollarManager__factory";
import { ADDRESS } from "../pages/index";
import { useConnectedContext, Balances } from "./context/connected";
import { Dispatch, SetStateAction, useEffect } from "react";

async function _getTokenBalance(
  provider: ethers.providers.Web3Provider | undefined,
  account: string,
  balances: Balances | undefined,
  setBalances: Dispatch<SetStateAction<Balances | undefined>>
): Promise<void> {
  if (provider && account) {
    const manager = UbiquityAlgorithmicDollarManager__factory.connect(
      ADDRESS.MANAGER,
      provider
    );

    const uARRedeem = await manager.autoRedeemTokenAddress();
    const uAR = UbiquityAutoRedeem__factory.connect(uARRedeem, provider);
    const rawBalance = await uAR.balanceOf(account);
    if (balances) {
      if (!balances.uar.eq(rawBalance))
        setBalances({ ...balances, uar: rawBalance });
    }
  }
}

const UarBalance = () => {
  const { account, provider, balances, setBalances } = useConnectedContext();
  useEffect(() => {
    _getTokenBalance(
      provider,
      account ? account.address : "",
      balances,
      setBalances
    );
  }, [balances]);

  if (!account) {
    return null;
  }

  const handleClick = async () =>
    _getTokenBalance(
      provider,
      account ? account.address : "",
      balances,
      setBalances
    );
  return (
    <>
      <div id="uar-balance">
        <div>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 85.45">
              <path d="M75 33.28v28.94a3.72 3.72 0 0 1-1.68 3.11l-.18.12L39.36 85a3.75 3.75 0 0 1-3.52.11l-.2-.11L1.86 65.45a3.73 3.73 0 0 1-1.85-3V51.26l5.08 2.91.35.2a31.49 31.49 0 0 0 30.75-.09l.45-.26 2.07-1.21L67.1 36.19l.33-.19A24.22 24.22 0 0 1 75 33.28zM37.5 0a3.75 3.75 0 0 1 1.64.38l.22.12L73.14 20A3.72 3.72 0 0 1 75 23v2.7a31.33 31.33 0 0 0-11.14 3.71l-.55.31-2.07 1.22-28.4 16.61-.33.2a24 24 0 0 1-23.31.14l-.39-.22L0 42.62v-19.4a3.75 3.75 0 0 1 1.68-3.11l.18-.11L35.64.5A3.73 3.73 0 0 1 37.5 0z" />
            </svg>
          </span>
          <span>
            {balances ? ethers.utils.formatEther(balances.uar) : "0.0"} uAR
          </span>
        </div>
        {/* <button onClick={handleClick}>Get uAR Token Balance</button> */}
      </div>
    </>
  );
};

export default UarBalance;

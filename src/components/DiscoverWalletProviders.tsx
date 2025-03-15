import {  Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { useWallet } from "../context/WalletContext"; 
import { checkNetwork } from "../utilis/networkUtils"; 
import { useNavigate } from "react-router-dom";

interface DiscoverWalletProvidersProps {
  onClose: () => void;
}

export const DiscoverWalletProviders: React.FC<DiscoverWalletProvidersProps> = ({ onClose }) => {
  const {  setWalletAddress } = useWallet(); 
  //const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const providers = useSyncProviders();
  const navigate = useNavigate();

  const handleConnect = async (provider: any) => {
    try {
      const accounts = await provider.provider.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        //setSelectedWallet(accounts[0]);
        setWalletAddress(accounts[0]); 
        localStorage.setItem("walletAddress", accounts[0]);

        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
            } else {
              setWalletAddress(null);
            }
          });
        }

        const currentChain = await checkNetwork();
        // if (currentChain !== "0x82750") {
        //   const confirmSwitch = window.confirm("You're not on the Scroll network. Do you want to switch?");
        //   if (confirmSwitch) {
        //     const switched = await switchNetwork("scroll");
        //     if (!switched) {
        //       alert("Please switch to the Scroll network manually in MetaMask.");
        //       return;
        //     }
        //   } else {
        //     return;
        //   }
        // }

        navigate("/nfts");
        onClose();
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Dialog.Panel className="bg-black p-6 rounded-lg shadow-lg w-80">
            <Dialog.Title className="text-lg font-semibold text-center">Select a Wallet</Dialog.Title>

            <div className="mt-4 space-y-2">
              {providers.length > 0 ? (
                providers.map((provider) => (
                  <button
                    key={provider.info.uuid}
                    onClick={() => handleConnect(provider)}
                    className="flex items-center space-x-3 p-2 border rounded-md hover:bg-pink-500 w-full transition"
                  >
                    <img src={provider.info.icon} alt={provider.info.name} className="w-6 h-6" />
                    <span className="text-sm">{provider.info.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500">No Wallet Providers Found</p>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white bg-pink-500 rounded-md hover:bg-pink-600 transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

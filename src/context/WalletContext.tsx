import { createContext, useContext, useEffect, useState, ReactNode } from "react";


// Define context type
interface WalletContextType {
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>; // FIXED TYPE
  disconnectWallet: () => void;
}

// Create the context with an initial undefined value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
 // localStorage.getItem("walletAddress") || null


 useEffect(() => {
  const savedAddress = localStorage.getItem("walletAddress");
  if (savedAddress) {
    setWalletAddress(savedAddress);
  }
}, []);

  // Function to detect wallet switch
  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        } else {
          setWalletAddress(null);
          localStorage.removeItem("walletAddress");
        }
      });
    }
  };

  // const switchToScroll = async () => {
  //   if (!window.ethereum) {
  //     console.error("MetaMask is not installed!");
  //     return;
  //   }
  
  //   try {
  //     // Try switching to Scroll Sepolia
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: "0x8274F" }], // Correct Scroll Sepolia Chain ID (534351)
  //     });
  
  //     console.log("Switched to Scroll Sepolia successfully!");
  //   } catch (error: any) {
  //     console.error("Switching error:", error);
  
  //     // If the chain is not found, add it first
  //     if (error.code === 4902) {
  //       console.log("Scroll Sepolia not found, attempting to add it...");
  
  //       try {
  //         await window.ethereum.request({
  //           method: "wallet_addEthereumChain",
  //           params: [
  //             {
  //               chainId: "0x8274F", // Correct chain ID for Scroll Sepolia
  //               chainName: "Scroll Sepolia",
  //               rpcUrls: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"], // Make sure this URL is valid
  //               nativeCurrency: {
  //                 name: "Ethereum",
  //                 symbol: "ETH",
  //                 decimals: 18,
  //               },
  //               blockExplorerUrls: ["https://sepolia.scrollscan.com/"],
  //             },
  //           ],
  //         });
  
  //         console.log("Scroll Sepolia added successfully!");
  //       } catch (addError) {
  //         console.error("Failed to add Scroll Sepolia:", addError);
  //       }
  //     }
  //   }
  // };
  
  
  
  // Function to check if a wallet is already connected
  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
        }

      //   const chainId = await window.ethereum.request({ method: "eth_chainId" });
      // if (chainId !== "0x82750") {  // Scroll Sepolia Chain ID
      //   switchToScroll();
      // }

      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    }
  };

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
    //switchToScroll();
  }, []);

  
  useEffect(() => {
    // Save wallet address in localStorage when updated
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
    } else {
      localStorage.removeItem("walletAddress");
    }
  }, [walletAddress]);

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

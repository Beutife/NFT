export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: "0x1", // Ethereum Mainnet
  },
  bsc: {
    chainId: "0x38", // Binance Smart Chain
  },
  scroll: {
    chainId: `0x${(534352).toString(16)}`, // Scroll Network Chain ID in HEX
    chainName: "Scroll",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.scroll.io/"], 
    blockExplorerUrls: ["https://scrollscan.com/"],
  },
};

// Function to check the current network
export const checkNetwork = async () => {
  if (!window.ethereum) return null;

  try {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return chainId;
  } catch (error) {
    console.error("Error checking network:", error);
    return null;
  }
};


// Function to switch network
export const switchNetwork = async (network: keyof typeof SUPPORTED_NETWORKS) => {
  if (!window.ethereum) {
    alert("MetaMask is not installed.");
    return false;
  }

  const networkData = SUPPORTED_NETWORKS[network];

  try {
    console.log(`Switching to network: ${network}`);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: networkData.chainId }],
    });
    console.log(`Successfully switched to ${network}`);
    return true;
  } catch (error: any) {
    console.warn(`${network} not found. Adding the network...`);

    if (error.code === 4902) {
      try {
        const { chainId, ...rest } = networkData;
        
        // Ensure chainId is HEX
        //const hexChainId = `0x${parseInt(chainId, 10).toString(16)}`;
        
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId, ...rest }],
        });

        console.log(`${network} added successfully!`);
        return true;
      } catch (addError) {
        console.error("Failed to add the network:", addError);
        return false;
      }
    } else {
      console.error("Error switching network:", error);
      return false;
    }
  }
};

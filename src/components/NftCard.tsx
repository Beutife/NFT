// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import abi from "../nftabi.json";
// import { Network, Alchemy } from "alchemy-sdk";
// import axios from "axios"; // For Alchemy API calls

// const contractAddress = "0x1dA04B1BC176F72E7D013385cDb23C34e11FB664";
// const alchemyApiKey = "gBrRL8GNZB7bQQh-RXdd3W1rAal7R_M8";

// // Configure Alchemy SDK
// const settings = {
//   apiKey: alchemyApiKey,
//   network: Network.MATIC_MAINNET, // Adjust if using a different network
// };
// const alchemy = new Alchemy(settings);

// interface NFT {
//   tokenId: string;
//   contractAddress: string;
//   metadata: any;
//   image: string;
// }



// const useNFTs = (contractAddress: string, userAddress: string | null) => {
//   const [nfts, setNFTs] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
//   const [userAddr, setUserAddr] = useState<string | null>(userAddress);



//   // Connect Wallet
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       setError("No wallet detected. Please install MetaMask.");
//       return;
//     }
//     try {
//       const web3Provider = new ethers.BrowserProvider(window.ethereum);
//       setProvider(web3Provider);

//       const signer = await web3Provider.getSigner();
//       setSigner(signer);
//       setUserAddr(await signer.getAddress());
//     } catch (err: any) {
//       console.error("Wallet connection error:", err);
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     connectWallet();
//   }, []);


//   // Helper function to filter 2D NFTs
//   const is2DImage = (nft: any) => {
//     if (!nft.media || nft.media.length === 0) return false; // Skip if no media
//     const url = nft.media[0].gateway;
//     return url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".gif");
//   };
   
//   // Fetch NFTs using Alchemy API
//   const fetchNFTs = async () => {
//     if (!userAddress) return;
//     setLoading(true);
//     setError(null);
    

//     // try {
//     //   const response = await axios.get(
//     //     `${alchemyBaseUrl}${alchemyApiKey}/getNFTs?owner=${userAddress}`
//     //   );
     
//     try {
//       const response = await alchemy.nft.getNftsForOwner(userAddress, { contractAddresses: [contractAddress] });
//       console.log(response.ownedNfts)
//       console.log("Alchemy NFT Response:", response);
//       console.log("Owned NFTs:", response.ownedNfts);
      
      
//       const nftData = response.ownedNfts
//         .filter(is2DImage) //  Only 2D NFTs
//         .map((nft: any) => ({
//           tokenId: parseInt(nft.tokenId, 16).toString(), // Convert from hex to decimal,
//           contractAddress: nft.contract.address,
//           metadata: nft.rawMetadata || {},
//           image: nft.media.length > 0 ? nft.media[0].gateway : "",
//         }));

//       setNFTs(nftData);
//     } catch (err: any) {
//       console.error("Error fetching NFTs:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNFTs();
//   }, [userAddress]);

//   return { nfts, loading, error, status, message, setMessage, connectWallet, userAddress, signer };
// };

// export default useNFTs;
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { Network, Alchemy } from "alchemy-sdk";

// const alchemyApiKey = "gBrRL8GNZB7bQQh-RXdd3W1rAal7R_M8"; // 🔹 Replace with your Alchemy API Key

// const settings = {
//   apiKey: alchemyApiKey,
//   network: Network.MATIC_MAINNET, // 🔹 Change this if using Ethereum
//   maxRetries: 10,
// };

// const alchemy = new Alchemy(settings);

// const useNFTs = (contractAddress: string) => {
//   const [nfts, setNFTs] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
//   const [userAddr, setUserAddr] = useState<string | null>(null);

//   // 🔹 Connect Wallet (MetaMask)
//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       setError("No wallet detected. Please install MetaMask.");
//       return;
//     }
//     try {
//       const web3Provider = new ethers.BrowserProvider(window.ethereum);
//       setProvider(web3Provider);

//       const signer = await web3Provider.getSigner();
//       setSigner(signer);
//       const address = await signer.getAddress();
//       setUserAddr(address);
//     } catch (err: any) {
//       console.error("Wallet connection error:", err);
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     connectWallet();
//   }, []);

//   // 🔹 Fetch NFTs using Alchemy API
//   const fetchNFTs = async () => {
//     if (!userAddr) return;
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("Fetching NFTs for address:", userAddr);

//       //  Correctly fetch NFTs for the wallet
//       const response = await alchemy.nft.getContractsForOwner(userAddr, {
//         contractAddresses: contractAddress ? [contractAddress] : undefined,
//         omitMetadata: false,  // ✅ Ensure metadata is fetched
//         tokenType: "erc1155", // ✅ Specify ERC-1155
//       });
//       console.log(response)
//       console.log("Total NFTs found:", response.totalCount);

//       const nftData = await Promise.all(
//         response.ownedNfts.map(async (nft) => {
//           if (!nft.contract || !nft.tokenId) {
//             return null; // Skip invalid NFTs
//           }
//           // ✅ Fetch metadata (Handles tokenId properly)
//           //const metadata = await alchemy.nft.getNftMetadata(nft.contract.address, nft.tokenId);
//           const metadata = await alchemy.nft.getNftMetadata(nft.contract.address, nft.tokenId);
//     if (!metadata) {
//       console.warn(`Metadata not found for NFT ${nft.tokenId}`);
//       return null;
//     }
//           return {
//             tokenId: nft.tokenId,
//             contractAddress: nft.contract.address,
//             name: metadata?.metadata?.name ?? "Unknown NFT",
//             tokenType: metadata?.tokenType ?? "Unknown",
//             image:
//               metadata?.metadata?.image ??
//               metadata?.metadata?.media?.[0]?.gateway ??
//               metadata?.tokenUri?.raw ??
//               "No Image Available",
//             tokenUri: metadata?.tokenUri?.gateway ?? "No Token URI",
//             lastUpdated: metadata?.timeLastUpdated ?? "N/A",
//           };
//         })
//       );

//       setNFTs(nftData);
//     } catch (err: any) {
//       console.error("Error fetching NFTs:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userAddr) fetchNFTs(); // ✅ Ensure wallet is connected before fetching
//   }, [userAddr]);

//   return { nfts, loading, error, connectWallet, userAddr, signer };
// };

// export default useNFTs;
import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface NFT {
  tokenId: string;
  name: string;
  image: string;
  description: string;
  traits: { trait_type: string; value: string }[];
}
const OPENSEA_API_KEY = "88ac8aae7b4d41ed8111db925e0b774f"; // Replace with your OpenSea API Key
console.log(OPENSEA_API_KEY);

const useNFTs = (contractAddress: string) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [userAddr, setUserAddr] = useState<string | null>(null);


  console.log(userAddr);
  console.log(contractAddress)
  // Connect Wallet (MetaMask)
   const connectWallet = async () => {
     if (!window.ethereum) {
       setError(null);
       return;
     }
     try {
       const web3Provider = new ethers.BrowserProvider(window.ethereum);
       setProvider(web3Provider);

       const signer = await web3Provider.getSigner();
       setSigner(signer);
       const address = await signer.getAddress();
       setUserAddr(address);
     } catch (err: any) {
       console.error("Wallet connection error:", err);
       setError(err.message);
     }
   };

   useEffect(() => {
     connectWallet();
   }, []);


  // 🔹 Fetch NFTs from OpenSea API
  const fetchNFTs = async () => {
    if (!contractAddress || !userAddr) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const OPENSEA_API_URL = `https://api.opensea.io/api/v2/chain/ethereum/account/${userAddr}/nfts`;
    const params = new URLSearchParams({
      owner: userAddr,
      asset_contract_address: contractAddress,
      chain: "ethereum",
      limit: '20',
      include_orders: 'false'
    });
   
  
    const maxRetries = 3;
    let retries = 0;
    
    try {
      //const OPENSEA_API_URL = `https://api.opensea.io/api/v2/chain/polygon/account/${userAddr}/nfts`;
      

      const response = await fetch(`${OPENSEA_API_URL}?${params.toString()}`, {
        headers: { "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEA_API_KEY || "",
          'Accept': 'application/json'
         },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError(null);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

  //     const data = await response.json();
  //     setNFTs(
  //       data.nfts.map( (nft  : any) => ({
  //         tokenId: nft.identifier,
  //         name: nft.metadata?.name || "Unnamed NFT",
  //         image: nft.metadata?.image_url || "No Image Available",
  //         description: nft.metadata?.description || "No Description",
  //         traits: nft.metadata?.traits || [],
  //       }))
  //     );
  //   } catch (err: any) {
  //     console.error(err instanceof Error);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const data = await response.json();
  const processedNFTs = data.assets.map((asset: any): NFT => ({
    tokenId: asset.token_id,
    name: asset.name || "Unnamed NFT",
    image: asset.image_url || "No Image Available",
    description: asset.description || "No Description",
    traits: asset.traits || []
  }));

  setNFTs(processedNFTs);
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
  setError(null);
  console.error('Error fetching NFTs:', err);
} finally {
  setLoading(false);
}
};


useEffect(() => {
  fetchNFTs();
}, [contractAddress, userAddr]);

  return { nfts, loading, error };
};

export default useNFTs;

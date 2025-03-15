// import Header from "../components/Header";


// const Nfts = () => {
//   return (
//     <div className="bg-black min-h-screen text-pink-500 p-6">
//       {/* Header */}
//       <Header />

//       <div className="flex gap-20 justify-center">
//         {/* Main Content */}
//         <div className="mt-8 flex flex-col items-center">
//           <h3 className="text-lg font-semibold mb-2">selected PFP</h3>
//           <div className="border border-cyan-400 w-60 h-60 flex items-center justify-center"></div>
//           <button className="mt-4 px-6 py-2 bg-pink-500 text-black rounded-lg hover:bg-black hover:text-pink-500 border border-pink-500 transition">Create full body image</button>
//         </div>
        
//        {/* NFT Grid */}
// <div className="mt-10 text-center">
//   <h3 className="text-lg font-semibold mb-4">Select your image to create an avatar</h3>
//   <div className="grid grid-cols-4 gap-4 justify-center">
//     {[...Array(8)].map((_, index) => (
//       <div key={index} className="flex flex-col items-center border border-cyan-400 w-32 h-32 p-2">
//         <div className="flex items-center justify-center flex-grow">
//           {/* NFT image will be dynamically inserted here */}
//         </div>
//         <p className="mt-2 text-sm">Bored Ape #{index + 10000}</p>
//         <button className="mt-2 px-4 py-2 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition">
//           select
//         </button>
//       </div>
//     ))}
//   </div>
// </div>

//       </div>

//     </div>
//   );
// };

// export default Nfts;

import { useState } from "react";
import Header from "../components/Header";
import useNFTs from "../components/NftCard";
import NFTCard from "../components/nftsDisplay"; 


const contractAddress = "0x1dA04B1BC176F72E7D013385cDb23C34e11FB664"; 

interface NFT {
  tokenId: string;
  metadata: { image: string };
  contractAddress: string;
}

const Nfts = () => {
  
  
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { nfts, loading, error, connectWallet } = useNFTs(contractAddress) as {
    nfts: NFT[];
    loading: boolean;
    error: string | null;
    connectWallet?: () => void;
  };
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);

  console.log("NFTs Data:", nfts);
  console.log("Loading:", loading);
  console.log("Error:", error);

  const sendSelectedNFT = async (selectedNFT: any) => {
    if (!selectedNFT || !userAddress) {
      console.error("No NFT selected or wallet not connected.");
      return;
    }

    try {
      const response = await fetch("https://your-backend.com/generate-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: userAddress,
          originalNFTId: selectedNFT.tokenId,
          originalContract: selectedNFT.contractAddress,
          imageUrl: selectedNFT.metadata.image,
        }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.success) {
        console.log("3D Image URL:", data.imageUrl);
      } else {
        console.error("Error from backend:", data.message);
      }
    } catch (error) {
      console.error("Error sending NFT to backend:", error);
    }
  };

  const dummyNFT = {
    metadata: { image: "https://example.com/sample-nft.png" },
    tokenId: "1234",
    contractAddress: "0x0000000000000000000000000000000000000000"
  };

  //const options = {method: 'GET', headers: {accept: 'application/json'}};

  // const mintNFT = async (nft: NFT) => {
  //   if (!userAddress) {
  //     console.error("Wallet not connected");
  //     return;
  //   }

  //   try {
  //     // 1️ Request signature from the backend
  //     const response = await fetch("https://your-backend.com/api/mint-request", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userAddress,
  //         tokenId: nft.tokenId,
  //         uri: nft.metadata.image, // IPFS URL or image link
  //         originalContract: contractAddress,
  //         originalTokenId: nft.tokenId,
  //         chainId: 1, // Update with your network
  //       }),
  //     });

  //     const { signature, tokenId } = await response.json();
  //     console.log("Received Signature:", signature);

  //     // 2️ Call the smart contract mint function
  //     await mintOnBlockchain(tokenId, signature);
  //   } catch (error) {
  //     console.error("Error minting NFT:", error);
  //   }
  // };

  // const mintOnBlockchain = async (tokenId: string, signature: string) => {
  //   console.log(`Minting NFT ${tokenId} with signature ${signature}`);
  //   // TODO: Call smart contract mint function here
  // };

  return (
    <div className="bg-black min-h-screen text-pink-500 p-6">
      <Header />

      <div className="flex gap-20 justify-center">
        {/* Main Content */}
        {/* Selected NFT Display */}
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Selected PFP</h3>
          <div className="border border-cyan-400 w-60 h-60 flex items-center justify-center">
            {selectedNFT ? (
              <img src={selectedNFT.metadata.image} alt="Selected NFT" className="w-full h-full object-cover" />
            ) : (
              <p>Select an NFT</p>
            )}
          </div>
          <button className="mt-4 px-6 py-2 bg-pink-500 text-black rounded-lg hover:bg-black hover:text-pink-500 border border-pink-500 transition">
            Create full-body image
          </button>
        </div>
        

        {/* NFT Grid */}
        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold mb-4">Select your image to create an avatar</h3>
          

          {loading && <p>Loading NFTs...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-4 gap-4 justify-center">
            {nfts.length > 0 ? (
              nfts.map((nft, index) => (
                <NFTCard
                  key={index}
                  imageUrl={nft.metadata.image}
                  index={index}
                  onClick={() => {
                    setSelectedNFT(nft);
                    sendSelectedNFT(nft);
                  }}
                />
              ))
            ) : (
              <p>No NFTs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nfts;

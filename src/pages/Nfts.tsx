/* import { useState, useEffect } from "react";
import Header from "../components/Header";
import NFTCard from "../components/nftsDisplay";
import { Network, Alchemy } from "alchemy-sdk";
import type { OwnedNft } from "alchemy-sdk";

interface NFT {
  tokenId: string;
  media: { gateway: string }[];
  contract: { address: string };
}

const WALLET_ADDRESS = "0x5180db8F5c931aaE63c74266b211F580155ecac8"; 
const ALCHEMY_API_KEY = "a9_mNk6aLtXOO2JPv3px7es2LZZ_D19N"; 
const Nfts = () => {
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);
      try {
        const alchemy = new Alchemy({
          apiKey: ALCHEMY_API_KEY,
          network: Network.MATIC_MAINNET,
        });
        const response = await alchemy.nft.getNftsForOwner(WALLET_ADDRESS);

        const mappedNFTs: NFT[] = response.ownedNfts.map((nft: OwnedNft) => {
          
          const owned = nft as unknown as {
            tokenId?: string;
            id?: { tokenId?: string };
            media?: { gateway: string }[];
            tokenUri?: { gateway?: string };
            contract: { address: string };
          };

          return {
            tokenId: owned.tokenId || owned.id?.tokenId || "",
            media:
              owned.media && owned.media.length > 0
                ? owned.media
                : [{ gateway: owned.tokenUri?.gateway || "/fallback.jpg" }],
            contract: owned.contract,
          };
        });

        setUserNFTs(mappedNFTs);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError("Failed to fetch NFTs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="bg-black min-h-screen text-pink-500 p-6">
      <Header />

      <div className="flex flex-col lg:flex-row gap-10 justify-center">
        
        <div className="mt-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Selected PFP</h3>
          <div className="border border-cyan-400 w-60 h-60 flex items-center justify-center">
            {selectedNFT ? (
              <img
                src={selectedNFT.media?.[0]?.gateway || "/fallback.jpg"}
                alt="Selected NFT"
                className="w-full h-full object-cover"
              />
            ) : (
              <p>Select an NFT</p>
            )}
          </div>
          <button className="mt-4 px-6 py-2 bg-pink-500 text-black rounded-lg hover:bg-black hover:text-pink-500 border border-pink-500 transition">
            Create full-body image
          </button>
        </div>

        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold mb-4">Your NFTs</h3>

          {loading && <p>Loading NFTs...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
            {userNFTs.length > 0 ? (
              userNFTs.map((nft) => (
                <NFTCard
                  index={0}
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  imageUrl={nft.media?.[0]?.gateway || "/fallback.jpg"}
                  onClick={() => setSelectedNFT(nft)}
                />
              ))
            ) : (
              !loading && <p>No NFTs found in your wallet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nfts;
*/
import { useState, useEffect } from "react";
import Header from "../components/Header";
import NFTCard from "../components/nftsDisplay";
import { Network, Alchemy } from "alchemy-sdk";
import type { OwnedNft } from "alchemy-sdk";
import { config } from "dotenv"
config()

interface NFT {
  tokenId: string;
  imageUrl: string;
  contract: { address: string };
}

//@beutech 
// the wallet below is vitalik is wallet address
// it has enough nft you can use to fix the ui

const WALLET_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";




const api_key = process.env.ALCHEMY_API_KEY;

if(!api_key){
  console.error("input your api key in the env file");
}

const getNFTImageURL = (nft: OwnedNft): string => {
  const owned = nft as unknown as {
    tokenId?: string;
    id?: { tokenId?: string };
    media?: { gateway: string }[];
    tokenUri?: { gateway?: string; raw?: string };
    image?: { cachedUrl?: string };
    contract: { address: string };
  };

  if (owned.image?.cachedUrl) {
    return owned.image.cachedUrl;
  } else if (owned.media && owned.media.length > 0 && owned.media[0].gateway) {
    return owned.media[0].gateway;
  } else if (owned.tokenUri?.gateway) {
    return owned.tokenUri.gateway;
  } else if (owned.tokenUri?.raw && owned.tokenUri.raw.startsWith("ipfs://")) {
    return owned.tokenUri.raw.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return "/fallback.jpg";
};

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
        //@beutech
        //i'm using base mainnet bcus it's has less spams of nfts
        const alchemy = new Alchemy({
          apiKey: api_key,
          network: Network.BASE_MAINNET,
        });
        const response = await alchemy.nft.getNftsForOwner(WALLET_ADDRESS);
        console.log(response);

        const mappedNFTs: NFT[] = response.ownedNfts.map((nft: OwnedNft) => ({
          tokenId: nft.tokenId || ((nft as any).id?.tokenId) || "",
          imageUrl: getNFTImageURL(nft),
          contract: nft.contract,
        }));

        setUserNFTs(mappedNFTs);
        console.log(
          `Console check, Wallet Address: ${WALLET_ADDRESS} NFTs owned`,
          mappedNFTs
        );
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
                src={selectedNFT.imageUrl}
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
              userNFTs.map((nft, index) => (
                <NFTCard
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  index={index}
                  imageUrl={nft.imageUrl}
                  onClick={() => setSelectedNFT(nft)}
                />
              ))
            ) : (
              !loading && <p>No NFTs found in {WALLET_ADDRESS}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nfts;
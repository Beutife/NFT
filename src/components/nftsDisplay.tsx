import React from "react";
interface NFTCardProps {
  imageUrl: string;
  index: number;
  onClick: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ imageUrl,index,onClick}) => {
/*   if(index == 0) {
    console.log(`imageUrl ${imageUrl}`);
  }; */
  return (
    <div className="flex flex-col items-center border border-cyan-400 w-32 h-32 p-2 "  onClick={onClick}>
      <div className="flex items-center justify-center flex-grow">
        <img src={imageUrl} alt={`NFT ${index}`} className="w-full h-full object-cover" />
      </div>
      <button className="mt-2 px-4 py-2 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition">
        Select
      </button>
    </div>
  );
};

export default NFTCard;

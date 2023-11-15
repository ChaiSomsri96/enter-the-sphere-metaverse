//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
contract SphereToken is ERC1155Upgradeable {
    uint private maxTokenID;
    mapping (uint => string) private tokenURIs;
    mapping (uint => uint) private remainingSupply;    
    string private baseTokenURI;
    address private _owner;

    function initialize() initializer public {
        __ERC1155_init("");
        _owner = _msgSender();
        maxTokenID = 0;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    modifier validateSupply(uint[] memory ids, uint[] memory quantities) {
        for(uint i = 0; i < ids.length; i ++) {
            require(_exists(ids[i]), string( abi.encodePacked("invalid(TokenID: ", Strings.toString(ids[i]), ")")));
            require(quantities[i] > 0, string(abi.encodePacked("count error(TokenID: ", Strings.toString(ids[i]), ")")));
            require(remainingSupply[ids[i]] > 0, string(abi.encodePacked("drained and locked(TokenID: ", Strings.toString(ids[i]), ")")));
            require(quantities[i] <= remainingSupply[ids[i]], string(abi.encodePacked("not enough supply(TokenID: ", Strings.toString(ids[i]), ")")));
        }
        _;   
    }

    modifier newTokenValidate(uint[] memory tokenIds, uint[] memory supplyCaps) {
        for(uint i = 0; i < tokenIds.length; i ++) {
            require(supplyCaps[i] > 0, string(abi.encodePacked("supplycap should be greater than zero(TokenID: ", Strings.toString(tokenIds[i]), ")")));
            require(!_exists(tokenIds[i]), string(abi.encodePacked("tokenID exist(TokenID: ", Strings.toString(tokenIds[i]), ")"))); 
            if(maxTokenID < tokenIds[i]) maxTokenID = tokenIds[i];
        }
        _;
    }

    function addInitialTokenType(uint[] memory totalSupplies, string memory baseURI) external onlyOwner returns (uint) {
        require(totalSupplies.length > 0, "Initial Token Size Error");
        maxTokenID = maxTokenID + 1;
        for(uint tokenID = maxTokenID; tokenID < maxTokenID + totalSupplies.length; tokenID ++) {
            remainingSupply[tokenID] = totalSupplies[tokenID - maxTokenID];
        }
        baseTokenURI = baseURI;
        maxTokenID = maxTokenID + totalSupplies.length - 1;
        return maxTokenID;
    }

    function addMultiTokenTypes(
        uint[] memory tokenIds, uint[] memory supplyCaps, string[] memory tokenURI
    ) external onlyOwner newTokenValidate(tokenIds, supplyCaps)
    {   
        for(uint i = 0; i < tokenIds.length; i ++) {
            remainingSupply[tokenIds[i]] = supplyCaps[i];
            tokenURIs[tokenIds[i]] = tokenURI[i];
        }
    }

    function mintTokens(
        address to, uint[] memory ids, uint[] memory quantities   
    ) public onlyOwner validateSupply(ids, quantities){
        _mintBatch(to, ids, quantities, "");
    }

    function burnBatch(
        address from, uint256[] memory ids, uint256[] memory amounts 
    ) public onlyOwner {
        _burnBatch(from, ids, amounts);
    }

    function uri(uint tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "SphereToken#uri: NONEXISTENT_TOKEN");
        if(bytes(tokenURIs[tokenId]).length == 0) {
            return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId), ".json"));
        }     
        else {
            return tokenURIs[tokenId];
        }
    }

    function setTokenURI(uint tokenId, string memory tokenURI) public onlyOwner {
        require(_exists(tokenId), "SphereToken#uri: NONEXISTENT_TOKEN");
        tokenURIs[tokenId] = tokenURI;
    }

    function getBalance(uint cursor, uint howMany) external view returns (uint256[] memory, uint256) {
        if(maxTokenID < 1) {
            return (new uint256[](0), 0);
        }

        address[] memory addresses = new address[](maxTokenID);
        uint256[] memory registeredTokens = new uint256[](maxTokenID);
        for (uint _id = 1; _id <= maxTokenID; _id++) {
            addresses[_id - 1] = _msgSender();
            registeredTokens[_id - 1] = _id;
        }

        return _fetchPage(balanceOfBatch(addresses, registeredTokens),cursor, howMany);
    }
    
    function _beforeTokenTransfer(
        address operator, address from, address to, uint[] memory ids, uint[] memory amounts, bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        if(from == address(0)) {
            for(uint i = 0; i < ids.length; ++i) {
                remainingSupply[ids[i]] -= amounts[i];
            }
        }

        if(to == address(0)) {
            for(uint i = 0; i < ids.length; ++i) {
                remainingSupply[ids[i]] += amounts[i];
            }
        }
    }

    function _exists(uint tokenId) internal view returns (bool) {
        return remainingSupply[tokenId] != 0; 
    }

    function _fetchPage(uint[] memory arr, uint cursor, uint howMany) private pure returns (uint[] memory values, uint256 newCursor)
    {
        uint length = howMany;
        if (length > arr.length - cursor) {
            length = arr.length - cursor;
        }
        values = new uint[](length);
        for (uint i = 0; i < length; i++) {
            values[i] = arr[cursor + i];
        }
        return (values, cursor + length);
    }
}
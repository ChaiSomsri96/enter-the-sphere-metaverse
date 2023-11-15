const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

let sphere_token;
describe("SphereToken Smart Contract Tests", function() {
    this.beforeEach(async function() {
        const SphereToken = await ethers.getContractFactory("SphereToken");
        sphere_token = await upgrades.deployProxy(SphereToken, []);
        await sphere_token.deployed();
    })

    it("Simple Test for Multi Token", async function() {
        try {
            [account1, account2] = await ethers.getSigners();  
            // This is card supply list from cards.json and we can create initial 73 tokens
            let totalSupplies = [180, 120, 150, 140, 200]; 
            /* 
            The basic url will be the same for inital tokens because they will be uploaded at the same time using Pinata
            The url looks like this for initial tokens.
            https://base_uri/{tokenId}.json
            ex) 
                https://base_uri/1.json
                https://base_uri/2.json
                ...
                https://base_uri/73.json
            */
            let baseTokenURI = "https://base_uri/";
            const tx1 = await sphere_token.connect(account1).addInitialTokenType(totalSupplies, baseTokenURI);

            let getSecondTokenURI = await sphere_token.uri(2);
            console.log("getSecondTokenURI==>", getSecondTokenURI) 

            /*
            You can use [createToken] function after you want to mint second edition of the card.
            ex)
                [Random Friend Second Edition]
            */
            const tempTokenIds = [6, 8]; 
            const tokenSupplyLimitation = [200, 180];
            const tokenURI = ["https://ifps_uri_add/234.json", "https://ifps_uri_add/239.json"];
            const tx2 = await sphere_token.connect(account1).addMultiTokenTypes(tempTokenIds, tokenSupplyLimitation, tokenURI);

            const tx5 = await sphere_token.connect(account1).addMultiTokenTypes([10], [100], ["https://garaokay/dfd/ppgh/fllowow/son"]);
            /*
            tokenId is 6.
            When you deploy contract ,  createToken function will return mint tokenId but
            it doesn't return tokenId in local env so I use manual tokenId - 6.
            */ 
            let getSixthTokenURI = await sphere_token.uri(8);
            console.log("getSixthTokenURI==>", getSixthTokenURI)

            /*
            change tokenID(2)'s tokenURI  (to update metadata of card)
            */
           const tx3 = await sphere_token.connect(account1).setTokenURI(2, "https://ipfs_changed_tokenID2_url");
           getSecondTokenURI = await sphere_token.uri(2);
           console.log("getSecondTokenURI(2)==>", getSecondTokenURI)

            /*
            test mint function but it will revert transaction with message "Exceed Token Supply Limitation"
            when token supply number exceeds supply limitation.
            mint tokenId 6 
            */
           const mintTokenIds = [2, 6];
           const mintCounts = [10, 15];
           await sphere_token.connect(account1).mintTokens(account1.address, mintTokenIds, mintCounts);
           expect (await sphere_token.balanceOf(account1.address, 6)).to.equal(15);

           /*
           safeTransferFrom function
           ex)
           transfer token(tokenID: 2) (quantity 2) and token(tokenID: 6) (quantity 5) from address1 to address2
           */
           const tx4 = await sphere_token.connect(account1).safeBatchTransferFrom(account1.address, account2.address, [2, 6], [2, 5], 0x00);

           const balance1 = await sphere_token.connect(account1).getBalance(0, 16);
           const balance2 = await sphere_token.connect(account2).getBalance(0, 16);

           console.log("address1 balance==>", balance1);
           console.log("address2 balance==>", balance2);
        }
        catch(err) {
            console.log("transaction Faield==>", err);
        }
    })
})
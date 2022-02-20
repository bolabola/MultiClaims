// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

interface passNFT {
    function claim(address receiver,uint256 tokenId,uint256 quantity,bytes32[] calldata proofs) external;
}
contract multiClam {
    address constant contra = address(0x4867f7ACb9078d2b462442c5ca3DBa01456844B5);
    function call(uint256 times) public {
        for(uint i=0;i<times;++i){
            new claimer(contra);
        }
    }
}
contract claimer{
    constructor(address contra){
        bytes32[] memory proofs;
        passNFT(contra).claim(address(tx.origin),2,1,proofs);
        selfdestruct(payable(address(msg.sender)));
    }
}
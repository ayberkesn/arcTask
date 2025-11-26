// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

contract SudokuVerifier {
    IVerifier public verifier;
    mapping(bytes32 => bool) public verifiedCommitments;

    event SudokuVerified(bytes32 indexed commitment, address indexed solver);

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }

    function verifySudoku(bytes calldata _proof, bytes32 _commitment) external {
        bytes32[] memory publicInputs = new bytes32[](1);
        publicInputs[0] = _commitment;

        bool result = verifier.verify(_proof, publicInputs);
        require(result, "Invalid Proof");

        verifiedCommitments[_commitment] = true;
        emit SudokuVerified(_commitment, msg.sender);
    }
}

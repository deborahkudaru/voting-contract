// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Voting {
    string[] public candidates;

    mapping(string => uint) public votes;
    mapping(address => bool) public hasVoted;

    uint public votingDeadline;
    address public owner;

    event VotesCast(address indexed voter, string candidate);
    event Candidate(string candidate);

    constructor(string[] memory _candidates, uint _duration) {
        require(_candidates.length > 0, "no candidtate yet");
        require(_duration > 0, "must set duration");
        owner = msg.sender;
        candidates = _candidates;
        votingDeadline = block.timestamp + _duration;

        for (uint i = 0; i < _candidates.length; i++) {
            votes[_candidates[i]] = 0;
            emit Candidate(_candidates[i]);
        }
    }

    function castVote(string memory _candidate) external {
        require(block.timestamp < votingDeadline, "voting has ended");
        require(!hasVoted[msg.sender], "voter has voted");
        // require(votes[_candidate] > 0, "votes must be greater zero");

        votes[_candidate] += 1;
        hasVoted[msg.sender] = true;

        emit VotesCast(msg.sender, _candidate);
    }

    function isCandidate(string memory _candidate) private view returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (
                keccak256(bytes(candidates[i])) == keccak256(bytes(_candidate))
            ) {
                return true;
            }
        }
        return false;
    }

    function voteCount(
        string memory _candidate
    ) external view returns (uint _count) {
        require(votes[_candidate] > 0, "candiate does not exists");
        return votes[_candidate];
    }

    function getWinner() external view returns (string memory) {
        // require(block.timestamp >= votingDeadline, "Voting is still ongoing");

        string memory winner = candidates[0];
        uint256 highestVotes = votes[winner];

        for (uint256 i = 1; i < candidates.length; i++) {
            if (votes[candidates[i]] > highestVotes) {
                highestVotes = votes[candidates[i]];
                winner = candidates[i];
            }
        }

        return winner;
    }
}

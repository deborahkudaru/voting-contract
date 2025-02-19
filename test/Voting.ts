import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Voting", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  const candidates = ["debo", "debs", "debby", "deborah"];
  const duration = 604800;

  async function deployVoting() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, account1, account2] =
      await hre.ethers.getSigners();

    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(candidates, duration);

    return { voting, owner, otherAccount, account1, account2 };
  }

  describe("Deployment", function () {
    it("Should deploy the contract successfully", async function () {
      const { voting, owner, otherAccount } = await loadFixture(deployVoting);

      const onlyOwner = await voting.owner();
      expect(onlyOwner).to.eq(owner);
    });

    it("Should deploy the contract successfully", async function () {
      const { voting, owner, otherAccount } = await loadFixture(deployVoting);

      const votes = await voting.votes(candidates[0]);
      const votes2 = await voting.votes(candidates[1]);
      const votes3 = await voting.votes(candidates[2]);
      expect(votes).to.eq(0);
      expect(votes2).to.eq(0);
      expect(votes3).to.eq(0);
    });

    it("Should vote candidate successfully", async function () {
      const { voting, owner, otherAccount, account1 } = await loadFixture(
        deployVoting
      );

      await voting.castVote(candidates[0]);
      await voting.hasVoted(owner);
      const votes = await voting.votes(candidates[0]);
      expect(votes).to.eq(1);
    });

    it("Should count vote successfully", async function () {
      const { voting, owner, otherAccount, account1 } = await loadFixture(
        deployVoting
      );

      await voting.castVote(candidates[0]);
      await voting.hasVoted(owner);
      const votecount = await voting.voteCount(candidates[0]);
      // const votes = await voting.votes(candidates[0]);
      expect(votecount).to.eq(1);
    });

    it("Should get winner of vote successfully", async function () {
      const { voting, owner, otherAccount, account1 } = await loadFixture(
        deployVoting
      );

      await voting.castVote(candidates[0]);
      await voting.hasVoted(owner);
      const winner = await voting.getWinner();

      // const votes = await voting.votes(candidates[0]);
      expect(winner).to.eq(candidates[0]);
    });
  });
});

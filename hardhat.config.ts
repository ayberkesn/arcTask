import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    arc: {
      url: "https://arc-testnet-rpc.io", // Placeholder, user needs to provide
      accounts: [] // User needs to provide private key via env
    }
  }
};

export default config;

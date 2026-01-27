import Web3 from "web3";

export const loadContract = async (name, provider) => {
  const web3 = new Web3("http://127.0.0.1:8545");
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  const contract = new web3.eth.Contract(
    Artifact.abi,
    "0xD1d34b708cBa9e9E1105247d733e48419E531336",
  );

  contract.setProvider(provider);

  return contract;
};

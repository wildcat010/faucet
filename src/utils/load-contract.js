import Web3 from "web3";

export const loadContract = async (name, provider) => {
  const web3 = new Web3("http://127.0.0.1:8545");
  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json();

  const contract = new web3.eth.Contract(
    Artifact.abi,
    "0x7Db4C3ca312e808c7Eed82879b1B537A6494D9E4",
  );

  contract.setProvider(provider);

  return contract;
};

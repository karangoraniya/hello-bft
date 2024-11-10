import React, { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [name, setName] = useState("");
  const [submittedNames, setSubmittedNames] = useState([]);

  const injectedProvider = new ethers.BrowserProvider(window.ethereum); // For MetaMask

  const contractAddress = "0x923D153819CBa60505e35DB4E71b87a5908f0996";
  const abi = [
    "function greet(string name) public returns (string)",
    "function getSubmittedNames() public view returns (string[])",
  ];

  const contractWithSigner = async () => {
    const signer = await injectedProvider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  };

  async function getSubmittedNames() {
    try {
      // Get the provider, instantiate the contract and then call getCurrentAd
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const data = await contract.getSubmittedNames();

      console.log(data);
      setSubmittedNames(data);
    } catch (error) {
      console.error("Error fetching current ad:", error);
    }
  }

  // Function to call greet (requires transaction)
  async function submitGreeting() {
    try {
      const contract = await contractWithSigner();
      const tx = await contract.greet(name);
      console.log("Transaction sent:", tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      return receipt;
    } catch (error) {
      console.error("Error submitting greeting:", error);
      throw error;
    }
  }

  return (
    <div>
      <h1>Wagmi Dapp</h1>
      <input
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        value={name}
      />
      <button onClick={submitGreeting}>GM</button>
      <button onClick={getSubmittedNames}>Wagmi Names</button>
      <ul>
        {submittedNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

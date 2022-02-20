const chainId = 137;
const contractAddress = "0x4f14362861ff557d67aec6880067b29987beb50c";//main net
const etherscanUrl = "https://polygonscan.com/tx";//main net
let provider = null;

const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			}
		],
		"name": "call",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

window.onload = () => {
  var animateButton = function (e) {
    e.preventDefault;
    //reset animation
    e.target.classList.remove("animate");

    e.target.classList.add("animate");
    setTimeout(function () {
      e.target.classList.remove("animate");
    }, 700);
  };

  var bubblyButtons = document.getElementsByClassName("bubbly-button");

  for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener("click", animateButton, false);
  }

  window?.ethereum?.on("disconnect", () => {
    window.location.reload();
  });

  window?.ethereum?.on("networkChanged", () => {
    window.location.reload();
  });

  window?.ethereum?.on("chainChanged", () => {
    window.location.reload();
  });

  const connectWallet = async () => {
    await window.ethereum.enable();
    if (Number(window.ethereum.chainId) !== chainId) {
      return failedConnectWallet();
    }
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts");
    document.getElementById("button").innerHTML = accounts[0];

  };



  const failedConnectWallet = () => {
    document.getElementById("button").innerHTML = "Error Network, switch to Polygon Network";
  };

  const switchNetwork = async () => {
      window?.ethereum
        ?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x89",
              chainName: "Polygon",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://polygon-rpc.com/"],
              blockExplorerUrls: ["https://polygonscan.com/"],
            },
          ],
        })
        .then(() => {
          connectWallet();
        })
        .catch(() => {
          failedConnectWallet();
        });
  };

  document.getElementById("button").addEventListener("click", switchNetwork);

  connectWallet();


  const handleMint = async () => {
    $.toast().reset("all");
    if (!provider) {
      connectWallet();
    } else {
      try {
        document.getElementById("mint").innerHTML = "Minting...";
        const signer = await provider.getSigner();
        const inputValue = document.getElementById("count").value;
        if (!inputValue || Math.round(inputValue) !== Number(inputValue)) {
          document.getElementById("mint").innerHTML = "Mint";
          return $.toast({
            heading: "Error",
            text: "Enter an integer！",
            position: "top-center",
            showHideTransition: "fade",
            icon: "error",
          });
        } 
        const ImageContract = new ethers.Contract(contractAddress, abi, signer);
        const amountRaw = ethers.utils.parseUnits(`${0 * inputValue}`, 18).toString();
        const estimateGas = await ImageContract.estimateGas.call(inputValue, {
          value: amountRaw,
        });
        const gasLimit = Math.floor(estimateGas.toNumber() * 2);

        const response = await ImageContract.call(inputValue, {
          value: amountRaw,
          gasLimit,
        });
        console.log(response)
        $.toast({
          heading: "Minting",
          text: "Start to minting！",
          position: "top-center",
          showHideTransition: "fade",
          hideAfter: 10000,
          icon: "info",
        });
        const result = await response.wait();
        $.toast().reset("all");
        $.toast({
          heading: "Success",
          text: "Minted Success! ",
          showHideTransition: "slide",
          position: "top-center",
          icon: "success",
        });
        document.getElementById("mint").innerHTML = "Mint";
        let html = `<a href='${etherscanUrl}/${result.transactionHash}' target="_blank">Transaction ID: ${result.transactionHash}</a>`;
        $('#transaction').html(html);
      } catch (e) {}
    }
  };
  document.getElementById("mint").addEventListener("click", handleMint);
};

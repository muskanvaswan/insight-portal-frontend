import Button from '@mui/material/Button'
export default function Connect({ setAccount, onConnect }) {

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        setMetamask(false);
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setAccount(accounts[0]);
      onConnect();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      variant="contained"
      size="large"
      sx={{bgcolor: "black", color: "white", mt: 3, borderRadius: 5}}
      onClick={connectWallet}>
      Connect Wallet
    </Button>
  )
}

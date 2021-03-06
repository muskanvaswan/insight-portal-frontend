import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'

import abi from '../src/utils/InsightPortal.json'

import NoMetamask from '../src/components/NoMetamask'
import ConnectWalletButton from '../src/components/ConnectWalletButton'
import SubmitInsight from '../src/components/SubmitInsight'
import InsightList from '../src/components/InsightList'



export default function Home() {
  const [ metamask, setMetamask ] = useState(false)
  const [ currentAccount, setCurrentAccount ] = useState("")

  const contractAddress = '0xB6cCdA6DC281Ee1Ce197ef73111CC5C4d8A36f27';
  const contractABI = abi.abi;


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        setMetamask(false);
        return;
      } else {
        setMetamask(true)
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <Box>
      <Head>
        <title>Insight Portal</title>
        <meta name="description" content="A simple web3 portal that allows you to leave whatever insights you may have using some test eth on rinkeby" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!metamask && <NoMetamask />}
      <Box sx={{position: 'relative', display: 'flex', height: '100vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 20, py: 10, bgcolor: 'rgb(0, 8, 108)', background: 'linear-gradient( 65.9deg,  rgba(85,228,224,1) 5.5%, rgba(75,68,224,0.74) 54.2%, rgba(64,198,238,1) 55.2%, rgba(177,36,224,1) 98.4% );'}}>
        <Paper sx={{display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 20, borderRadius: 10, bgcolor: 'rgba(250, 250, 250, 0)'}} elevation={0}>
          <Typography variant="h2" color="danger">Hi, I&apos;m <strong>Muskan Vaswan</strong></Typography>
          <Typography variant="body1" color="danger">I&apos;m interested in knowing what you have to say. You can leave here any opinions you have of me, anything you need me to know or even just your musings of life in general, using your blockchain wallet!</Typography>
          {currentAccount !== "" ?
            <Box sx={{display: 'flex', mt: 3, width: 300}}>
              <SubmitInsight contractABI={contractABI} contractAddress={contractAddress} />
            </Box>
          :
            <Box sx={{mt: 3}}>
              <ConnectWalletButton setAccount={setCurrentAccount} onConnect={() => {}} />
            </Box>
          }
        </Paper>
      </Box>
      <InsightList contractABI={contractABI} contractAddress={contractAddress}/>
    </Box>
  )
}

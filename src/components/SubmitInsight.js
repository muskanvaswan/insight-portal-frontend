import { useState } from 'react';
import { Paper, Box, IconButton, TextField } from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import DoneIcon from '@mui/icons-material/Done';

import { ethers } from "ethers";

export default function SubmitInsight({ contractAddress, contractABI }) {
  const [ loading, setLoading ] = useState(false);
  const [ insight, setInsight ] = useState("");
  const [ error, setError ] = useState(false);

  const submitInsight = async () => {
    const _insight = insight;
    if (_insight == "" || _insight.length < 30) {
      setError(true);
      return ;
    }

    setLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const insightPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const insightTxn = await insightPortalContract.giveInsight(_insight);
        console.log("Mining...", insightTxn.hash);

        await insightTxn.wait();
        console.log("Mined -- ", insightTxn.hash);

        let insights = await insightPortalContract.getInsights();
        console.log("Insights now are:", insights);

        setInsight("");
        setLoading(false)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Paper sx={{mx: 1, width: '100%', px: loading? 0: 1, pt: loading? 0: 1, borderRadius: '10px', bgcolor: 'rgba(255, 255, 255, 0)', position: 'relative'}} elevation={6}>
      {loading && <LinearProgress sx={{height: '100%', borderRadius: '10px', opacity: 0.3, background:'rgba(0, 0, 0, 0)', [`& .${linearProgressClasses.bar}`]: {borderRadius: '10px', background: 'mint'},}}/>}
      {loading && <Box sx={{height: '100%', width: '100%', position: 'absolute', top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><b>Completing Transaction ...</b></Box>}
      <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1, opacity: loading? 0: 1, }}>
        <TextField
          variant="standard"
          sx={{width: '85%', p:0, bgcolor: 'rgba(0, 0, 0, 0)', borderRadius: '10px', '& input': {fontSize: 15}}}
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          error={error}
        />
        <IconButton size="small" sx={{bgcolor: 'black', color: 'white', borderRadius: 2}} onClick={submitInsight}><DoneIcon size="small"/></IconButton>
      </Box>

    </Paper>
  )
}

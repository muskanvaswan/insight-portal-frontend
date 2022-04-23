import { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material'

import { ethers } from 'ethers';

const InsightCard = ({ insight, key }) => {
  return (
    <Box key={key} sx={{px: 3, my: 2, width: '100%', wordWrap: 'break-word'}}>
      <Typography variant="body1">{insight.sender} said <b>{insight.insight}</b></Typography>
    </Box>
  )
}

export default function InsightList({contractABI, contractAddress}) {

  const [ insights, setInsights ] = useState([]);

  const getInsights = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const insightPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let _insights = await insightPortalContract.getInsights();
        await setInsights(_insights);
        console.log("Insights: ", insights);
        return _insights;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {getInsights()}, []);

  return (
    <Box sx={{position: 'absolute', bottom: 0, right: 0, height: '40%', width: '30%', bgcolor: 'rgba(0, 0, 0, 0.0)', p: 2}}>
      <Paper sx={{borderRadius: 5, bgcolor: 'rgba(0, 0, 0, 0.12)', height: '100%', width: '100%', overflowY: 'scroll', overflowX: 'inherit'}} elevation={6}>
        {insights.map((item, idx) => {
          return <InsightCard insight={item} key={idx} />
        })}
      </Paper>
    </Box>
  )
}

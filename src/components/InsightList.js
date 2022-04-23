import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Collapse, IconButton, Slide } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { ethers } from 'ethers';

const HashButton = ({ address }) => {
  const humanize = (address) => (address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length));
  return (
    <Button
      sx={{textTransform: 'none', py: 0, px: 1, borderRadius: 5, bgcolor: 'white', color: 'black', '&:hover': {bgcolor: 'grey', color: 'white'}}}
      onClick={() => {navigator.clipboard.writeText(address);}}
    >
      {humanize(address)}
    </Button>
  )
}
const InsightCard = ({ insight, key }) => {
  return (
    <Box key={key} sx={{borderRadius: 5, bgcolor: 'rgba(255, 255, 255, 0.14)', p: 2, my: 2, width: '100%', wordWrap: 'break-word'}}>
      <HashButton address={insight.sender} />
      <Typography sx={{fontSize: 15, lineHeight: '1.2em', mt: 1}}>{insight.insight}</Typography>
    </Box>
  )
}

export default function InsightList({contractABI, contractAddress}) {

  const [ insights, setInsights ] = useState([]);
  const [ viewInsights, setVeiwInsights ] = useState(false);

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

  useEffect(() => {
    const id = setInterval(getInsights, 3000)
    return () => clearInterval(id);
  }, [])

  useEffect(() => {getInsights()}, []);

  return (
      <Box sx={{position: 'absolute', bottom: 0, right: 0, height: viewInsights? '40%': '8%', transition: 'height 1s ease-in-out',width: {md: '30%', xs: '100%'}, px: 2, pt:2, display: 'flex', overflowY: 'hidden'}}>
        <Paper sx={{borderRadius: '10px 10px 0px 0px', bgcolor: 'black', color: 'white', height: '100%', width: '100%', px: 2, pb: 2,}} elevation={6}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>Total Insights Given: {insights.length}</Typography>
            <IconButton
              color="inherit"
              onClick={() => {setVeiwInsights(x => !x)}}>
              {viewInsights? <KeyboardArrowDownIcon />: <KeyboardArrowUpIcon />}
            </IconButton>
          </Box>

            <Box sx={{overflowY: 'scroll', overflowX: 'inherit', height: '80%'}}>
              {insights.map((item, idx) => {
                return <InsightCard insight={item} key={idx} />
              })}
            </Box>

        </Paper>
      </Box>
  )
}

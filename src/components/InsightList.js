import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Collapse, IconButton, Slide } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { ethers } from 'ethers';

const HashButton = ({ address }) => {
  const humanize = (address) => (address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length));
  return (
    <Button
      sx={{textTransform: 'none', py: 0, px: 1, borderRadius: 5, bgcolor: 'black', color: 'white'}}
      onClick={() => {navigator.clipboard.writeText(address);}}
    >
      {humanize(address)}
    </Button>
  )
}
const InsightCard = ({ insight, key }) => {

  const [ fontSize, setFontSize ] = useState(20);
  useEffect(() => {
    if (insight.insight.length < 10 || insight.insight.length > 50)
      setFontSize(70 / Math.ceil(insight.insight.length / 50))
    else
      setFontSize(100 / Math.log(insight.insight.length)/ Math.log(2));
  })

  return (
    <Box key={key} sx={{borderRadius: 5, bgcolor: 'rgba(61, 61, 61, 0.14)', p: 2, my: 2, width: '100%', wordWrap: 'break-word'}}>
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

  useEffect(() => {getInsights()}, []);

  return (
      <Box sx={{position: 'absolute', bottom: 0, right: 0, height: viewInsights? '40%': '8%', transition: 'height 1s ease-in-out',width: {md: '30%', xs: '100%'}, px: 2, pt:2, display: 'flex', overflowY: 'hidden'}}>
        <Paper sx={{borderRadius: '10px 10px 0px 0px', bgcolor: 'white', color: 'black', height: '100%', width: '100%', px: 2, pb: 2,}} elevation={6}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="body1" sx={{fontWeight: 'bold'}}>Total Insights Given: {insights.length}</Typography>
            <IconButton
              onClick={() => {setVeiwInsights(x => !x)}}>
              <KeyboardArrowDownIcon />
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

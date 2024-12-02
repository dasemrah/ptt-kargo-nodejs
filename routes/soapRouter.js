const express = require('express');
const router = express.Router();
const {kabulEkle, barkodSorgu} = require('../controller/soapController');

// SOAP isteği yönlendiricisi
router.post('/kabulekle', async (req, res) => {
    const result = await kabulEkle(req.body)
    if(result.hataKodu === 1 && result.dongu[0].donguHataKodu === 1){
        res.status(200).json(result)
        
    }else {
        res.status(500).json({msg:'Barkod oluşturulamadı'})
    }
});
router.get('/barkodsorgu/:barkod', async (req, res) => {
    const barkod = req.params.barkod
    console.log('barkodde', barkod)
    const result = await barkodSorgu(barkod)
    console.log('result', result)
    res.status(200).json(result)

})

module.exports = router;
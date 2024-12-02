const soap = require('soap');

const config = {
    musterNo:'your_musterino',
    sifre:'your_password'
}

function getZPLCode({aliciAdi, aAdres, aliciIlAdi, aliciIlceAdi, barkodNo, agirlik, desi}){
    return `^XA^CI28^MMT^PW812^LL1000^LS0^FO00,10^GB760,1000,3^FS^FO760,430^A0R,40,40^FDPTT A.Ş.^FS^FO500,60^A0N,30,30^FDGÖNDERİCİ^FS^FO600,140^A0R,30,30^FDKÖYDEN GELSİN^FS^FO560,140^A0R,30,30^FDKİLİMLİ MAHALLESİ, KİLİMLİ KÜME EVLERİ NO:5^FS^FO520,140^A0R,30,30^FDNARMAN ERZURUM^FS^FO360,60^A0N,30,30^FDALICI^FS^FO440,140^A0R,30,30^FD${aliciAdi}^FS^FO350,140^A0R,30,30^FB600,3,0,L^FD${aAdres}^FS^FO180,400^A0R,30,30^FB600,3,0,L^FD${aliciIlceAdi} / ${aliciIlAdi}^FS^FO240,100^GB400,3,3^FS^FO0,300^GB240,3,3^FS^FO200,20^A0R,30,30^FDAğırlık: ${agirlik}^FS^FO160,20^A0R,30,30^FDDesi: ${desi}^FS^FO200,310^A0R,30,30^FDEk Hizmetler:^FS^FO0,750^GB760,3,3^FS^FO20,800^BY4,3,150^BC,150,Y,N,N^FD${barkodNo}^FS^FO250,760^A0N,30,30^FDPTT BARKODU^FS^FO640,10^GB3,740,3^FS^FO480,10^GB3,740,3^FS^FO240,10^GB3,740,3^FS^XZ`
}

// SOAP isteğinin içeriği
function generatePttBarcode() {
    // PTT tarafından size verilen barkod aralığı (279161170000 - 279161179999)
    const startRange = 279161170000;
    const endRange = 279161179999;
    
    // Rastgele bir barkod numarası seç
    const code = Math.floor(Math.random() * (endRange - startRange + 1)) + startRange;
    
    const codeArr = code.toString().split('');  // Barkodu rakamlara böl
    let codeTotal = [];

    // Rakamları sırayla 1 ve 3 ile çarp
    codeArr.forEach((codeVal, key) => {
        if (key % 2 === 0) {
            codeTotal.push(parseInt(codeVal) * 1);
        } else {
            codeTotal.push(parseInt(codeVal) * 3);
        }
    });

    const codeSum = codeTotal.reduce((acc, val) => acc + val, 0); // Toplamı al
    const checkDigit = codeSum % 10 === 0 ? 0 : 10 - (codeSum % 10);  // Mod 10 hesapla, sonuç 0 değilse 10'dan çıkar

    const newCode = code.toString() + checkDigit.toString();  // Barkoda kontrol basamağını ekle

    return newCode;
}


const getRequestArgs = ({receiverCustName, receiverAddress, cityName, townName, receiverPhone1, kg, orgReceiverCustId}) => ({
    input: {
        dongu: {
            aAdres: receiverAddress,
            agirlik: 1,
            aliciAdi: receiverCustName,
            aliciIlAdi: cityName,
            aliciIlceAdi: townName,
            barkodNo:'',
            aliciSms: receiverPhone1.substring(2),
            aliciTel: receiverPhone1.substring(2),
            boy: kg,
            desi: kg,
            en: kg,
            yukseklik: kg
        },
        dosyaAdi:orgReceiverCustId,
        gonderiTip: 'NORMAL',
        gonderiTur: 'KARGO',
        kullanici: 'PttWs',
        musteriId: config.musterNo,
        sifre:config.sifre
    }
})

// SOAP işlevi
async function kabulEkle(data){
    console.log('data', data)
    const requestArgs = getRequestArgs(data)
    try {
        const newBarcode = generatePttBarcode();
        console.log('newBarcode' , newBarcode)
        requestArgs.input.dongu.barkodNo = newBarcode
        requestArgs.input.dosyaAdi = newBarcode
        console.log('requestArgs', requestArgs)
        // SOAP isteğinin gönderilmesi
        const client = await soap.createClientAsync('https://pttws.ptt.gov.tr/PttVeriYukleme/services/Sorgu?wsdl', { endpoint: 'https://pttws.ptt.gov.tr/PttVeriYukleme/services/Sorgu' });
        const result = await client.kabulEkle2Async(requestArgs);
        const rezultData = result[0].return
        console.log('result', result)
        const zpl = getZPLCode(requestArgs.input.dongu)
        console.log('zpl', zpl)
        return {...result[0].return, zpl}
    } catch (err) {
        console.error(err);
        return `Internal Server Error`
    }
}
async function barkodSorgu(barcode) {
    console.log('barkodfonk', barcode)
    try {
        console.log('barkodfonkrtry', barcode)
        const client = await soap.createClientAsync('https://pttws.ptt.gov.tr/GonderiTakipV2/services/Sorgu?wsdl', { endpoint: 'https://pttws.ptt.gov.tr/GonderiTakipV2/services/Sorgu' });

        const data = await client.gonderiSorguAsync({
            input: {
                kullanici: '405533042',
                sifre: 'T0gSgvu2Qs7RovcCgzJJg',
                barkod: barcode
            }
        });
        console.log('data', data)
        if (data[0].return) {
            return data[0].return;
        } else {
            return false;
        }
    } catch (error) {
        return error;
    }
}


 module.exports = {
    kabulEkle,
    barkodSorgu
 }

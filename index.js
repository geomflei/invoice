//Import the easyinvoice library so we can use it
const express = require("express");
const bodyParser = require("body-parser");
const carbone = require('carbone');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(bodyParser.json());
var easyinvoice = require('easyinvoice');

//Import the built-in NodeJS fs library so we can interact with the file system to save our invoice
var fs = require('fs');

// Our new data object, this will replace the empty object we used earlier.
app.post('/downald',(req,res) => {
    console.log(req.body.information);

    // res.json({result:req.body})

    var data = {

        // Let's add a recipient
        "client": req.body.client,
    
        // Now let's add our own sender details
        "sender": req.body.sender,
    
        "images": {
            //      Logo:
            // 1.   Use a url
            logo: "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",
    
        },
    
        "information":req.body.information ,
    
        // Now let's add some products! Calculations will be done automatically for you.
        "products": req.body.products,
    
        // We will use bottomNotice to add a message of choice to the bottom of our invoice
        "bottom-notice": req.body.bottomNotice,
    
        // Here you can customize your invoice dimensions, currency, tax notation, and number formatting based on your locale
        "settings": {
            "currency": "", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
             "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
             "tax-notation": "TVA ", // Defaults to 'vat'
    
            //  // Using margin we can regulate how much white space we would like to have from the edges of our invoice
            //  "margin-top": 25, // Defaults to '25'
            //  "margin-right": 25, // Defaults to '25'
            //  "margin-left": 25, // Defaults to '25'
            //  "margin-bottom": 25, // Defaults to '25'
    
             "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
            //  "height": "1000px", // allowed units: mm, cm, in, px
            //  "width": "500px", // allowed units: mm, cm, in, px
            //  "orientation": "landscape", // portrait or landscape, defaults to portrait
             
        },
    
        "translate": {
            
             "invoice": "Devis",  // Default to 'INVOICE'
             "number": "N° ", // Defaults to 'Number'
             "date": "Date d'envoi", // Default to 'Date'
             "due-date": "Date réponse ", // Defaults to 'Due Date'
             "subtotal": "Total ( HT ) ", // Defaults to 'Subtotal'
             "products": "Préstation", // Defaults to 'Products'
             "quantity": "Quantité", // Default to 'Quantity'
             "price": "Prix", // Defaults to 'Price'
             "product-total": "Prix total (ht)", // Defaults to 'Total'
             "total": "Total ( TTC )", // Defaults to 'Total'
             
        },

        "customize": {
            // "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
        },
    };
    
    //Let's use the easyinvoice library and call the "createInvoice" function
    easyinvoice.createInvoice(data, function (result) {
        //The response will contain a base64 encoded PDF file
        var pdf = result.pdf;
    
        //Now let's save our invoice to our local filesystem
        let name_pdf=uuidv4();
        console.log('uuid ::::',name_pdf.replace('-',''));

        fs.writeFileSync(`${__dirname}/uploads/${name_pdf}.pdf`, pdf, 'base64');
        let filePath=`${__dirname}/uploads/${name_pdf}.pdf`
        let fileName=`${name_pdf}.pdf`
        console.log('__dirname ::: ',`${__dirname}/uploads`);
        res.download(filePath, fileName);  
        res.json({success:true,namefile:name_pdf}) 
        

        
    });

    
})
app.get('/telechargerinvoice/:id',(req,res) => {
  // const rs = fs.createReadStream(`${__dirname}/uploads/invoice.pdf`);
  let name_downald_Pdf=req.params.id
  res.download(`${__dirname}/uploads/${name_downald_Pdf}.pdf`);
  console.log('downalding');
})


const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`Server is running.`);
});
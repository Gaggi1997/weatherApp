const http = require("http");
const fs = require("fs");
let requests = require("requests");
const { on } = require("events");

let file = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal , orgVal) => {
   let finalData = tempVal.replace("{%temprature%}" , Math.round(orgVal.main.temp-273.15));
    finalData = finalData.replace("{%minTemp%}" , Math.round(orgVal.main.temp_min-273.15));
    finalData = finalData.replace("{%maxTemp%}" , Math.round(orgVal.main.temp_max-273.15));
    finalData = finalData.replace("{%city%}" , orgVal.name);
    finalData = finalData.replace("{%country%}" , orgVal.sys.country);
    finalData = finalData.replace("{%weather%}" , orgVal.weather[0].main);
    finalData = finalData.replace("{%icondesc%}" , orgVal.weather[0].main);
    return finalData;
}
const server = http.createServer((req, res) => {
    if (req.url = "/") {
        let api1 = requests("http://api.openweathermap.org/geo/1.0/direct?q=Hamilton&appid=ecc495e8624fe81b02df2aec960701d5")
        let api2 = requests("https://api.openweathermap.org/data/2.5/weather?lat=43.2560802&lon=-79.8728583&appid=ecc495e8624fe81b02df2aec960701d5")
        .on('data' , (chunk) => {
            let objData = JSON.parse(chunk)
            let arrData = [objData]
           
            console.log(arrData);
            let mappedData = arrData.map((val) => replaceVal(file , val))
            .join("");
             res.write(mappedData);
        })
        .on('end' , (err) => {
           res.end();
        });
        
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log("listening");
});
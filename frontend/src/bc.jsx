// import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
// import Map from "./Map";
// import CityMap from "./CityMap";



// function App() {
//   return <CityMap ikke={ikke} />;
// }
// export default App
//   <div id="controls"> 
//     <button onclick="setMode('vn')">vn</button>
//     <button onclick="setMode('gb')">gb</button>
//     <button onclick="setMode('fo')">fo</button>
//     <button onclick="setMode('hr')">hr</button>
//     <button onclick="setMode('ph')">ph</button>
//   </div>

// #controls {
//   position: absolute;
//   top: 10px;
//   left: 60px;
//   z-index: 1000;
//   background: white;
//   padding: 10px;
//   border-radius: 5px;
// }




import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// assume this is imported or defined elsewhere
// import ikke from "./ikke"; 

export default function App() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

 const ikke = [
  {
    name: "Halden",
    lat: "59.1226",
    lon: "11.3871",
    vn: "95",
    gb: "64",
    fo: "3",
    hr: "18",
    ph: "109"
  },
  {
    name: "Moss",
    lat: "59.434",
    lon: "10.659",
    vn: "958",
    gb: "161",
    fo: "8",
    hr: "82",
    ph: "237"
  },
  {
    name: "Sarpsborg",
    lat: "59.2841",
    lon: "11.1096",
    vn: "289",
    gb: "75",
    fo: "12",
    hr: "88",
    ph: "295"
  },
  {
    name: "Fredrikstad",
    lat: "59.2205",
    lon: "10.934",
    vn: "198",
    gb: "146",
    fo: "5",
    hr: "105",
    ph: "292"
  },
  {
    name: "Hvaler",
    lat: "59.0325",
    lon: "11.0313",
    vn: "0",
    gb: "11",
    fo: "0",
    hr: "7",
    ph: "16"
  },
  {
    name: "Råde",
    lat: "59.3517",
    lon: "10.8717",
    vn: "21",
    gb: "20",
    fo: "3",
    hr: "9",
    ph: "20"
  },
  {
    name: "Våler (Østfold)",
    lat: "59.4853",
    lon: "10.8765",
    vn: "44",
    gb: "11",
    fo: "3",
    hr: "3",
    ph: "32"
  },
  {
    name: "Skiptvet",
    lat: "59.4771",
    lon: "11.1657",
    vn: "3",
    gb: "10",
    fo: "0",
    hr: "3",
    ph: "10"
  },
  {
    name: "Indre Østfold",
    lat: "59.575",
    lon: "11.318",
    vn: "301",
    gb: "87",
    fo: "3",
    hr: "192",
    ph: "371"
  },
  {
    name: "Rakkestad",
    lat: "59.428",
    lon: "11.345",
    vn: "5",
    gb: "3",
    fo: "0",
    hr: "3",
    ph: "32"
  },
  {
    name: "Marker",
    lat: "59.5",
    lon: "11.65",
    vn: "0",
    gb: "3",
    fo: "3",
    hr: "0",
    ph: "10"
  },
  {
    name: "Aremark",
    lat: "59.223",
    lon: "11.695",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Bærum",
    lat: "59.9139",
    lon: "10.516",
    vn: "392",
    gb: "853",
    fo: "5",
    hr: "241",
    ph: "1097"
  },
  {
    name: "Asker",
    lat: "59.8333",
    lon: "10.437",
    vn: "272",
    gb: "587",
    fo: "10",
    hr: "101",
    ph: "509"
  },
  {
    name: "Lillestrøm",
    lat: "59.955",
    lon: "11.05",
    vn: "1838",
    gb: "264",
    fo: "0",
    hr: "138",
    ph: "608"
  },
  {
    name: "Nordre Follo",
    lat: "59.76",
    lon: "10.88",
    vn: "368",
    gb: "239",
    fo: "0",
    hr: "120",
    ph: "316"
  },
  {
    name: "Ullensaker",
    lat: "60.144",
    lon: "11.175",
    vn: "413",
    gb: "127",
    fo: "4",
    hr: "216",
    ph: "404"
  },
  {
    name: "Nesodden",
    lat: "59.84",
    lon: "10.66",
    vn: "10",
    gb: "156",
    fo: "0",
    hr: "21",
    ph: "115"
  },
  {
    name: "Frogn",
    lat: "59.67",
    lon: "10.64",
    vn: "14",
    gb: "79",
    fo: "0",
    hr: "17",
    ph: "79"
  },
  {
    name: "Vestby",
    lat: "59.604",
    lon: "10.743",
    vn: "89",
    gb: "73",
    fo: "0",
    hr: "32",
    ph: "134"
  },
  {
    name: "Ås",
    lat: "59.664",
    lon: "10.791",
    vn: "107",
    gb: "97",
    fo: "4",
    hr: "41",
    ph: "104"
  },
  {
    name: "Enebakk",
    lat: "59.764",
    lon: "11.147",
    vn: "43",
    gb: "26",
    fo: "0",
    hr: "24",
    ph: "73"
  },
  {
    name: "Lørenskog",
    lat: "59.928",
    lon: "10.964",
    vn: "1231",
    gb: "119",
    fo: "3",
    hr: "153",
    ph: "440"
  },
  {
    name: "Rælingen",
    lat: "59.892",
    lon: "11.072",
    vn: "314",
    gb: "61",
    fo: "0",
    hr: "28",
    ph: "130"
  },
  {
    name: "Aurskog-Høland",
    lat: "59.83",
    lon: "11.56",
    vn: "21",
    gb: "41",
    fo: "3",
    hr: "18",
    ph: "86"
  },
  {
    name: "Nes",
    lat: "60.12",
    lon: "11.47",
    vn: "25",
    gb: "47",
    fo: "0",
    hr: "35",
    ph: "143"
  },
  {
    name: "Gjerdrum",
    lat: "60.07",
    lon: "11.03",
    vn: "18",
    gb: "8",
    fo: "0",
    hr: "14",
    ph: "66"
  },
  {
    name: "Nittedal",
    lat: "60.05",
    lon: "10.87",
    vn: "203",
    gb: "79",
    fo: "3",
    hr: "24",
    ph: "150"
  },
  {
    name: "Lunner",
    lat: "60.3",
    lon: "10.6",
    vn: "9",
    gb: "16",
    fo: "0",
    hr: "5",
    ph: "37"
  },
  {
    name: "Jevnaker",
    lat: "60.24",
    lon: "10.38",
    vn: "7",
    gb: "13",
    fo: "0",
    hr: "3",
    ph: "32"
  },
  {
    name: "Nannestad",
    lat: "60.22",
    lon: "11.02",
    vn: "52",
    gb: "54",
    fo: "0",
    hr: "45",
    ph: "218"
  },
  {
    name: "Eidsvoll",
    lat: "60.33",
    lon: "11.25",
    vn: "75",
    gb: "72",
    fo: "0",
    hr: "73",
    ph: "297"
  },
  {
    name: "Hurdal",
    lat: "60.43",
    lon: "11.07",
    vn: "7",
    gb: "9",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Oslo",
    lat: "59.9139",
    lon: "10.7522",
    vn: "6578",
    gb: "3700",
    fo: "58",
    hr: "1649",
    ph: "6456"
  },
  {
    name: "Drammen",
    lat: "59.744",
    lon: "10.204",
    vn: "914",
    gb: "302",
    fo: "3",
    hr: "231",
    ph: "501"
  },
  {
    name: "Kongsberg",
    lat: "59.668",
    lon: "9.65",
    vn: "48",
    gb: "148",
    fo: "3",
    hr: "43",
    ph: "161"
  },
  {
    name: "Ringerike",
    lat: "60.17",
    lon: "10.25",
    vn: "44",
    gb: "53",
    fo: "3",
    hr: "44",
    ph: "163"
  },
  {
    name: "Hole",
    lat: "60.06",
    lon: "10.28",
    vn: "3",
    gb: "30",
    fo: "0",
    hr: "5",
    ph: "43"
  },
  {
    name: "Lier",
    lat: "59.79",
    lon: "10.27",
    vn: "181",
    gb: "93",
    fo: "3",
    hr: "23",
    ph: "137"
  },
  {
    name: "Øvre Eiker",
    lat: "59.77",
    lon: "9.86",
    vn: "27",
    gb: "40",
    fo: "12",
    hr: "30",
    ph: "75"
  },
  {
    name: "Modum",
    lat: "59.97",
    lon: "9.98",
    vn: "9",
    gb: "23",
    fo: "0",
    hr: "4",
    ph: "59"
  },
  {
    name: "Krødsherad",
    lat: "60.17",
    lon: "9.7",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "3",
    ph: "6"
  },
  {
    name: "Flå",
    lat: "60.43",
    lon: "9.47",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Nesbyen",
    lat: "60.568",
    lon: "9.102",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "3",
    ph: "39"
  },
  {
    name: "Gol",
    lat: "60.703",
    lon: "8.945",
    vn: "3",
    gb: "18",
    fo: "0",
    hr: "3",
    ph: "42"
  },
  {
    name: "Hemsedal",
    lat: "60.861",
    lon: "8.553",
    vn: "3",
    gb: "15",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Ål",
    lat: "60.63",
    lon: "8.56",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "0",
    ph: "8"
  },
  {
    name: "Hol",
    lat: "60.54",
    lon: "8.21",
    vn: "0",
    gb: "24",
    fo: "0",
    hr: "8",
    ph: "24"
  },
  {
    name: "Sigdal",
    lat: "60.05",
    lon: "9.62",
    vn: "3",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Flesberg",
    lat: "59.87",
    lon: "9.47",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "3",
    ph: "8"
  },
  {
    name: "Rollag",
    lat: "60.02",
    lon: "9.29",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Nore og Uvdal",
    lat: "60.27",
    lon: "8.95",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "4",
    ph: "12"
  },
  {
    name: "Kongsvinger",
    lat: "60.19",
    lon: "11.99",
    vn: "123",
    gb: "21",
    fo: "0",
    hr: "20",
    ph: "50"
  },
  {
    name: "Hamar",
    lat: "60.794",
    lon: "11.068",
    vn: "129",
    gb: "64",
    fo: "3",
    hr: "32",
    ph: "82"
  },
  {
    name: "Lillehammer",
    lat: "61.115",
    lon: "10.466",
    vn: "208",
    gb: "65",
    fo: "7",
    hr: "33",
    ph: "80"
  },
  {
    name: "Gjøvik",
    lat: "60.794",
    lon: "10.692",
    vn: "124",
    gb: "58",
    fo: "0",
    hr: "59",
    ph: "105"
  },
  {
    name: "Ringsaker",
    lat: "60.886",
    lon: "10.93",
    vn: "170",
    gb: "69",
    fo: "0",
    hr: "24",
    ph: "81"
  },
  {
    name: "Løten",
    lat: "60.817",
    lon: "11.337",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "14"
  },
  {
    name: "Stange",
    lat: "60.715",
    lon: "11.19",
    vn: "75",
    gb: "47",
    fo: "0",
    hr: "3",
    ph: "55"
  },
  {
    name: "Nord-Odal",
    lat: "60.45",
    lon: "11.62",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "4",
    ph: "16"
  },
  {
    name: "Sør-Odal",
    lat: "60.24",
    lon: "11.69",
    vn: "4",
    gb: "27",
    fo: "0",
    hr: "4",
    ph: "20"
  },
  {
    name: "Eidskog",
    lat: "59.99",
    lon: "12.12",
    vn: "3",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "22"
  },
  {
    name: "Grue",
    lat: "60.44",
    lon: "12.05",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "19",
    ph: "5"
  },
  {
    name: "Åsnes",
    lat: "60.6",
    lon: "12.0",
    vn: "5",
    gb: "8",
    fo: "0",
    hr: "8",
    ph: "24"
  },
  {
    name: "Våler",
    lat: "60.67",
    lon: "11.85",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Elverum",
    lat: "60.881",
    lon: "11.562",
    vn: "45",
    gb: "20",
    fo: "4",
    hr: "19",
    ph: "67"
  },
  {
    name: "Trysil",
    lat: "61.315",
    lon: "12.26",
    vn: "3",
    gb: "11",
    fo: "0",
    hr: "11",
    ph: "10"
  },
  {
    name: "Åmot",
    lat: "61.1",
    lon: "11.4",
    vn: "3",
    gb: "6",
    fo: "0",
    hr: "5",
    ph: "9"
  },
  {
    name: "Stor-Elvdal",
    lat: "61.58",
    lon: "11.05",
    vn: "3",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Rendalen",
    lat: "61.88",
    lon: "11.08",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Engerdal",
    lat: "61.76",
    lon: "11.96",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Tolga",
    lat: "62.41",
    lon: "11.0",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Tynset",
    lat: "62.27",
    lon: "10.78",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "10",
    ph: "6"
  },
  {
    name: "Alvdal",
    lat: "62.11",
    lon: "10.63",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "8"
  },
  {
    name: "Folldal",
    lat: "62.13",
    lon: "9.99",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "8"
  },
  {
    name: "Os (Innlandet)",
    lat: "62.5",
    lon: "11.23",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "12",
    ph: "4"
  },
  {
    name: "Dovre",
    lat: "62.24",
    lon: "9.53",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Lesja",
    lat: "62.117",
    lon: "8.86",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Skjåk",
    lat: "61.88",
    lon: "8.4",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Lom",
    lat: "61.84",
    lon: "8.57",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Vågå",
    lat: "61.875",
    lon: "9.14",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Nord-Fron",
    lat: "61.6",
    lon: "9.76",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Sel",
    lat: "61.84",
    lon: "9.57",
    vn: "0",
    gb: "10",
    fo: "0",
    hr: "0",
    ph: "5"
  },
  {
    name: "Sør-Fron",
    lat: "61.57",
    lon: "9.95",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "3",
    ph: "6"
  },
  {
    name: "Ringebu",
    lat: "61.54",
    lon: "10.14",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Øyer",
    lat: "61.26",
    lon: "10.43",
    vn: "4",
    gb: "21",
    fo: "0",
    hr: "4",
    ph: "14"
  },
  {
    name: "Gausdal",
    lat: "61.22",
    lon: "10.23",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Østre Toten",
    lat: "60.7",
    lon: "10.85",
    vn: "5",
    gb: "20",
    fo: "3",
    hr: "30",
    ph: "29"
  },
  {
    name: "Vestre Toten",
    lat: "60.66",
    lon: "10.52",
    vn: "13",
    gb: "28",
    fo: "0",
    hr: "10",
    ph: "41"
  },
  {
    name: "Gran",
    lat: "60.43",
    lon: "10.56",
    vn: "6",
    gb: "17",
    fo: "0",
    hr: "0",
    ph: "67"
  },
  {
    name: "Søndre Land",
    lat: "60.66",
    lon: "10.26",
    vn: "3",
    gb: "12",
    fo: "0",
    hr: "0",
    ph: "21"
  },
  {
    name: "Nordre Land",
    lat: "60.84",
    lon: "10.1",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "15"
  },
  {
    name: "Sør-Aurdal",
    lat: "60.76",
    lon: "9.62",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "8"
  },
  {
    name: "Etnedal",
    lat: "60.88",
    lon: "9.65",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Nord-Aurdal",
    lat: "60.98",
    lon: "9.24",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "16"
  },
  {
    name: "Vestre Slidre",
    lat: "61.08",
    lon: "8.98",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Øystre Slidre",
    lat: "61.14",
    lon: "9.06",
    vn: "0",
    gb: "12",
    fo: "0",
    hr: "3",
    ph: "7"
  },
  {
    name: "Vang",
    lat: "61.12",
    lon: "8.55",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Horten",
    lat: "59.417",
    lon: "10.483",
    vn: "97",
    gb: "66",
    fo: "0",
    hr: "12",
    ph: "156"
  },
  {
    name: "Holmestrand",
    lat: "59.487",
    lon: "10.315",
    vn: "46",
    gb: "85",
    fo: "3",
    hr: "23",
    ph: "124"
  },
  {
    name: "Tønsberg",
    lat: "59.267",
    lon: "10.407",
    vn: "244",
    gb: "176",
    fo: "8",
    hr: "50",
    ph: "247"
  },
  {
    name: "Sandefjord",
    lat: "59.131",
    lon: "10.216",
    vn: "560",
    gb: "239",
    fo: "10",
    hr: "53",
    ph: "268"
  },
  {
    name: "Larvik",
    lat: "59.053",
    lon: "10.027",
    vn: "296",
    gb: "124",
    fo: "6",
    hr: "25",
    ph: "198"
  },
  {
    name: "Færder",
    lat: "59.221",
    lon: "10.386",
    vn: "224",
    gb: "101",
    fo: "4",
    hr: "10",
    ph: "155"
  },
  {
    name: "Porsgrunn",
    lat: "59.14",
    lon: "9.656",
    vn: "212",
    gb: "106",
    fo: "3",
    hr: "56",
    ph: "156"
  },
  {
    name: "Skien",
    lat: "59.209",
    lon: "9.609",
    vn: "190",
    gb: "137",
    fo: "7",
    hr: "137",
    ph: "188"
  },
  {
    name: "Notodden",
    lat: "59.559",
    lon: "9.262",
    vn: "38",
    gb: "26",
    fo: "8",
    hr: "12",
    ph: "83"
  },
  {
    name: "Siljan",
    lat: "59.28",
    lon: "9.71",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "6",
    ph: "11"
  },
  {
    name: "Bamble",
    lat: "59.0",
    lon: "9.75",
    vn: "8",
    gb: "17",
    fo: "0",
    hr: "0",
    ph: "30"
  },
  {
    name: "Kragerø",
    lat: "58.87",
    lon: "9.41",
    vn: "14",
    gb: "25",
    fo: "0",
    hr: "27",
    ph: "25"
  },
  {
    name: "Drangedal",
    lat: "59.1",
    lon: "9.06",
    vn: "3",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Nome",
    lat: "59.28",
    lon: "9.21",
    vn: "5",
    gb: "13",
    fo: "0",
    hr: "0",
    ph: "24"
  },
  {
    name: "Midt-Telemark",
    lat: "59.44",
    lon: "9.05",
    vn: "3",
    gb: "36",
    fo: "0",
    hr: "10",
    ph: "20"
  },
  {
    name: "Seljord",
    lat: "59.48",
    lon: "8.62",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Hjartdal",
    lat: "59.63",
    lon: "8.94",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Tinn",
    lat: "59.84",
    lon: "8.6",
    vn: "0",
    gb: "17",
    fo: "3",
    hr: "27",
    ph: "89"
  },
  {
    name: "Kviteseid",
    lat: "59.36",
    lon: "8.49",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "7",
    ph: "7"
  },
  {
    name: "Nissedal",
    lat: "59.17",
    lon: "8.4",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Fyresdal",
    lat: "59.2",
    lon: "8.12",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Tokke",
    lat: "59.48",
    lon: "8.02",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Vinje",
    lat: "59.7",
    lon: "7.95",
    vn: "0",
    gb: "10",
    fo: "0",
    hr: "3",
    ph: "9"
  },
  {
    name: "Risør",
    lat: "58.72",
    lon: "9.23",
    vn: "4",
    gb: "15",
    fo: "0",
    hr: "0",
    ph: "22"
  },
  {
    name: "Grimstad",
    lat: "58.34",
    lon: "8.59",
    vn: "71",
    gb: "77",
    fo: "6",
    hr: "16",
    ph: "120"
  },
  {
    name: "Arendal",
    lat: "58.46",
    lon: "8.77",
    vn: "153",
    gb: "143",
    fo: "6",
    hr: "45",
    ph: "209"
  },
  {
    name: "Kristiansand",
    lat: "58.146",
    lon: "7.995",
    vn: "906",
    gb: "356",
    fo: "12",
    hr: "225",
    ph: "385"
  },
  {
    name: "Lindesnes",
    lat: "58.1",
    lon: "7.3",
    vn: "9",
    gb: "48",
    fo: "3",
    hr: "28",
    ph: "82"
  },
  {
    name: "Farsund",
    lat: "58.095",
    lon: "6.8",
    vn: "4",
    gb: "27",
    fo: "8",
    hr: "20",
    ph: "28"
  },
  {
    name: "Flekkefjord",
    lat: "58.295",
    lon: "6.66",
    vn: "0",
    gb: "26",
    fo: "3",
    hr: "43",
    ph: "26"
  },
  {
    name: "Gjerstad",
    lat: "58.88",
    lon: "9.01",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Vegårshei",
    lat: "58.77",
    lon: "8.8",
    vn: "0",
    gb: "0",
    fo: "3",
    hr: "3",
    ph: "0"
  },
  {
    name: "Tvedestrand",
    lat: "58.62",
    lon: "8.92",
    vn: "8",
    gb: "13",
    fo: "0",
    hr: "3",
    ph: "21"
  },
  {
    name: "Froland",
    lat: "58.55",
    lon: "8.6",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "6",
    ph: "25"
  },
  {
    name: "Lillesand",
    lat: "58.25",
    lon: "8.38",
    vn: "29",
    gb: "33",
    fo: "0",
    hr: "7",
    ph: "50"
  },
  {
    name: "Birkenes",
    lat: "58.38",
    lon: "8.17",
    vn: "6",
    gb: "15",
    fo: "0",
    hr: "0",
    ph: "18"
  },
  {
    name: "Åmli",
    lat: "58.8",
    lon: "8.45",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Iveland",
    lat: "58.49",
    lon: "8.23",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Evje og Hornnes",
    lat: "58.585",
    lon: "7.78",
    vn: "0",
    gb: "16",
    fo: "0",
    hr: "5",
    ph: "7"
  },
  {
    name: "Bygland",
    lat: "58.85",
    lon: "7.8",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Valle",
    lat: "59.21",
    lon: "7.53",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "3",
    ph: "3"
  },
  {
    name: "Bykle",
    lat: "59.34",
    lon: "7.36",
    vn: "0",
    gb: "8",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Vennesla",
    lat: "58.342",
    lon: "7.975",
    vn: "15",
    gb: "38",
    fo: "3",
    hr: "4",
    ph: "72"
  },
  {
    name: "Åseral",
    lat: "58.68",
    lon: "7.35",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Lyngdal",
    lat: "58.137",
    lon: "7.07",
    vn: "3",
    gb: "15",
    fo: "3",
    hr: "30",
    ph: "44"
  },
  {
    name: "Hægebostad",
    lat: "58.33",
    lon: "7.22",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Kvinesdal",
    lat: "58.35",
    lon: "6.95",
    vn: "0",
    gb: "16",
    fo: "0",
    hr: "11",
    ph: "11"
  },
  {
    name: "Sirdal",
    lat: "58.92",
    lon: "6.95",
    vn: "0",
    gb: "17",
    fo: "0",
    hr: "7",
    ph: "10"
  },
  {
    name: "Eigersund",
    lat: "58.45",
    lon: "6.0",
    vn: "0",
    gb: "23",
    fo: "6",
    hr: "3",
    ph: "143"
  },
  {
    name: "Stavanger",
    lat: "58.97",
    lon: "5.733",
    vn: "565",
    gb: "1644",
    fo: "22",
    hr: "150",
    ph: "989"
  },
  {
    name: "Haugesund",
    lat: "59.413",
    lon: "5.268",
    vn: "208",
    gb: "134",
    fo: "5",
    hr: "42",
    ph: "303"
  },
  {
    name: "Sandnes",
    lat: "58.851",
    lon: "5.735",
    vn: "868",
    gb: "499",
    fo: "17",
    hr: "109",
    ph: "633"
  },
  {
    name: "Sokndal",
    lat: "58.28",
    lon: "6.3",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "21"
  },
  {
    name: "Lund",
    lat: "58.45",
    lon: "6.55",
    vn: "3",
    gb: "5",
    fo: "0",
    hr: "25",
    ph: "16"
  },
  {
    name: "Bjerkreim",
    lat: "58.65",
    lon: "5.92",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "4",
    ph: "12"
  },
  {
    name: "Hå",
    lat: "58.6",
    lon: "5.65",
    vn: "6",
    gb: "36",
    fo: "3",
    hr: "46",
    ph: "101"
  },
  {
    name: "Klepp",
    lat: "58.78",
    lon: "5.63",
    vn: "19",
    gb: "54",
    fo: "4",
    hr: "21",
    ph: "107"
  },
  {
    name: "Time",
    lat: "58.74",
    lon: "5.72",
    vn: "24",
    gb: "71",
    fo: "7",
    hr: "27",
    ph: "73"
  },
  {
    name: "Gjesdal",
    lat: "58.78",
    lon: "5.88",
    vn: "3",
    gb: "49",
    fo: "4",
    hr: "54",
    ph: "88"
  },
  {
    name: "Sola",
    lat: "58.888",
    lon: "5.652",
    vn: "63",
    gb: "340",
    fo: "10",
    hr: "27",
    ph: "198"
  },
  {
    name: "Randaberg",
    lat: "59.001",
    lon: "5.615",
    vn: "9",
    gb: "67",
    fo: "0",
    hr: "10",
    ph: "49"
  },
  {
    name: "Strand",
    lat: "59.05",
    lon: "6.03",
    vn: "0",
    gb: "43",
    fo: "6",
    hr: "3",
    ph: "68"
  },
  {
    name: "Hjelmeland",
    lat: "59.23",
    lon: "6.18",
    vn: "0",
    gb: "8",
    fo: "4",
    hr: "4",
    ph: "32"
  },
  {
    name: "Suldal",
    lat: "59.45",
    lon: "6.47",
    vn: "0",
    gb: "10",
    fo: "0",
    hr: "3",
    ph: "14"
  },
  {
    name: "Sauda",
    lat: "59.65",
    lon: "6.35",
    vn: "3",
    gb: "9",
    fo: "0",
    hr: "3",
    ph: "22"
  },
  {
    name: "Kvitsøy",
    lat: "59.06",
    lon: "5.41",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Bokn",
    lat: "59.23",
    lon: "5.43",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Tysvær",
    lat: "59.42",
    lon: "5.45",
    vn: "13",
    gb: "30",
    fo: "3",
    hr: "0",
    ph: "47"
  },
  {
    name: "Karmøy",
    lat: "59.28",
    lon: "5.3",
    vn: "160",
    gb: "109",
    fo: "11",
    hr: "5",
    ph: "221"
  },
  {
    name: "Utsira",
    lat: "59.3",
    lon: "4.88",
    vn: "3",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Vindafjord",
    lat: "59.55",
    lon: "5.85",
    vn: "0",
    gb: "18",
    fo: "0",
    hr: "8",
    ph: "24"
  },
  {
    name: "Bergen",
    lat: "60.392",
    lon: "5.324",
    vn: "1362",
    gb: "1488",
    fo: "40",
    hr: "295",
    ph: "1421"
  },
  {
    name: "Kinn",
    lat: "61.6",
    lon: "5.1",
    vn: "3",
    gb: "44",
    fo: "10",
    hr: "12",
    ph: "62"
  },
  {
    name: "Etne",
    lat: "59.66",
    lon: "5.94",
    vn: "3",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Sveio",
    lat: "59.54",
    lon: "5.36",
    vn: "3",
    gb: "17",
    fo: "0",
    hr: "0",
    ph: "18"
  },
  {
    name: "Bømlo",
    lat: "59.79",
    lon: "5.18",
    vn: "15",
    gb: "22",
    fo: "14",
    hr: "0",
    ph: "58"
  },
  {
    name: "Stord",
    lat: "59.78",
    lon: "5.5",
    vn: "40",
    gb: "73",
    fo: "9",
    hr: "10",
    ph: "195"
  },
  {
    name: "Fitjar",
    lat: "59.92",
    lon: "5.32",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "12"
  },
  {
    name: "Tysnes",
    lat: "60.04",
    lon: "5.53",
    vn: "3",
    gb: "15",
    fo: "0",
    hr: "3",
    ph: "15"
  },
  {
    name: "Kvinnherad",
    lat: "60.18",
    lon: "6.0",
    vn: "3",
    gb: "22",
    fo: "3",
    hr: "9",
    ph: "78"
  },
  {
    name: "Ullensvang",
    lat: "60.32",
    lon: "6.65",
    vn: "3",
    gb: "17",
    fo: "0",
    hr: "8",
    ph: "55"
  },
  {
    name: "Eidfjord",
    lat: "60.42",
    lon: "7.08",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "13"
  },
  {
    name: "Ulvik",
    lat: "60.57",
    lon: "6.92",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "3",
    ph: "7"
  },
  {
    name: "Voss",
    lat: "60.63",
    lon: "6.42",
    vn: "4",
    gb: "69",
    fo: "3",
    hr: "41",
    ph: "65"
  },
  {
    name: "Kvam",
    lat: "60.38",
    lon: "6.13",
    vn: "3",
    gb: "20",
    fo: "0",
    hr: "4",
    ph: "36"
  },
  {
    name: "Samnanger",
    lat: "60.37",
    lon: "5.73",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "3",
    ph: "5"
  },
  {
    name: "Bjørnafjorden",
    lat: "60.2",
    lon: "5.5",
    vn: "117",
    gb: "67",
    fo: "3",
    hr: "32",
    ph: "137"
  },
  {
    name: "Austevoll",
    lat: "60.09",
    lon: "5.23",
    vn: "3",
    gb: "18",
    fo: "11",
    hr: "5",
    ph: "21"
  },
  {
    name: "Øygarden",
    lat: "60.58",
    lon: "4.93",
    vn: "60",
    gb: "109",
    fo: "3",
    hr: "43",
    ph: "189"
  },
  {
    name: "Askøy",
    lat: "60.4",
    lon: "5.18",
    vn: "28",
    gb: "77",
    fo: "3",
    hr: "20",
    ph: "132"
  },
  {
    name: "Vaksdal",
    lat: "60.48",
    lon: "5.74",
    vn: "6",
    gb: "14",
    fo: "3",
    hr: "0",
    ph: "24"
  },
  {
    name: "Modalen",
    lat: "60.82",
    lon: "5.82",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Osterøy",
    lat: "60.53",
    lon: "5.47",
    vn: "0",
    gb: "23",
    fo: "3",
    hr: "9",
    ph: "25"
  },
  {
    name: "Alver",
    lat: "60.65",
    lon: "5.25",
    vn: "11",
    gb: "67",
    fo: "3",
    hr: "11",
    ph: "114"
  },
  {
    name: "Austrheim",
    lat: "60.77",
    lon: "5.02",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "5",
    ph: "26"
  },
  {
    name: "Fedje",
    lat: "60.78",
    lon: "4.71",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Masfjorden",
    lat: "60.9",
    lon: "5.4",
    vn: "0",
    gb: "8",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Gulen",
    lat: "60.99",
    lon: "5.05",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "3",
    ph: "8"
  },
  {
    name: "Solund",
    lat: "61.08",
    lon: "4.83",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Hyllestad",
    lat: "61.17",
    lon: "5.3",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Høyanger",
    lat: "61.22",
    lon: "6.08",
    vn: "3",
    gb: "8",
    fo: "0",
    hr: "4",
    ph: "11"
  },
  {
    name: "Vik",
    lat: "61.09",
    lon: "6.57",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Sogndal",
    lat: "61.229",
    lon: "7.101",
    vn: "8",
    gb: "38",
    fo: "0",
    hr: "17",
    ph: "29"
  },
  {
    name: "Aurland",
    lat: "60.91",
    lon: "7.19",
    vn: "0",
    gb: "8",
    fo: "0",
    hr: "4",
    ph: "14"
  },
  {
    name: "Lærdal",
    lat: "61.1",
    lon: "7.47",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "4",
    ph: "6"
  },
  {
    name: "Årdal",
    lat: "61.25",
    lon: "7.7",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "3",
    ph: "22"
  },
  {
    name: "Luster",
    lat: "61.53",
    lon: "7.47",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Askvoll",
    lat: "61.35",
    lon: "5.07",
    vn: "0",
    gb: "10",
    fo: "0",
    hr: "0",
    ph: "15"
  },
  {
    name: "Fjaler",
    lat: "61.24",
    lon: "5.28",
    vn: "0",
    gb: "36",
    fo: "0",
    hr: "0",
    ph: "5"
  },
  {
    name: "Sunnfjord",
    lat: "61.45",
    lon: "5.9",
    vn: "11",
    gb: "26",
    fo: "3",
    hr: "43",
    ph: "59"
  },
  {
    name: "Bremanger",
    lat: "61.77",
    lon: "5.5",
    vn: "0",
    gb: "11",
    fo: "0",
    hr: "6",
    ph: "35"
  },
  {
    name: "Stad",
    lat: "62.03",
    lon: "5.15",
    vn: "3",
    gb: "18",
    fo: "0",
    hr: "5",
    ph: "42"
  },
  {
    name: "Gloppen",
    lat: "61.77",
    lon: "6.22",
    vn: "0",
    gb: "8",
    fo: "0",
    hr: "3",
    ph: "14"
  },
  {
    name: "Stryn",
    lat: "61.9",
    lon: "6.72",
    vn: "0",
    gb: "11",
    fo: "0",
    hr: "10",
    ph: "28"
  },
  {
    name: "Kristiansund",
    lat: "63.11",
    lon: "7.73",
    vn: "8",
    gb: "51",
    fo: "15",
    hr: "6",
    ph: "139"
  },
  {
    name: "Molde",
    lat: "62.737",
    lon: "7.16",
    vn: "17",
    gb: "36",
    fo: "9",
    hr: "8",
    ph: "193"
  },
  {
    name: "Ålesund",
    lat: "62.472",
    lon: "6.154",
    vn: "159",
    gb: "177",
    fo: "34",
    hr: "70",
    ph: "307"
  },
  {
    name: "Vanylven",
    lat: "62.0",
    lon: "5.63",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "34"
  },
  {
    name: "Sande",
    lat: "62.2",
    lon: "5.55",
    vn: "0",
    gb: "4",
    fo: "3",
    hr: "0",
    ph: "18"
  },
  {
    name: "Herøy",
    lat: "62.37",
    lon: "5.65",
    vn: "3",
    gb: "24",
    fo: "6",
    hr: "26",
    ph: "53"
  },
  {
    name: "Ulstein",
    lat: "62.35",
    lon: "5.85",
    vn: "3",
    gb: "24",
    fo: "0",
    hr: "10",
    ph: "43"
  },
  {
    name: "Hareid",
    lat: "62.37",
    lon: "6.02",
    vn: "3",
    gb: "4",
    fo: "3",
    hr: "0",
    ph: "21"
  },
  {
    name: "Ørsta",
    lat: "62.2",
    lon: "6.12",
    vn: "8",
    gb: "9",
    fo: "9",
    hr: "3",
    ph: "60"
  },
  {
    name: "Stranda",
    lat: "62.31",
    lon: "6.94",
    vn: "0",
    gb: "6",
    fo: "3",
    hr: "11",
    ph: "50"
  },
  {
    name: "Sykkylven",
    lat: "62.39",
    lon: "6.58",
    vn: "5",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "60"
  },
  {
    name: "Sula",
    lat: "62.43",
    lon: "6.1",
    vn: "5",
    gb: "23",
    fo: "5",
    hr: "4",
    ph: "56"
  },
  {
    name: "Giske",
    lat: "62.5",
    lon: "6.1",
    vn: "3",
    gb: "23",
    fo: "9",
    hr: "6",
    ph: "37"
  },
  {
    name: "Vestnes",
    lat: "62.62",
    lon: "7.09",
    vn: "6",
    gb: "21",
    fo: "0",
    hr: "3",
    ph: "50"
  },
  {
    name: "Rauma",
    lat: "62.56",
    lon: "7.67",
    vn: "0",
    gb: "21",
    fo: "0",
    hr: "0",
    ph: "26"
  },
  {
    name: "Aukra",
    lat: "62.8",
    lon: "6.9",
    vn: "3",
    gb: "15",
    fo: "0",
    hr: "0",
    ph: "17"
  },
  {
    name: "Averøy",
    lat: "63.03",
    lon: "7.55",
    vn: "3",
    gb: "8",
    fo: "4",
    hr: "3",
    ph: "28"
  },
  {
    name: "Gjemnes",
    lat: "62.93",
    lon: "7.73",
    vn: "0",
    gb: "11",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Tingvoll",
    lat: "62.91",
    lon: "8.2",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "3",
    ph: "10"
  },
  {
    name: "Sunndal",
    lat: "62.67",
    lon: "8.56",
    vn: "3",
    gb: "7",
    fo: "0",
    hr: "3",
    ph: "24"
  },
  {
    name: "Surnadal",
    lat: "62.97",
    lon: "8.72",
    vn: "0",
    gb: "8",
    fo: "3",
    hr: "3",
    ph: "18"
  },
  {
    name: "Smøla",
    lat: "63.43",
    lon: "8.0",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "5"
  },
  {
    name: "Aure",
    lat: "63.05",
    lon: "8.6",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "15"
  },
  {
    name: "Volda",
    lat: "62.147",
    lon: "6.074",
    vn: "4",
    gb: "17",
    fo: "0",
    hr: "3",
    ph: "70"
  },
  {
    name: "Fjord",
    lat: "62.3",
    lon: "7.26",
    vn: "0",
    gb: "6",
    fo: "3",
    hr: "0",
    ph: "9"
  },
  {
    name: "Hustadvika",
    lat: "62.87",
    lon: "7.14",
    vn: "6",
    gb: "13",
    fo: "3",
    hr: "0",
    ph: "117"
  },
  {
    name: "Haram",
    lat: "62.63",
    lon: "6.4",
    vn: "18",
    gb: "24",
    fo: "3",
    hr: "3",
    ph: "64"
  },
  {
    name: "Trondheim",
    lat: "63.4305",
    lon: "10.3951",
    vn: "1047",
    gb: "623",
    fo: "14",
    hr: "238",
    ph: "808"
  },
  {
    name: "Steinkjer",
    lat: "64.0149",
    lon: "11.4954",
    vn: "7",
    gb: "19",
    fo: "0",
    hr: "0",
    ph: "86"
  },
  {
    name: "Namsos",
    lat: "64.4667",
    lon: "11.495",
    vn: "4",
    gb: "12",
    fo: "3",
    hr: "5",
    ph: "55"
  },
  {
    name: "Frøya",
    lat: "63.726",
    lon: "8.827",
    vn: "0",
    gb: "3",
    fo: "9",
    hr: "4",
    ph: "40"
  },
  {
    name: "Osen",
    lat: "64.3",
    lon: "10.51",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Oppdal",
    lat: "62.594",
    lon: "9.69",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "3",
    ph: "13"
  },
  {
    name: "Rennebu",
    lat: "62.83",
    lon: "10.02",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Røros",
    lat: "62.575",
    lon: "11.38",
    vn: "0",
    gb: "10",
    fo: "0",
    hr: "22",
    ph: "9"
  },
  {
    name: "Holtålen",
    lat: "62.95",
    lon: "11.27",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Midtre Gauldal",
    lat: "63.03",
    lon: "10.3",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "0",
    ph: "18"
  },
  {
    name: "Melhus",
    lat: "63.3",
    lon: "10.28",
    vn: "47",
    gb: "15",
    fo: "0",
    hr: "4",
    ph: "83"
  },
  {
    name: "Skaun",
    lat: "63.26",
    lon: "10.07",
    vn: "5",
    gb: "11",
    fo: "0",
    hr: "3",
    ph: "43"
  },
  {
    name: "Malvik",
    lat: "63.43",
    lon: "10.68",
    vn: "17",
    gb: "32",
    fo: "3",
    hr: "5",
    ph: "45"
  },
  {
    name: "Selbu",
    lat: "63.23",
    lon: "11.04",
    vn: "3",
    gb: "6",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Tydal",
    lat: "63.06",
    lon: "11.87",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Meråker",
    lat: "63.42",
    lon: "11.74",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "15"
  },
  {
    name: "Stjørdal",
    lat: "63.47",
    lon: "10.92",
    vn: "39",
    gb: "40",
    fo: "0",
    hr: "20",
    ph: "92"
  },
  {
    name: "Frosta",
    lat: "63.59",
    lon: "10.74",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "12"
  },
  {
    name: "Levanger",
    lat: "63.746",
    lon: "11.299",
    vn: "9",
    gb: "32",
    fo: "4",
    hr: "5",
    ph: "68"
  },
  {
    name: "Verdal",
    lat: "63.793",
    lon: "11.48",
    vn: "7",
    gb: "11",
    fo: "0",
    hr: "8",
    ph: "53"
  },
  {
    name: "Snåsa",
    lat: "64.25",
    lon: "12.38",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "5"
  },
  {
    name: "Lierne",
    lat: "64.45",
    lon: "13.59",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Røyrvik",
    lat: "64.89",
    lon: "13.56",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Namsskogan",
    lat: "64.92",
    lon: "13.16",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Grong",
    lat: "64.465",
    lon: "12.315",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Høylandet",
    lat: "64.63",
    lon: "12.3",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Overhalla",
    lat: "64.49",
    lon: "11.95",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "10"
  },
  {
    name: "Flatanger",
    lat: "64.45",
    lon: "10.95",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Leka",
    lat: "65.09",
    lon: "11.7",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Inderøy",
    lat: "63.87",
    lon: "11.3",
    vn: "0",
    gb: "12",
    fo: "0",
    hr: "0",
    ph: "18"
  },
  {
    name: "Indre Fosen",
    lat: "63.57",
    lon: "10.28",
    vn: "9",
    gb: "28",
    fo: "0",
    hr: "11",
    ph: "94"
  },
  {
    name: "Heim",
    lat: "63.2",
    lon: "9.05",
    vn: "5",
    gb: "6",
    fo: "0",
    hr: "3",
    ph: "18"
  },
  {
    name: "Hitra",
    lat: "63.6",
    lon: "8.86",
    vn: "4",
    gb: "5",
    fo: "0",
    hr: "4",
    ph: "44"
  },
  {
    name: "Ørland",
    lat: "63.7",
    lon: "9.67",
    vn: "12",
    gb: "20",
    fo: "0",
    hr: "0",
    ph: "68"
  },
  {
    name: "Åfjord",
    lat: "64.0",
    lon: "10.3",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "21"
  },
  {
    name: "Orkland",
    lat: "63.3",
    lon: "9.8",
    vn: "7",
    gb: "33",
    fo: "0",
    hr: "3",
    ph: "53"
  },
  {
    name: "Nærøysund",
    lat: "64.86",
    lon: "11.24",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "0",
    ph: "73"
  },
  {
    name: "Rindal",
    lat: "63.05",
    lon: "9.22",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "8"
  },
  {
    name: "Bodø",
    lat: "67.28",
    lon: "14.405",
    vn: "15",
    gb: "116",
    fo: "3",
    hr: "32",
    ph: "260"
  },
  {
    name: "Narvik",
    lat: "68.438",
    lon: "17.427",
    vn: "8",
    gb: "28",
    fo: "0",
    hr: "8",
    ph: "80"
  },
  {
    name: "Bindal",
    lat: "65.09",
    lon: "12.6",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Sømna",
    lat: "65.31",
    lon: "12.1",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "5"
  },
  {
    name: "Brønnøy",
    lat: "65.46",
    lon: "12.21",
    vn: "3",
    gb: "8",
    fo: "0",
    hr: "0",
    ph: "35"
  },
  {
    name: "Vega",
    lat: "65.68",
    lon: "11.95",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Vevelstad",
    lat: "65.66",
    lon: "12.42",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Herøy",
    lat: "65.99",
    lon: "12.3",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Alstahaug",
    lat: "66.02",
    lon: "12.63",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "7",
    ph: "82"
  },
  {
    name: "Leirfjord",
    lat: "66.07",
    lon: "13.12",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Vefsn",
    lat: "65.84",
    lon: "13.19",
    vn: "3",
    gb: "12",
    fo: "0",
    hr: "10",
    ph: "48"
  },
  {
    name: "Grane",
    lat: "65.48",
    lon: "13.87",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Hattfjelldal",
    lat: "65.59",
    lon: "13.99",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "7",
    ph: "3"
  },
  {
    name: "Dønna",
    lat: "66.1",
    lon: "12.53",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Nesna",
    lat: "66.2",
    lon: "13.02",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "12"
  },
  {
    name: "Hemnes",
    lat: "66.08",
    lon: "13.81",
    vn: "0",
    gb: "6",
    fo: "0",
    hr: "6",
    ph: "17"
  },
  {
    name: "Rana",
    lat: "66.375",
    lon: "14.14",
    vn: "3",
    gb: "28",
    fo: "3",
    hr: "31",
    ph: "110"
  },
  {
    name: "Lurøy",
    lat: "66.4",
    lon: "12.8",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "3",
    ph: "10"
  },
  {
    name: "Træna",
    lat: "66.5",
    lon: "12.1",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "11"
  },
  {
    name: "Rødøy",
    lat: "66.7",
    lon: "13.0",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "8"
  },
  {
    name: "Meløy",
    lat: "66.87",
    lon: "13.8",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "0",
    ph: "31"
  },
  {
    name: "Gildeskål",
    lat: "67.03",
    lon: "14.07",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "0",
    ph: "20"
  },
  {
    name: "Beiarn",
    lat: "67.0",
    lon: "14.7",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Saltdal",
    lat: "67.1",
    lon: "15.6",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "17"
  },
  {
    name: "Fauske",
    lat: "67.26",
    lon: "15.39",
    vn: "0",
    gb: "9",
    fo: "0",
    hr: "12",
    ph: "26"
  },
  {
    name: "Sørfold",
    lat: "67.35",
    lon: "15.6",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Steigen",
    lat: "67.77",
    lon: "15.01",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Lødingen",
    lat: "68.41",
    lon: "15.99",
    vn: "0",
    gb: "8",
    fo: "0",
    hr: "0",
    ph: "13"
  },
  {
    name: "Evenes",
    lat: "68.52",
    lon: "16.68",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "6",
    ph: "10"
  },
  {
    name: "Røst",
    lat: "67.52",
    lon: "12.1",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Værøy",
    lat: "67.66",
    lon: "12.68",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "0"
  },
  {
    name: "Flakstad",
    lat: "68.08",
    lon: "13.22",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "3",
    ph: "3"
  },
  {
    name: "Vestvågøy",
    lat: "68.15",
    lon: "13.61",
    vn: "0",
    gb: "16",
    fo: "0",
    hr: "5",
    ph: "43"
  },
  {
    name: "Vågan",
    lat: "68.23",
    lon: "14.56",
    vn: "0",
    gb: "30",
    fo: "3",
    hr: "21",
    ph: "34"
  },
  {
    name: "Hadsel",
    lat: "68.56",
    lon: "14.92",
    vn: "3",
    gb: "6",
    fo: "0",
    hr: "4",
    ph: "22"
  },
  {
    name: "Bø",
    lat: "68.62",
    lon: "14.47",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "15"
  },
  {
    name: "Øksnes",
    lat: "68.92",
    lon: "15.25",
    vn: "0",
    gb: "3",
    fo: "3",
    hr: "0",
    ph: "24"
  },
  {
    name: "Sortland",
    lat: "68.7",
    lon: "15.41",
    vn: "4",
    gb: "8",
    fo: "0",
    hr: "6",
    ph: "36"
  },
  {
    name: "Andøy",
    lat: "69.08",
    lon: "15.64",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "4",
    ph: "19"
  },
  {
    name: "Moskenes",
    lat: "67.93",
    lon: "12.97",
    vn: "3",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Hamarøy",
    lat: "68.1",
    lon: "15.5",
    vn: "3",
    gb: "3",
    fo: "0",
    hr: "3",
    ph: "22"
  },
  {
    name: "Tromsø",
    lat: "69.649",
    lon: "18.955",
    vn: "33",
    gb: "291",
    fo: "10",
    hr: "71",
    ph: "250"
  },
  {
    name: "Harstad",
    lat: "68.798",
    lon: "16.541",
    vn: "10",
    gb: "66",
    fo: "4",
    hr: "17",
    ph: "82"
  },
  {
    name: "Kvæfjord",
    lat: "68.77",
    lon: "16.05",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "10"
  },
  {
    name: "Tjeldsund",
    lat: "68.54",
    lon: "16.6",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "12",
    ph: "18"
  },
  {
    name: "Ibestad",
    lat: "68.8",
    lon: "17.25",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Gratangen",
    lat: "68.68",
    lon: "17.54",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Lavangen",
    lat: "68.73",
    lon: "17.83",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "6"
  },
  {
    name: "Bardu",
    lat: "68.86",
    lon: "18.35",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Salangen",
    lat: "68.87",
    lon: "17.85",
    vn: "3",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "4"
  },
  {
    name: "Målselv",
    lat: "69.05",
    lon: "18.55",
    vn: "0",
    gb: "8",
    fo: "0",
    hr: "0",
    ph: "23"
  },
  {
    name: "Sørreisa",
    lat: "69.15",
    lon: "18.15",
    vn: "0",
    gb: "5",
    fo: "0",
    hr: "0",
    ph: "19"
  },
  {
    name: "Dyrøy",
    lat: "69.1",
    lon: "17.85",
    vn: "0",
    gb: "3",
    fo: "3",
    hr: "0",
    ph: "3"
  },
  {
    name: "Senja",
    lat: "69.3",
    lon: "17.0",
    vn: "0",
    gb: "22",
    fo: "0",
    hr: "13",
    ph: "80"
  },
  {
    name: "Balsfjord",
    lat: "69.32",
    lon: "19.2",
    vn: "3",
    gb: "10",
    fo: "0",
    hr: "0",
    ph: "21"
  },
  {
    name: "Karlsøy",
    lat: "69.7",
    lon: "19.6",
    vn: "0",
    gb: "4",
    fo: "0",
    hr: "3",
    ph: "16"
  },
  {
    name: "Lyngen",
    lat: "69.58",
    lon: "20.2",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Storfjord",
    lat: "69.25",
    lon: "20.3",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "16"
  },
  {
    name: "Kåfjord",
    lat: "69.61",
    lon: "20.55",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "3",
    ph: "5"
  },
  {
    name: "Skjervøy",
    lat: "70.03",
    lon: "20.97",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "12"
  },
  {
    name: "Nordreisa",
    lat: "69.8",
    lon: "21.2",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Kvænangen",
    lat: "69.92",
    lon: "22.1",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Alta",
    lat: "69.968",
    lon: "23.271",
    vn: "6",
    gb: "29",
    fo: "3",
    hr: "8",
    ph: "84"
  },
  {
    name: "Hammerfest",
    lat: "70.663",
    lon: "23.682",
    vn: "5",
    gb: "14",
    fo: "6",
    hr: "14",
    ph: "85"
  },
  {
    name: "Sør-Varanger",
    lat: "69.728",
    lon: "30.042",
    vn: "0",
    gb: "14",
    fo: "0",
    hr: "8",
    ph: "89"
  },
  {
    name: "Vadsø",
    lat: "70.074",
    lon: "29.748",
    vn: "0",
    gb: "7",
    fo: "0",
    hr: "13",
    ph: "14"
  },
  {
    name: "Karasjok",
    lat: "69.471",
    lon: "25.514",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "3",
    ph: "7"
  },
  {
    name: "Kautokeino",
    lat: "69.012",
    lon: "23.041",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "23"
  },
  {
    name: "Loppa",
    lat: "70.33",
    lon: "21.5",
    vn: "3",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "16"
  },
  {
    name: "Hasvik",
    lat: "70.5",
    lon: "22.0",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "12"
  },
  {
    name: "Måsøy",
    lat: "70.99",
    lon: "24.66",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "3"
  },
  {
    name: "Nordkapp",
    lat: "71.17",
    lon: "25.78",
    vn: "3",
    gb: "5",
    fo: "4",
    hr: "0",
    ph: "16"
  },
  {
    name: "Porsanger",
    lat: "70.05",
    lon: "25.06",
    vn: "3",
    gb: "5",
    fo: "0",
    hr: "4",
    ph: "12"
  },
  {
    name: "Lebesby",
    lat: "70.96",
    lon: "27.35",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "9"
  },
  {
    name: "Gamvik",
    lat: "71.04",
    lon: "27.85",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "3",
    ph: "20"
  },
  {
    name: "Tana",
    lat: "70.199",
    lon: "28.189",
    vn: "0",
    gb: "3",
    fo: "0",
    hr: "0",
    ph: "7"
  },
  {
    name: "Berlevåg",
    lat: "70.86",
    lon: "29.09",
    vn: "0",
    gb: "3",
    fo: "3",
    hr: "0",
    ph: "3"
  },
  {
    name: "Båtsfjord",
    lat: "70.6",
    lon: "29.72",
    vn: "0",
    gb: "3",
    fo: "15",
    hr: "0",
    ph: "4"
  },
  {
    name: "Vardø",
    lat: "70.37",
    lon: "31.11",
    vn: "0",
    gb: "3",
    fo: "3",
    hr: "3",
    ph: "10"
  },
  {
    name: "Nesseby",
    lat: "70.17",
    lon: "28.56",
    vn: "0",
    gb: "0",
    fo: "0",
    hr: "0",
    ph: "11"
  },

];
  const [currentMode, setCurrentMode] = useState("");

  // preprocess cities once
  const cities = ikke.map((city) => ({
    ...city,
    lat: parseFloat(city.lat),
    lng: parseFloat(city.lon),
    vn: parseInt(city.vn, 10),
    gb: parseInt(city.gb, 10),
    fo: parseInt(city.fo, 10),
    hr: parseInt(city.hr, 10),
  }));

  function getRadius(value) {
    const max = 10000;
    const normalized = Math.min(value, max) / max;
    return 500 + Math.sqrt(normalized) * 7000;
  }

  function clearMarkers() {
    markersRef.current.forEach((m) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(m);
      }
    });
    markersRef.current = [];
  }

  function drawMap() {
    if (!mapInstanceRef.current) return;

    clearMarkers();

    cities.forEach((city) => {
      const value = city[currentMode];

      if (!value) return;

      const marker = L.circle([city.lat, city.lng], {
        radius: getRadius(value),
        fillColor: "#3b82f6",
        color: "#000",
        weight: 1,
        fillOpacity: 0.7,
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(`
        <h3>${city.name}</h3>
        ${currentMode}: ${value.toLocaleString()}<br/>
      `);

      markersRef.current.push(marker);
    });
  }

  // initialize map once
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([64.5, 10], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    drawMap(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); 

  // redraw when mode changes
  useEffect(() => {
    drawMap();
  }, [currentMode]);

  // #controls {
//   position: absolute;
//   top: 10px;
//   left: 60px;
//   z-index: 1000;
//   background: white;
//   padding: 10px;
//   border-radius: 5px;
// }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "60px",
          zIndex: 1000,
          background: "white",
          padding: 10,
          borderRadius: "5px",
          // display: "flex",
          // gap: "8px",
        }}
      >
        <button onClick={() => setCurrentMode("vn")}>
          VN
        </button>
        <button onClick={() => setCurrentMode("gb")}>
          GB
        </button>
        <button onClick={() => setCurrentMode("fo")}>
          FO
        </button>
        <button onClick={() => setCurrentMode("hr")}>
          HR
        </button>
      </div>

      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}


// function App() {
//   return <Map />;
// }
// export default App

// import { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "./App.css";

// function App() {


// export default App

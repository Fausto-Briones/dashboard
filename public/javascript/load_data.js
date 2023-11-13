import {tiempoArr, precipitacionArr, uvArr, temperaturaArr} from './static_data.js';
let fechaActual = () => new Date().toISOString().slice(0,10);
let cargarPrecipitacion = () => {
  //Obtenga la fecha actual
  let actual = fechaActual();

  //Defina un arreglo temporal vacío
  let datos = []

   //Itere en el arreglo tiempoArr para filtrar los valores de precipitacionArr que sean igual con la fecha actual
   for (let index = 0; index < tiempoArr.length; index++) {
    const tiempo = tiempoArr[index];
    const precipitacion = precipitacionArr[index]

    if(tiempo.includes(actual)) {
      datos.push(precipitacion)
    }
  }

   //Con los valores filtrados, obtenga los valores máximo, promedio y mínimo
   let max = Math.max(...datos)
   let min = Math.min(...datos)
   let sum = datos.reduce((a, b) => a + b, 0);
   let prom = (sum / datos.length) || 0;

   let precipitacionMinValue = document.getElementById("precipitacionMinValue")
   let precipitacionPromValue = document.getElementById("precipitacionPromValue")
   let precipitacionMaxValue = document.getElementById("precipitacionMaxValue")

   precipitacionMinValue.textContent = `Min ${min} [mm]`
   precipitacionPromValue.textContent = `Prom ${ Math.round(prom * 100) / 100 } [mm]`
   precipitacionMaxValue.textContent = `Max ${max} [mm]`
  }

  let cargarFechaActual = () => {
  
    //Obtenga la referencia al elemento h6
    let coleccionHTML = document.getElementsByTagName("h6")
    let tituloH6 = coleccionHTML[0]
    //Actualice la referencia al elemento h6 con el valor de la función fechaActual()
    tituloH6.textContent = fechaActual()
  }
  
  let cargarOpenMeteo = () => {
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&timezone=auto';
    fetch(URL)
        .then(responseText => responseText.json())
        .then(responseJSON => {

        let plotRef = document.getElementById('plot1');
        //Etiquetas del gráfico
        let labels = responseJSON.hourly.time;
        //Etiquetas de los datos
        let data = responseJSON.hourly.temperature_2m;

        //Objeto de configuración del gráfico
        let config = {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [
            {
                label: 'Temperature [2m]',
                data: data, 
            }
            ]
        }
        };

        //Objeto con la instanciación del gráfico
        let chart1  = new Chart(plotRef, config);

        })

        .catch(console.error);
  }
  let parseXML = (responseText) => {
  
    // Parsing XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(responseText, "application/xml");
    // Referencia al elemento `#forecastbody` del documento HTML

    let forecastElement = document.querySelector("#forecastbody")
    forecastElement.innerHTML = ''

    // Procesamiento de los elementos con etiqueta `<time>` del objeto xml
    let timeArr = xml.querySelectorAll("time")

    timeArr.forEach(time => {
        
        let from = time.getAttribute("from").replace("T", " ")

        let humidity = time.querySelector("humidity").getAttribute("value")
        let windSpeed =  time.querySelector("windSpeed").getAttribute("value")
        let precipitation =  time.querySelector("precipitation").getAttribute("value")
        let pressure =  time.querySelector("pressure").getAttribute("value")
        let cloud =  time.querySelector("clouds").getAttribute("value")

        let template = `
            <tr>
                <td>${from}</td>
                <td>${humidity}</td>
                <td>${windSpeed}</td>
                <td>${precipitation}</td>
                <td>${pressure}</td>
                <td>${cloud}</td>
            </tr>
        `

        //Renderizando la plantilla en el elemento HTML
        forecastElement.innerHTML += template;
        })
    
  
  }
  
  //Callback
  let selectListener = async (event) => {
  
    let selectedCity = event.target.value

    let cityStorage = localStorage.getItem(selectedCity);

    if (cityStorage == null) {

    try {

        //API key
        let APIkey = '09b41653a8b80530c8b7e1b3e0140c56'
        let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`

        let response = await fetch(url)
        let responseText = await response.text()
        
        await parseXML(responseText)

    } catch (error) {
        console.log(error)
    }
    
    }else{
        parseXML(cityStorage)
    }
  
  }
  
  let loadForecastByCity = () => {
  
    //Handling event
    let selectElement = document.querySelector("select")
    selectElement.addEventListener("change", selectListener)
  
  }

 let loadExternaltable =  () =>{
   let proxyURL = 'https://cors-anywhere.herokuapp.com/'
   let endpoint = proxyURL + 'https://www.gestionderiesgos.gob.ec/monitoreo-de-inundaciones/'
    fetch(endpoint)
      .then(response => {
        return response.text();
      })

      .then(xmlContent=>{
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlContent,"text/html");
        let table_reference = xml.querySelector("#postcontent table")
        document.getElementById("monitoreo").innerHTML = table_reference.outerHTML

      })

      .catch(console.error)



  }
  loadExternaltable()
  
  loadForecastByCity()

  cargarOpenMeteo()
  cargarFechaActual()
  
  cargarPrecipitacion()

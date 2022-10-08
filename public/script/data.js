
var categoryCSV = "https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/CategoryProcessed.csv"
const WIDTH = 1150;
const HEIGHT = 500;

// PARTE 1: VISUALIZACION CATEGORIAS

d3.csv(categoryCSV).then(categoryData => {

    const svgCategory = d3
      .select("#CategoriasID")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);
      
    // PINTURA

    // Normalizar datos de los generos
    categoryData.map(pain => {
        total = 0;
        total = total + parseInt(pain.Male);
        total = total + parseInt(pain.Female);
        pain.Male = (parseInt(pain.Male) / total) * 100
        pain.Female = (parseInt(pain.Female) / total) * 100
    })
    
    const apiladorGenero = d3
      .stack()
      .keys(["Male", "Female"]);

    const series = apiladorGenero(categoryData); 

    const escalaGeneroY = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(series, (serie) => d3.max(serie, (arreglo) => arreglo[1])),
      ])
      .range([275, 225]);
  
    const escalaColorGenero = d3
      .scaleOrdinal()
      .domain(series.keys())
      .range(["blue", "deeppink"]);
  
    const escalaGeneroXBar = d3
      .scaleBand()
      .domain(d3.range(categoryData.length))
      .range([175, WIDTH - 175])
      .paddingInner(0.6);

    //PASPARTU
    var totalObras = categoryData.reduce(function(tot, x) { 
        return tot + parseInt(x.Artwork);
      },0);
    
    categoryData.map(pain => {
        pain.Artwork = (parseInt(pain.Artwork) / totalObras) * 100
    })

    const apiladorObras = d3
      .stack()
      .keys(["Artwork"]);
    
    const cantidadObras = apiladorObras(categoryData)

    const escalaObrasLargo = d3
      .scaleLog()
      .domain([
        1,
        d3.max(cantidadObras, (obra) => d3.max(obra, (arreglo) => arreglo[1])),
      ])
      .range([0, 30]);
    
    const escalaObrasXBar = d3
      .scaleBand()
      .domain(d3.range(categoryData.length))
      .range([175, WIDTH - 175])
      .paddingInner(0.6)
    
    // MARCO

    var totalArtistas = categoryData.reduce(function(tot, x) { 
        return tot + parseInt(x.Artist);
      },0);
    
    categoryData.map(pain => {
        pain.Artist = (parseInt(pain.Artist) / totalArtistas) * 100
    })

    const apiladorArtistas = d3
      .stack()
      .keys(["Artist"]);
    
    const cantidadArtistas = apiladorArtistas(categoryData)

    const escalaArtistasLargo = d3
    .scaleLog()
    .domain([
      1,
      d3.max(cantidadArtistas, (obra) => d3.max(obra, (arreglo) => arreglo[1])),
    ])
    .range([0, 10]);
    

    cat = ["pink", "yellow", "green", "crimson", "lime", "tan", "magenta"]

    const escalaColorArtistas = d3
    .scaleOrdinal()
    .domain(series.keys())
    .range(["pink", "yellow", "green", "crimson", "lime", "tan", "magenta"]);

    const grupos = svgCategory
      .selectAll("g")
      .data(categoryData)
      .join(enter => {
        const grupos = enter.append("g");

        // TITULO

        grupos.append("text")
        .attr("style", "text-decoration: underline")
      .attr('x',function(d,i) {
        if(parseInt(i) == 0){
          return 170
        }
        else if(parseInt(i) == 1){
          return 240
        }
        else if(parseInt(i) == 2){
          return 410
        }
        else if(parseInt(i) == 3){
          return 510
        }
        else if(parseInt(i) == 4){
          return 630
        }
        else if(parseInt(i) == 5){
          return 740
        }
        else if(parseInt(i) == 6){
          return 935
        }
      })
      .attr('y', function(d,i) {
        if(parseInt(i) == 0){
          return 190
        }
        else if(parseInt(i) == 1){
          return 170
        }
        else if(parseInt(i) == 2){
          return 185
        }
        else if(parseInt(i) == 3){
          return 190
        }
        else if(parseInt(i) == 4){
          return 204
        }
        else if(parseInt(i) == 5){
          return 215
        }
        else if(parseInt(i) == 6){
          return 215
        }
      })
      .text(d => d.Category)
        
        // MARCO
        grupos.append("rect")
        .attr("fill", (d, i, _) => cat[i])
        .attr("x", (d, i) => (25 + escalaObrasXBar(i)) - (25 +  escalaObrasLargo(d.Artwork)) - escalaArtistasLargo(d.Artist))
        .attr("y", (d) => 225 -  escalaObrasLargo(d.Artwork) - escalaArtistasLargo(d.Artist) )
        .attr("width", (d) => ((25 +  escalaObrasLargo(d.Artwork)) * 2) +  escalaArtistasLargo(d.Artist) * 2 )
        .attr("height", (d) => ((25 +  escalaObrasLargo(d.Artwork)) * 2) +  escalaArtistasLargo(d.Artist) * 2 );

        // PASPARTU
        grupos.append("rect")
        .attr("fill", "white")
        .attr("x", (d, i) => (25 + escalaObrasXBar(i)) - (25 +  escalaObrasLargo(d.Artwork)))
        .attr("y", (d) => 225 -  escalaObrasLargo(d.Artwork))
        .attr("width", (d) => (25 +  escalaObrasLargo(d.Artwork)) * 2)
        .attr("height", (d) => (25 + escalaObrasLargo(d.Artwork)) * 2 ) ;

        // PINTURAS
        dos = [0,1]
        dos.map(x => {
          grupos.append("rect")
          .attr("fill", (d) => escalaColorGenero(series[x].key))
          .attr("x", (d, i) => escalaGeneroXBar(i))
          .attr("y", (d, i) => escalaGeneroY(series[x][i][1]))
          .attr("width", escalaGeneroXBar.bandwidth())
          .attr("height", (d, i) => escalaGeneroY(series[x][i][0]) - escalaGeneroY(series[x][i][1]))
        })

        grupos.append("text")
        .attr("class", "porcentaje")
        .attr("x", (d, i) => escalaGeneroXBar(i)-50)
        .attr("y", 335)
        .text(d => "Male: " + Math.round(d.Male * 100) / 100 + "% Female: " + Math.round(d.Female * 100) / 100 + "%")
        .attr("opacity", 0)


        return grupos.attr("transform", (_, i) => `translate(${20*i}, 40)`)



      })

      grupos.on('mouseover', (event, d, a) => {
        grupos.selectAll(".porcentaje")
        .attr('opacity', (dato) => {
          return dato.Category == d.Category ? '1' : '0';
        })
        })
      grupos.on('mouseout',(event, d, a) => {
        grupos.selectAll(".porcentaje")
        .attr('opacity',0)
        })
      grupos.on("click", (event, d, a) => {

        grupos.attr('opacity', (dato) => {
            return dato.Category == d.Category ? '1' : '0.3';
        })

    })

})

// ###################################################################################################

// PARTE 2: GLIFOS ARTISTAS

const ArtistProcessedURL = 'https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv'

// Función para procesar los datos de artistas
function parseArtist(d) {
    const data = {
        Artist: d.Artist,
        BirthYear: +d.BirthYear,
        Categories: JSON.parse(d.Categories),
        DeathYear: +d.DeathYear,
        Gender: d.Gender,
        Nacionality: d.Nacionality,
        TotalArtwork: +d.TotalArtwork,
    }
    return data
}

// Cargamos los datos, los procesamos y creamos las 4 visualizaciones
d3.csv(ArtistProcessedURL, parseArtist).then(artists => {
    // Multiples appends
    createVis1(artists.slice(10, 20));
})

var c = "Prints & Illustrated Books"
// Función para practicar múltiples appends.
function createVis1(array) {

  // Creamos un SVG de 800px de ancho y 400 de largo.
  const SVG = d3.select("#ArtistasID")
      .append("svg")
      .attr("width", 800)
      .attr("height", 400);

  const domain = [...Array(10).keys()]; // Creamos una lista de 0 al 9


  const radius = d3
        .scaleLinear()
        .domain(d3.extent(array))
        .range([0, 20])

  // Definimos escala de bandas para poner cada dato.
  const escalaX = d3
      .scaleBand()
      .domain(domain)
      .rangeRound([0, 800])
      .padding(0.1); // agregar sepación entre el final y el inicio de una banda.

  // Definimos escala raiz cuadrada para procesar el total de obras por artista
  const escalaY = d3
      .scaleSqrt()
      .domain([0, d3.max(array, d => d.TotalArtwork)])
      .range([0, 200])

  // Hacemos el datajoin  y guardamos el resultados en la variable "grupos"
  // Recordar que el resultado del join es la unión de la selección enter y update
  const grupos = SVG
      .selectAll("g")
      .data(array, d => d.Artist)
      .join(enter => {
          // Creamos un grupo "g"
          const grupos = enter.append("g");


          // Para cada grupo, le agregamos un círculo 
          grupos.append("circle")
              .attr('r', 10)
              .attr('cx', 25)
              .attr('cy', 0)

          // Para cada grupo, le agregamos un cuadrado 
          const sizeRect = 20
          grupos.append("rect")
              .attr('width', sizeRect)
              .attr('height', sizeRect)
              .attr('x', 25 - sizeRect / 2)
              .attr('y', 10)

          // Para cada grupo, le agregamos una barrita
          grupos.append("rect")
              .attr('class', 'barra')
              .attr('width', 5)
              .attr('height', d => escalaY(d.TotalArtwork))
              .attr('x', 25 - 5 / 2)
              .attr('y', 35)

          // Para cada grupo, le agregamos un texto
          grupos.append("text")
              .attr('x', 25)
              .attr('y', d => 35 + escalaY(d.TotalArtwork) + 20)
              .style("dominant-baseline", "middle")
              .style("text-anchor", "middle")
              .text(d => d.Artist.slice(0, 8))
          
          
          

          // retornamos nuestros grupo ques aprovechamos de aplicar una traslación a 
          // cada uno en el eje X.
          return grupos.attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`)
      })

  // A cada grupo (enter + update) le aplicamos el evento click para cambiar su color
  grupos.on("click", (event, d, a) => {
      grupos.attr('fill', (dato) => {
          return dato.Category == d.Category ? 'tomato' : 'skyblue';
      })

  })

}

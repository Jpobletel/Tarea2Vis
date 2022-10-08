var categoryCSV = "https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/CategoryProcessed.csv"
const WIDTH = 1150;
const HEIGHT = 500;
const ArtistProcessedURL = 'https://gist.githubusercontent.com/Hernan4444/16a8735acdb18fabb685810fc4619c73/raw/face46bb769c88a3e36ef3e7287eebd8c1b64773/ArtistProcessed.csv'

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

d3.csv(categoryCSV).then(categoryData => {
    createVis1(categoryData)
})

// d3.csv(ArtistProcessedURL, parseArtist).then(artists => {
//     createVis2(artists.slice(10, 20));
// })

function createVis1(array) {

    const SVG = d3
      .select("#CategoriasID")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

    const domain = [...Array(6).keys()]; // Creamos una lista de 0 al 9

    // Definimos escala de bandas para poner cada dato.
    const escalaX = d3
        .scaleBand()
        .domain(domain)
        .rangeRound([0, 800])
        .padding(0.1); // agregar sepación entre el final y el inicio de una banda.

    const apiladorGenero = d3
    .stack()
    .keys(["Male", "Female"]);

    const series = apiladorGenero(array);   

    // Definimos escala raiz cuadrada para procesar el total de obras por artista
    const escalaY = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(series, (serie) => d3.max(serie, (arreglo) => arreglo[1])),
      ])
      .range([275, 225]);

    // Hacemos el datajoin  y guardamos el resultados en la variable "grupos"
    // Recordar que el resultado del join es la unión de la selección enter y update
    const grupos = SVG
        .selectAll("g")
        .data(array, d => d.Categories)
        .join(enter => {
            // Creamos un grupo "g"
            const grupos = enter.append("g");


            // Para cada grupo, le agregamos un círculo 
            grupos.append("circle")
                .attr('r', 10)
                .attr('cx', 25)
                .attr('cy', 0)

            grupos.append("rect")
                .attr('class', 'barra')
                .attr('width', 5)
                .attr('height', d => escalaY(d.TotalArtwork))
                .attr('x', 25 - 5 / 2)
                .attr('y', 35)
            return grupos.attr("transform", (_, i) => `translate(${escalaX(i)}, 40)`)
        })

    // A cada grupo (enter + update) le aplicamos el evento click para cambiar su color
    grupos.on("click", (event, d, a) => {

        grupos.attr('fill', (dato) => {
            return dato.Artist == d.Artist ? 'tomato' : 'skyblue';
        })

    })

}
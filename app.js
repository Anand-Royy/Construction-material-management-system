let number = document.getElementById('number');
let counter = 0;
setInterval(() => {
  if (counter == 65) {
    clearInterval();
  } else {
    counter += 1;
    number.innerHTML = counter + '%';
  }
},30);





// Debojyoti's code



google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawStuff);

      function drawStuff() {
        var data = new google.visualization.arrayToDataTable([
          ['Year', 'Number of Projects'],
          ["2022", 95],
          ["2021", 31],
          ["2018", 12],
          ["2017", 15],
          ['2016', 3]
        ]);

        var options = {
          // title: 'Chess opening moves',
          width: 900,
          legend: { position: 'none' },
          // chart: { title: 'Chess opening moves',
          //          subtitle: 'popularity by percentage' },
          bars: 'horizontal', // Required for Material Bar Charts.
          axes: {
            x: {
              0: { side: 'top', label: 'Number of Projects'} // Top x-axis.
            }
          },
          bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById('top_x_div'));
        chart.draw(data, options);
      };
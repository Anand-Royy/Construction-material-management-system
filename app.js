const number = document.querySelectorAll('.number');
let counter = 0;
setInterval(() => {
  if (counter == 65) {
    clearInterval();
  } else {
    counter += 1;
    number.innerHTML = counter + '%';
  }
}, 30);

// Debojyoti's code

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Element', 'Density', { role: 'style' }],
    ['2015', 8, '#b87333'],
    ['2016', 10, 'silver'],
    ['2017', 19, 'gold'],
    ['2018', 21, 'color: #e5e4e2'],
  ]);

  var view = new google.visualization.DataView(data);
  view.setColumns([
    0,
    1,
    { calc: 'stringify', sourceColumn: 1, type: 'string', role: 'annotation' },
    2,
  ]);

  var options = {
    title: '',
    width: 00,
    height: 500,
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  };
  var chart = new google.visualization.ColumnChart(
    document.getElementById('columnchart_values')
  );
  chart.draw(view, options);
}

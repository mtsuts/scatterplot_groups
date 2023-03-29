// fetch data and make it ready for use
d3.csv("./data.csv").then(function (datum) {
  const data = datum.map((d) => {
    return {
      country: d.Entity,
      expectancy: Number(d["Life expectancy"]),
      gdp: Number(d["GDP ($)"]),
      group: d["Income group"],
    };
  });

  const container = { container: ".container" };
  chart(data, container);

  window.addEventListener("resize", function () {
    const div = document.querySelector(".container");
    div.innerHTML = "";
    chart(data, container);
  });
});

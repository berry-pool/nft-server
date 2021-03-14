const fs = require("fs");

const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const priceIdentifer = () => {
  const result = [];
  const idList = shuffle([...Array(5).keys()]);
  for (const id of idList) {
    let price = "20." + Math.random().toString(9).substr(2, 6);
    if (!result.some((t) => t.price == price)) result.push({ id, price });
  }
  fs.writeFileSync("idAvailable.json", JSON.stringify(result));
  return result;
};

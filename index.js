const fs = require("fs");
const { cardanocliJs } = require("./cardanocli");
const { initateMint, initateRefund } = require("./mint");
const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors")({ origin: true });
app.use(cors);
app.use(express.json());

console.log("Current UTxo Set:");
console.log(cardanocliJs.wallet("Test").balance().utxo);

const idAvailable = JSON.parse(fs.readFileSync("idAvailable.json").toString());
const idQueue = JSON.parse(fs.readFileSync("idQueue.json").toString());
const idReserved = JSON.parse(fs.readFileSync("idReserved.json").toString());
const idDone = JSON.parse(fs.readFileSync("idDone.json").toString());

const checkedWrongUTxO = {};

//addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y

// check valid transaction for mint
setInterval(() => {
  const utxos = cardanocliJs.wallet("Test").balance().utxo;
  utxos.forEach(async (utxo) => {
    const utxoAmount = utxo.amount.lovelace;
    const chosen = idAvailable.find((avail) => avail.price == utxoAmount);
    if (chosen) {
      console.log("Minting SpaceBud#" + chosen.id);
      console.log(utxo);
      idQueue.push(chosen);
      const txHash = await initateMint(utxo, chosen.id);
      console.log("TxHash: " + txHash);
      const index = idAvailable.indexOf(chosen);
      const indexQueue = idQueue.indexOf(chosen);
      if (index !== -1 && indexQueue !== -1 && txHash) {
        checkedWrongUTxO[JSON.stringify(utxo)] = true;
        idAvailable.splice(index, 1);
        idQueue.splice(indexQueue, 1);
        idDone.push(chosen);
      }
    }
  });
}, 1000);

// update idLists
setInterval(() => {
  fs.writeFile("idAvailable.json", JSON.stringify(idAvailable), (err) => {});
  fs.writeFile("idQueue.json", JSON.stringify(idQueue), (err) => {});
  fs.writeFile("idReserved.json", JSON.stringify(idReserved), (err) => {});
  fs.writeFile("idDone.json", JSON.stringify(idDone), (err) => {});
}, 3000);

// check refund
setInterval(() => {
  const utxos = cardanocliJs.wallet("Test").balance().utxo;
  utxos.forEach(async (utxo) => {
    const utxoAmount = utxo.amount.lovelace;
    if (
      idAvailable.every((avail) => avail.price != utxoAmount) &&
      utxoAmount >= cardanocliJs.toLovelace(10) &&
      !checkedWrongUTxO[JSON.stringify(utxo)]
    ) {
      console.log("Sending wrong UTxO back:");
      console.log(utxo);
      const txHash = await initateRefund(utxo);
      console.log("TxHash (wrong UTxO): " + txHash);
      if (txHash) checkedWrongUTxO[JSON.stringify(utxo)] = true;
    }
  });
}, 10000);

// check reservation
setInterval(() => {
  for (let i = idReserved.length - 1; 0 <= i; i--) {
    const res = idReserved[i];
    const min20 = 1200 * 1000;
    if (Date.now() - res.time > min20) idReserved.splice(i, 1);
  }
}, 3000);

app.get("/reserveId", (req, res) => {
  for (avail of idAvailable)
    if (
      idQueue.every((q) => q.price != avail.price) &&
      idReserved.every((r) => r.item.price != avail.price)
    ) {
      idReserved.push({ time: Date.now(), item: avail });
      return res.json({ price: avail.price });
    }
  return res.json({ msg: "no free Ids found" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
console.log("Wallet waiting for transactions...");

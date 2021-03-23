const fs = require("fs");
const { default: fetch } = require("node-fetch");
const { cardanocliJs } = require("./cardanocli");
const { initateMint, initateRefund } = require("./mint");
const { db } = require("./util/db");

console.log("Current UTxo Set:");
console.log(cardanocliJs.wallet("Test").balance().utxo);

const idAvailable = JSON.parse(fs.readFileSync("idAvailable.json").toString());
db.collection("SpaceBudz").doc("idAvailable").set({ ar: idAvailable });
const idQueue = JSON.parse(fs.readFileSync("idQueue.json").toString());
db.collection("SpaceBudz").doc("idQueue").set({ ar: idQueue });
const idDone = JSON.parse(fs.readFileSync("idDone.json").toString());
db.collection("SpaceBudz").doc("idDone").set({ ar: idDone });
// db.collection("SpaceBudz").doc("idReserved").set({ ar: [] });

const checkedWrongUTxO = {};

let hasChanged = false;

let reservationInUse = false;

//addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y

//6bf5d009ce1a5b58cc661a887255495404c00c8992f544dac8961033

// check valid transaction for mint
const checkMint = async () => {
  const utxos = cardanocliJs.wallet("Test").balance().utxo;
  for (const utxo of utxos) {
    const utxoAmount = utxo.amount.lovelace;
    const chosen = idAvailable.find((avail) => avail.price == utxoAmount);
    const safetyCheck =
      chosen && idDone.every((done) => done.item.id != chosen.id);
    if (chosen && safetyCheck) {
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
        idDone.push({ item: chosen, txHash });
        hasChanged = true;
        setTimeout(
          () =>
            fetch(
              "https://api.telegram.org/bot1774547191:AAGr6FHPRJ3P8k7LBsi3HmaHGQXVXHMv7SI/sendMessage",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: -1001341506579,
                  text: `SpaceBud #${chosen.id} minted!\nhttps://spacebudz.io/explore/spacebud/${chosen.id}`,
                }),
              }
            ),
          1000
        );
      }
    }
  }
  if (hasChanged) {
    updateDB();
    hasChanged = false;
    console.log("Updated Id lists");
  }
  setTimeout(() => checkMint(), 1000);
};
checkMint();

const updateDB = () => {
  fs.writeFile("idAvailable.json", JSON.stringify(idAvailable), (err) => {});
  db.collection("SpaceBudz").doc("idAvailable").set({ ar: idAvailable });

  fs.writeFile("idQueue.json", JSON.stringify(idQueue), (err) => {});
  db.collection("SpaceBudz").doc("idQueue").set({ ar: idQueue });

  fs.writeFile("idDone.json", JSON.stringify(idDone), (err) => {});
  db.collection("SpaceBudz").doc("idDone").set({ ar: idDone });

  checkReservation();
};

// check refund
const checkRefund = async () => {
  const utxos = cardanocliJs.wallet("Test").balance().utxo;
  for (const utxo of utxos) {
    const utxoAmount = utxo.amount.lovelace;
    if (
      idAvailable.every((avail) => avail.price != utxoAmount) &&
      utxoAmount >= cardanocliJs.toLovelace(5) &&
      !checkedWrongUTxO[JSON.stringify(utxo)]
    ) {
      console.log("Sending wrong UTxO back:");
      console.log(utxo);
      const txHash = await initateRefund(utxo);
      console.log("TxHash (wrong UTxO): " + txHash);
      if (txHash) checkedWrongUTxO[JSON.stringify(utxo)] = true;
    }
  }
  setTimeout(() => checkRefund(), 10000);
};
checkRefund();

const checkReservation = async () => {
  if (reservationInUse) return;
  reservationInUse = true;
  let changedReservation = false;
  const idReservedDB = await db
    .collection("SpaceBudz")
    .doc("idReserved")
    .get()
    .then((doc) => doc.data());
  for (let i = idReservedDB.ar.length - 1; 0 <= i; i--) {
    const res = idReservedDB.ar[i];
    const min20 = 900 * 1000;
    if (
      Date.now() - res.time > min20 ||
      idDone.some((done) => done.item.id == res.id)
    ) {
      idReservedDB.ar.splice(i, 1);
      changedReservation = true;
    }
  }
  if (changedReservation) {
    await db.collection("SpaceBudz").doc("idReserved").set(idReservedDB);
    changedReservation = false;
  }
  reservationInUse = false;
};

const reservationInterval = async () => {
  await checkReservation();
  setTimeout(() => reservationInterval(), 3000);
};
reservationInterval();

console.log("Wallet waiting for transactions...");

const { cardanocliJs } = require("./cardanocli");

const createTransaction = (tx) => {
  let raw = cardanocliJs.transactionBuildRaw(tx);
  let fee = cardanocliJs.transactionCalculateMinFee({
    ...tx,
    txBody: raw,
  });
  tx.txOut[0].amount.lovelace -= fee;
  return cardanocliJs.transactionBuildRaw({ ...tx, fee });
};

const signTransaction = (wallet, tx) => {
  return cardanocliJs.transactionSign({
    signingKeys: [wallet.payment.skey],
    txBody: tx,
  });
};

const wallet = cardanocliJs.wallet("Cubone");
const balance = wallet.balance();
let lovelace = balance.amount.lovelace;
lovelace -= cardanocliJs.toLovelace(10) + 20021117;

const tx = {
  txIn: balance.utxo,
  txOut: [
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        ...balance.amount,
        lovelace,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 20021117,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: cardanocliJs.toLovelace(5),
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: cardanocliJs.toLovelace(5),
      },
    },
  ],
  witnessCount: 1,
};

// const raw = createTransaction(tx);
// const signed = signTransaction(wallet, raw);
// const txHash = cardanocliJs.transactionSubmit(signed);
// console.log(txHash);

console.log(wallet.balance().amount);
//addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y

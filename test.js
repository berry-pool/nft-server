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
balance.amount.lovelace -=
  15334115 +
  15307137 +
  15720022 +
  15340007 +
  15444226 +
  15784212 +
  15201477 +
  15414025 +
  15572264 +
  15773834 +
  15460458 +
  15164822 +
  15362730 +
  15888336 +
  15024361 +
  15067638 +
  15067638 +
  15432773 +
  15770608;

const tx = {
  txIn: balance.utxo,
  txOut: [
    {
      address: wallet.paymentAddr,
      amount: balance.amount,
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15334115,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15307137,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15720022,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15340007,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15444226,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15784212,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15201477,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15414025,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15572264,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15773834,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15460458,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15164822,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15362730,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15888336,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15024361,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15067638,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15067638,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15770608,
      },
    },
    {
      address:
        "addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y",
      amount: {
        lovelace: 15432773,
      },
    },
  ],
  witnessCount: 1,
};

console.log(tx.txOut.length);

const raw = createTransaction(tx);
const signed = signTransaction(wallet, raw);
const txHash = cardanocliJs.transactionSubmit(signed);
console.log(txHash);

// console.log(wallet.paymentAddr);
//addr_test1qrzq6cs7334u2c38qz8flc89yranpe7z93fr84huztknly30m4ay2h2xqe7kzkx3706e0dl2dukrsrfhq848p2qw2w8snk7j0y

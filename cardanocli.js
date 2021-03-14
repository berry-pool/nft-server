const os = require("os");
const path = require("path");
const fetch = require("sync-fetch");
const CardanocliJs = require("cardanocli-js");

const dir = path.join(os.homedir(), "testnet");

exports.cardanocliJs = new CardanocliJs({
  era: "mary", //current era
  network: "testnet-magic 1097911063",
  dir: dir, // working directory,
  socketPath: path.join(dir,"db","socket"),
  shelleyGenesisPath: path.join(dir,"files","testnet-shelley-genesis.json")
});

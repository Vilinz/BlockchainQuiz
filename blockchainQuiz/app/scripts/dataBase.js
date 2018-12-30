// Import the page's CSS. Webpack will know what to do with it.

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import dataCoinArtfact from '../../build/contracts/MyDataBase.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
// const MetaCoin = contract(metaCoinArtifact)
const DataBase = contract(dataCoinArtfact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let manager

const App = {
  start: function () {
    const self = this
    DataBase.setProvider(web3.currentProvider)
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }
      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      accounts = accs
      account = accounts[0]
    })
    self.get_manager()
  },
  get_manager: function () {
    let d
    DataBase.deployed().then(function (instance) {
      d = instance
      return d.getManager.call()
    }).then(function(address){
      manager = address.toString()
    }).catch(function(e) {
      console.log(e)
    })
  },
  add: function () {
    if(account === manager) {
      let d
      let id = document.getElementById("id").value
      let team0 = document.getElementById("team0").value
      let team1 = document.getElementById("team1").value
      let result = document.getElementById("result").value
      let temp = team0 + "," + team1 + "," + result
      DataBase.deployed().then(function (instance) {
        d = instance
        return d.addResult(id, temp, {from: account, gas: 3000000})
      }).then(function(){
        $("#users tbody").append("<tr>" +
          "<td>" + id + "</td>" +
          "<td>" + team0 + "</td>" +
          "<td>" + team1 + "</td>" +
          "<td>" + result + "</td>" +
          "</tr>")
      }).catch(function(e) {
        console.log(e)
      })
    } else {
      alert("Premission denied!")
    }

  },
  query: function () {
    let d
    let id = prompt("Please enter the game's id you want to query", "id")
    if(/^[0-9]+$/.test(id)) {
      DataBase.deployed().then(function (instance) {
        d = instance
        return d.queryResult.call(parseInt(id))
      }).then(function(value){
        let arr = value.toString().split(",")
        if((arr[0] === undefined)||(arr[1] === undefined)||(arr[2] === undefined)||(value.toString() === "")) {
          alert("DataBase has no record about this!")
        } else {
          $("#users tbody").append("<tr>" +
            "<td>" + id + "</td>" +
            "<td>" + arr[0] + "</td>" +
            "<td>" + arr[1] + "</td>" +
            "<td>" + arr[2] + "</td>" +
            "</tr>")
        }
      }).catch(function(e) {
        console.log(e)
      })
    } else {
      alert("Input illegal")
    }

  },
}
window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }
  App.start()
})

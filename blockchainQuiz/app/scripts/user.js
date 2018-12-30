// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import gameCoinArtfact from '../../build/contracts/Game.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
// const MetaCoin = contract(metaCoinArtifact)
const Game = contract(gameCoinArtfact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let id

const App = {
  start: function () {
    const self = this
    Game.setProvider(web3.currentProvider)
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
      //alert(accs.length)
      //alert(accs[0])
      account = accounts[0]
    })
    self.refresh()
  },
  refresh: function() {
    //init
    let g
    Game.deployed().then(function (instance) {
      g = instance
      return g.getInfo.call({from: account})
    }).then(function (info) {
      //alert(info)
      if(info !== undefined) {
        let arr = info.toString().split(",")
        document.getElementById("main_team").innerText = arr[0]
        document.getElementById("next_team").innerText = arr[1]
        document.getElementById("vs_p").innerText = "VS(" + arr[3] + ")"
        id = parseInt(arr[2])
        switch (arr[2]) {
          case "0" :
            document.getElementById("result").innerText = "The quiz have not begin yeah!"
            break
          case "1" :
            document.getElementById("result").innerText = "The quiz is playing. You can play now!"
            break
          case "2" :
            document.getElementById("result").innerText = "The quiz have been closed. You can not play now!"
            break
          case "3"  :
            document.getElementById("result").innerText = "The quiz is over!"
            break
          default:
            document.getElementById("result").innerText = "The quiz haved not begin yeah!"
        }
      }
    }).catch(function (e) {
      console.log(e)
    })
  },
  to_user: function () {
    window.location.href = "index.html"
  },
  to_manager: function () {
    window.location.href = "manager.html"
  },
  handle: function () {
    this.refresh()
    switch (id) {
      case 1 :
        let c = $('#choose input[name="result"]:checked ').val()
        let c_int
        if (c === "win") {
          c_int = 0
        } else if(c === "flat") {
          c_int = 1
        } else {
          c_int = 2
        }
        const amount = parseInt(document.getElementById('amount').value)
        //alert(amount)
        let g
        Game.deployed().then(function (instance) {
          g = instance
          return g.play(c_int, {from: account, gas:3000000, value:web3.toWei(amount, 'ether')})
        }).then(function () {
          document.getElementById("amount").value = ""
          alert("Pay successfully!")
        }).catch(function (e) {
          console.log(e)
        })
        break
      default :
        alert("You can not play now!")
    }
  },
  clear: function () {
    document.getElementById('amount').value = ""
  },
  withdraw: function () {
    this.refresh()
    switch (id) {
      case 1 :
        let g
        let side = prompt("Please input the side you quiz(0/1/2)", "0")
        Game.deployed().then(function (instance) {
          g = instance
          return g.userWithdrawBySide(parseInt(side), {from : account, gas : 3000000})
        }).then(function () {
          alert("Withdraw successfully!")
        }).catch(function (e) {
          alert("Withdraw Fail!")
          console.log(e)
        })
        break
      default :
        alert("You can not withdraw now!")
    }


  },
  help: function () {
    alert("1. When you see the team name is 'Please with', the quiz is " +
             "not begin.\n" +
          "2. Select the result you predict(win->0,flat->1,lose->2)\n" +
          "3. Input you amount(uint ether)")
  }
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

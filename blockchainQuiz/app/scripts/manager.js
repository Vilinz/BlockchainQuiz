// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import gameCoinArtfact from '../../build/contracts/Game.json'
import dataCoinArtfact from '../../build/contracts/MyDataBase.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
// const MetaCoin = contract(metaCoinArtifact)
const Game = contract(gameCoinArtfact)
const Data = contract(dataCoinArtfact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let id = 0
let manager = 0
let state

const App = {
  start: function () {
    const self = this
    Game.setProvider(web3.currentProvider)
    Data.setProvider(web3.currentProvider)
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
    self.refresh()
    self.get_manager()
  },
  //get the manager of the contract
  get_manager: function () {
    let game
    Game.deployed().then(function (instance) {
      game = instance
      return game.getManager.call()
    }).then(function(address){
      manager = address.toString()
    }).catch(function(e) {
      console.log(e)
    })
  },
  refresh: function() {
    //init
    let game

    Game.deployed().then(function (instance) {
      game = instance
      return game.getInfo.call({from: account})
    }).then(function (info) {
      if(info !== undefined) {
        let arr = info.toString().split(",")
        document.getElementById("m_main_team").innerText = arr[0]
        document.getElementById("m_next_team").innerText = arr[1]
        state = parseInt(arr[2])
        let temp
        if(arr[2] === "0") {
          temp = "Quiz Initial!"
        } else if(arr[2] === "1") {
          temp = "Quiz Playing!"
        } else if(arr[2] === "2") {
          temp = "Quiz Closed!"
        } else {
          temp = "Quiz End!"
        }
        document.getElementById("current").innerText = "State: " + temp
        document.getElementById("game_id").innerText = "Game's id: " + arr[3]
        id = parseInt(arr[3])
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
  reset: function () {
    this.refresh()
    switch (state) {
      case 3 :
        let game
        Game.deployed().then(function (instance) {
          game = instance
          return game.reset({from: account, gas:3000000})
        }).then(function () {
          alert("Reset successfully!")
        }).catch(function (e) {
          console.log(e)
        })
        break
      default:
        alert("You cannot reset when the quiz is not finish!")
    }
  },
  begin: function () {
    this.refresh()
    switch (state) {
      case 0 :
        let game
        Game.deployed().then(function (instance) {
          game = instance
          return game.start_betting({from: account, gas:3000000})
        }).then(function () {
          document.getElementById("current").innerText = "State: Quiz Playing"
        }).catch(function (e) {
          console.log(e)
        })
        break
      default:
        alert("Begin fail!")
    }
  },
  close: function () {
    this.refresh()
    switch (state) {
      case 1:
        let game
        Game.deployed().then(function (instance) {
          game = instance
          return game.close_bet({from: account, gas:3000000})
        }).then(function () {
          document.getElementById("current").innerText = "State: Quiz Closed"
        }).catch(function (e) {
          console.log(e)
        })
        break
      default:
        alert("Close fail!")
    }
  },
  query: function () {
    this.refresh()
    switch (state) {
      case 2:
        let game, data, arr
        let result_int = 0

        Data.deployed().then(function (instance) {
          data = instance
          return data.queryResult.call(id)
        }).then(function (value) {
          arr = value.toString().split(",")
          result_int = parseInt(arr[2])
        }).catch(function (e) {
          console.log(e)
        })
        Game.deployed().then(function (instance) {
          game = instance
          return game.Settlement(0,{from: account, gas:3000000})
        }).then(function (value) {
          document.getElementById("current").innerText = "State: Quiz End!"
        }).catch(function (e) {
          console.log(e)
        })
        break
      default:
        alert("Query fail!")
    }
  },

  cancle: function () {
    this.refresh()
    switch (state) {
      case 1:
        let game
        Game.deployed().then(function (instance) {
          game = instance
          return game.managerWithdrawAll({from: account, gas:3000000})
        }).then(function () {
          document.getElementById("current").innerText = "State: aAlready Withdraw"
        }).catch(function (e) {
          console.log(e)
        })
        break
      default:
        alert("Cancle fail!")
    }
  },
  help: function() {
    alert("1. A game must be designed in strict order.\n" +
          "2. If you find some alerts, you click the wrong button\n" +
          "3. Order: reset->set->start->close->query->cancle.")
  },
  back: function() {
    window.location.href = "index.html"
  },
  /* 显示登录窗口 */
  showMinLogin: function shogMinLogin(){
    switch (state) {
      case 0 :
        let mini_login = document.getElementsByClassName("mini_login")[0];
        let cover = document.getElementsByClassName("cover")[0];
        mini_login.style.display = "block";
        cover.style.display = "block";

        mini_login.style.left = (document.body.scrollWidth - mini_login.scrollWidth) / 2 + "px";
        mini_login.style.top = (document.body.scrollHeight - mini_login.scrollHeight) / 2 + "px";
        break
      default:
        alert("You can not set information now!")
    }

  },
   /* 关闭登录窗口 */
  closeLogin: function closeLogin(){
      let mini_login = document.getElementsByClassName("mini_login")[0];
      let cover = document.getElementsByClassName("cover")[0];
      mini_login.style.display = "none";
      cover.style.display = "none";
  },
  /* 移动登录窗口 */
  moveLogin: function moveLogin(event) {
    let moveable = true;

    //获取事件源
    event = event ? event : window.event;
    let clientX = event.clientX;
    let clientY = event.clientY;

    let mini_login = document.getElementById("mini_login");
    console.log(mini_login);
    let top = parseInt(mini_login.style.top);
    let left = parseInt(mini_login.style.left);//鼠标拖动
    document.onmousemove = function (event) {
      if (moveable) {
        event = event ? event : window.event;
        let y = top + event.clientY - clientY;
        let x = left + event.clientX - clientX;
        if (x > 0 && y > 0) {
          mini_login.style.top = y + "px";
          mini_login.style.left = x + "px";
        }
      }
    }
    //鼠标弹起
    document.onmouseup = function(){
      moveable = false;
    }
  },
  get_info_and_close: function () {
    let team0 = document.getElementById("info_main").value
    let team1 = document.getElementById("info_next").value
    let game
    if((team0 === "")||(team1 === "")) {
      alert("The team name cannot be empty. Setup failed.")
      this.closeLogin()
      return
    }
    this.closeLogin()
    id += 1

    Game.deployed().then(function (instance) {
      game = instance
      return game.info(team0, team1, id, {from:account, gas:3000000})
    }).then(function () {
      alert("set success")
      document.getElementById("m_main_team").innerText = team0
      document.getElementById("m_next_team").innerText = team1
      document.getElementById("game_id").innerText = "Game's id: " + id
    }).catch(function (e) {
      console.log(e)
    })
    document.getElementById("current").innerText = "State: Quiz Initial!"
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

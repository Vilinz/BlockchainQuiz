pragma solidity ^0 .4.23;
/*
 * database to storage result
 * 1->0, 2->1, 3->2
 * only manger can add data to database
*/
contract MyDataBase{
	address manager;
	//each game is a contarct, using its' address to find its' result
	mapping(uint256 => string) public result;

	constructor(address a) public {
		manager = a;
	}

	//function to storage result
	function addResult(uint256 i, string t0) public {
		require(msg.sender == manager);
		result[i] = t0;
	}

	//function to change result
	function changeResult(uint256 i, string t0) public {
		require(msg.sender == manager);
		result[i] = t0;
	}

	//function to query a game's result
	function queryResult(uint256 a) public view returns (string) {
		return result[a];
	}

	function getManager() public view returns (address) {
		return manager;
	}
}
var Data = artifacts.require('./MyDataBase.sol')

module.exports = function (deployer) {
  deployer.deploy(Data, "0xC2e9C45883B29c00ba3490568941e4FD027C9a4a")
}

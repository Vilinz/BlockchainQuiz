# 区块链竞猜系统

## 功能描述

这个系统功能完善，包括

- 可以对足球比赛的三种结果（赢，平，负）进行竞猜，只要你有钱包，那么你就可以参与到其中来，对足球比赛的结果进行预测。
- 这个系统有三种角色，分别是合约管理者，竞猜参与者，数据库管理者。合约管理者负责对合约进行管理，具体一点来说就是负责管理对赛事初始化，赛事的发布，赛事的关闭，结算，开始另一场比赛等等，当合约的管理者并不能对数据库进行直接的修改，这避免了技术上的操盘行为的发生；竞猜参与者是指有账户的用户，只要你有一个钱包，你就可以参与其中，这种角色主要的权限是参与比赛已经可以从数据库

- 工具

  软件：WebStorm

  语言：javascript，jquery，html，css，solidity

  其他工具及其版本

  - nodejs：v9.2.0
  - Truffle：v5.0.0
  - 其他如python，node-gyp，scripts等等

- 实验所用的框架

  - truffle

    Truffle是针对基于以太坊的Solidity语言的一套开发框架。本身基于Javascript。

    - 首先对客户端做了深度集成。开发，测试，部署一行命令都可以搞定。不用再记那么多环境地址，繁重的配置更改，及记住诸多的命令。
    - 它提供了一套类似`maven`或`gradle`这样的项目构建机制，能自动生成相关目录，默认是基于Web的。当前这个打包机制是自定义的，比较简陋，不与当前流行打包方案兼容。但自已称会弃用，与主流兼容，好在它也支持自定义打包流程。
    - 提供了合约抽象接口，可以直接通过`var meta = MetaCoin.deployed();`拿到合约对象后，在`Javascript`中直接操作对应的合约函数。原理是使用了基于`web3.js`封装的`Ether Pudding`工具包。简化开发流程。
    - 提供了控制台，使用框架构建后，可以直接在命令行调用输出结果，可极大方便开发调试。
    - 提供了监控合约，配置变化的自动发布，部署流程。不用每个修改后都重走整个流程。

    参考：

    [truffle](http://truffle.tryblockchain.org/)

    [truffle](https://truffleframework.org/docs/getting_started/installation)


## 使用说明

为了使用这个系统，你需要做以下准备：

- 安装Ganache-cli的GUI或者CLI界面，为了方便测试，CLI界面看起来更加直观，启动Ganache-cli。

- 系统中有完整的一套可以运行truffle的环境。

- 在Google浏览器安装Metamask以太坊钱包，并且import Ganache-cli的账户。

- 注意端口号的匹配，这个实验我们使用的是8545端口

- 命令

  ```
  truffle compile
  truffle migrate
  npm run dev
  ```



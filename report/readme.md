# 区块链竞猜系统

## 选题背景

- 背景

  在足球比赛期间，我们听的最多的就是彩票，而买彩票离不开我们所说的竞猜系统。传统中心化的竞猜平台存在可供参与竞猜产品单一、平台运营的不透明、法律风险高和平台等痛点，不可篡改、去中心化的区块链似乎与竞猜、博彩行业不谋而合，体育竞猜市场庞大，开发区块链体育竞猜的项目更不少见。随着区块链技术的成熟，去中心的竞猜系统慢慢地开始替代这种中心化的竞猜系统。今年世界杯的竞猜也出现了Octopaul等基于区块链的博彩平台。本实验致力于开发一个针对足球赛事的去中心化的区块链竞猜系统，能够完成基本的对于足球结果的竞猜，只要你有一个区块链的钱包，那么你就可以参与到这个系统当中。这个系统公开透明，数据库的管理与合约管理这两个部分分权管理，避免了中心化对赛事结果进行操盘的可能。

- 功能描述

  这个系统功能完善，包括

  - 可以对足球比赛的三种结果（赢，平，负）进行竞猜，只要你有钱包，那么你就可以参与到其中来，对足球比赛的结果进行预测。
  - 这个系统有三种角色，分别是合约管理者，竞猜参与者，数据库管理者。合约管理者负责对合约进行管理，具体一点来说就是负责管理对赛事初始化，赛事的发布，赛事的关闭，结算，开始另一场比赛等等，当合约的管理者并不能对数据库进行直接的修改，这避免了技术上的操盘行为的发生；竞猜参与者是指有账户的用户，只要你有一个钱包，你就可以参与其中，这种角色主要的权限是参与比赛已经可以从数据库中查询比赛的结果，这也是系统公开透明的一部分；最后是数据库的管理者，其主要的权限是往数据库中添加数据记录，不直接参与到竞猜这个过程。

## 框架

![](https://github.com/Vilinz/BlockchainQuiz/blob/master/report/pictures/frame.jpg)

说明：第一个为主界面，另外三个是针对不同角色的页面，不同角色在页面中所具有的权限也不一样。

## 实验过程

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

- 实验过程


## 实验结果

- 主页面

  ![](https://github.com/Vilinz/BlockchainQuiz/blob/master/report/pictures/index.png)

  主界面对应着三个按钮，分别进入三个不同的页面。

- 竞猜参与者

  ![](https://github.com/Vilinz/BlockchainQuiz/blob/master/report/pictures/user.jpg)

  这个页面是用户进行投注的页面。

- 合约管理者

  ![](https://github.com/Vilinz/BlockchainQuiz/blob/master/report/pictures/set_end.jpg)

  这个是合约管理者才能进入的页面。

- 数据库

  ![](https://github.com/Vilinz/BlockchainQuiz/blob/master/report/pictures/database.jpg)

  这个页面提供了数据库的插入，修改和查询功能。

## 使用说明

## 测试
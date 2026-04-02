// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title YuanCombined
 * @dev 深度整合了银行、代币、域名与钱包逻辑的统一协议
 */
contract YuanCombined {
    address public bankOwner; // 对应 SimpleWallet 的 owner 逻辑
    uint256 public constant DOMAIN_COST = 1 ether; // 对齐 SimpleDomainRegistry 的 1 ETH 成本
    uint256 public constant TOKEN_PER_ETH = 1000;  // 1 ETH 兑换 1000 个代币单位

    // 状态变量
    string public bankName = "Yuan Private Bank";
    mapping(address => uint256) public ethBalances;   // 银行 ETH 账本
    mapping(address => uint256) public tokenBalances; // SimpleToken 逻辑的代币账本
    mapping(string => address) public domainToAddress; // 域名 -> 地址
    mapping(address => string) public addressToDomain; // 地址 -> 域名

    // 事件：对齐四份代码的所有日志需求
    event Deposit(address indexed user, uint256 amount, uint256 tokensIssued);
    event Withdraw(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event DomainRegistered(address indexed user, string domain);
    event DomainTransferred(address indexed from, address indexed to, string domain);

    constructor() {
        bankOwner = msg.sender;
    }

    // --- 1. 域名系统 (整合 SimpleDomainRegistry 完整功能) ---
    function registerDomain(string memory _domain) public payable {
        // 逻辑：支付 1 ETH 注册，且域名唯一
        require(msg.value >= DOMAIN_COST, "Insufficient registration fee (Need 1 ETH)");
        require(domainToAddress[_domain] == address(0), "Domain name already registered.");
        
        domainToAddress[_domain] = msg.sender;
        addressToDomain[msg.sender] = _domain;

        emit DomainRegistered(msg.sender, _domain);
    }

    // 新增：SimpleDomainRegistry 里的域名转让功能
    function transferDomain(address _receiver, string memory _domain) public {
        require(domainToAddress[_domain] == msg.sender, "Only the domain name owner can transfer.");
        
        domainToAddress[_domain] = _receiver;
        addressToDomain[_receiver] = _domain;
        delete addressToDomain[msg.sender]; // 原主释放

        emit DomainTransferred(msg.sender, _receiver, _domain);
    }

    // --- 2. 银行功能 (整合 SimpleWallet 逻辑) ---
    function deposit() public payable {
        require(msg.value > 0, "Must send ETH.");
        
        // 记录 ETH 余额
        ethBalances[msg.sender] += msg.value;
        
        // 核心逻辑：存入 ETH 自动获得代币 (SimpleToken 的初始化/分发变体)
        uint256 tokensToIssue = msg.value * TOKEN_PER_ETH;
        tokenBalances[msg.sender] += tokensToIssue;

        emit Deposit(msg.sender, msg.value, tokensToIssue);
    }

    function withdraw(uint256 _amount) public {
        // 逻辑：只能取走自己存在银行里的钱
        require(ethBalances[msg.sender] >= _amount, "Not enough funds.");
        
        ethBalances[msg.sender] -= _amount;
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");

        emit Withdraw(msg.sender, _amount);
    }

    // --- 3. 货币功能 (整合 SimpleToken 的自由转账逻辑) ---
    // 原先只有余额映射，现在加上了转账函数，实现“我的货币”流通
    function transferToken(address _receiver, uint256 _amount) public {
        require(_amount <= tokenBalances[msg.sender], "Insufficient balance.");
        
        tokenBalances[msg.sender] -= _amount;
        tokenBalances[_receiver] += _amount;
        
        emit Transfer(msg.sender, _receiver, _amount);
    }

    // --- 4. 管理员功能 (对应 SimpleWallet 的合约所有权提现) ---
    function withdrawBankFees() public {
        // 逻辑：只有合约部署者可以取走所有的注册费收入
        require(msg.sender == bankOwner, "Only the contract owner can withdraw.");
        payable(bankOwner).transfer(address(this).balance);
    }

    // --- 5. 钱包查询 (整合 Ethers Logic 状态查询) ---
    function getAccountInfo(address _user) public view returns (
        string memory domain, 
        uint256 ethBal, 
        uint256 tokenBal
    ) {
        return (addressToDomain[_user], ethBalances[_user], tokenBalances[_user]);
    }
}
pragma solidity >=0.4.21 <0.6.0;

contract SupplyChain {
    
    struct company {
        string cname; // 公司名字
        address caddress; // 公司地址
        bool ctype; // 公司类型
        uint cbalance;
    }
    
    struct receipt {
        string rfrom; // 欠款人
        string rto; // 收款人
        address rfromAddress; //欠款人地址
        address rtoAddress; //收款人地址
        uint amount; // 金额
        uint endtime; // 还款期限
        bool rstatus;
    }
    
    address public BANK;
    
    mapping(address => company) public companyMap;
    mapping(address => receipt[]) public receiptMap;
    
    company[] companyList;
    
    constructor () public {
        BANK = msg.sender;
        companyMap[msg.sender].caddress = 0xdBD30b47CDEB6F785FB80C39cb7f3e2cd7De1228;
        companyMap[msg.sender].cname = "BANK";
        companyMap[msg.sender].ctype = true;
        companyMap[msg.sender].cbalance = 10000;
    }
    
    function addCompany (string memory cname, address caddress, bool ctype, uint cbalance) public {
        //require(companyMap[msg.sender].ctype == true);
        for (uint i = 0; i < companyList.length; i++) {
            if (caddress == companyList[i].caddress) {
                //return (false, "Company exists! Add company failed!");
            }
        }
        company storage newCompany = companyMap[caddress];
        newCompany.cname = cname;
        newCompany.caddress = caddress;
        newCompany.ctype = ctype;
        newCompany.cbalance = cbalance;
        companyList.push(newCompany);
        //return (true, "Add company successfully!");
    }

    function getName (address caddress) public view returns (string memory) {
        return companyMap[caddress].cname;
    }
    
    function getBalance (address caddress) public view returns (uint) {
        return companyMap[caddress].cbalance;
    }
    
    function signReceipt (address caddress, uint amount, uint time) public {
        address seller = msg.sender;
        address buyer = caddress;
        receiptMap[buyer].push(receipt({
            rfrom: companyMap[seller].cname,
            rto: companyMap[buyer].cname,
            rfromAddress: companyMap[seller].caddress,
            rtoAddress: companyMap[buyer].caddress,
            amount: amount,
            endtime: now + time,
            rstatus: true
        }));
        
        //return (true, "Sign receipt successfully!");
    }
    
    function transferReceipt (address caddress, uint amount, uint rid) public {
        address rf = msg.sender;
        address rt = caddress;
        
        receiptMap[rt].push(receipt({
            rfrom: receiptMap[rf][rid].rfrom,
            rto: companyMap[rt].cname,
            rfromAddress: receiptMap[rf][rid].rfromAddress,
            rtoAddress: companyMap[rt].caddress,
            amount: amount,
            endtime: receiptMap[rf][rid].endtime,
            rstatus: true
        }));
        receiptMap[rf][rid].amount -= amount;
        //return (true, "Transfer receipt successfully!");
    }
    
    function financing (uint rid) public {
        receiptMap[BANK].push(receipt({
            rfrom: receiptMap[msg.sender][rid].rfrom,
            rto: companyMap[BANK].cname,
            rfromAddress: receiptMap[msg.sender][rid].rfromAddress,
            rtoAddress: companyMap[BANK].caddress,
            amount: receiptMap[msg.sender][rid].amount,
            endtime: receiptMap[msg.sender][rid].endtime,
            rstatus: true
        }));
        receiptMap[msg.sender][rid].rstatus = false;
        companyMap[BANK].cbalance -= receiptMap[msg.sender][rid].amount;
        companyMap[msg.sender].cbalance += receiptMap[msg.sender][rid].amount;
        //return (true, "Financing successfully!");
    }
    
    function payDebt() public {
        for (uint i = 0; i < receiptMap[msg.sender].length; i++) {
            if (receiptMap[msg.sender][i].rstatus == true && receiptMap[msg.sender][i].rtoAddress == msg.sender) {
                companyMap[receiptMap[msg.sender][i].rfromAddress].cbalance -= receiptMap[msg.sender][i].amount;
                companyMap[msg.sender].cbalance += receiptMap[msg.sender][i].amount;
                //property[receiptMap[msg.sender][i].rfromAddress] -= receiptMap[msg.sender][i].amount;
                //property[msg.sender] += receiptMap[msg.sender][i].amount;
                receiptMap[msg.sender][i].rstatus = false;
            }
        }
        //return (true, "Pay debt successfully!");
    }

    function getReceiptrfrom (address caddress, uint rid) public view returns (string memory) {
        return receiptMap[caddress][rid].rfrom;
    }

    function getReceiptrto (address caddress, uint rid) public view returns (string memory) {
        return receiptMap[caddress][rid].rto;
    }

    function getReceiptamount (address caddress, uint rid) public view returns (uint) {
        return receiptMap[caddress][rid].amount;
    }

    function getReceiptrstatus (address caddress, uint rid) public view returns (bool) {
        return receiptMap[caddress][rid].rstatus;
    }
}
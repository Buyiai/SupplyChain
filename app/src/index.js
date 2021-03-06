import Web3 from "../node_modules/web3";
import "../src/index.css";

let accounts;
let company;

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function() {
        const { web3 } = this;

        try {
            this.meta = new web3.eth.Contract(
                [{ "constant": false, "inputs": [], "name": "payDebt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "caddress", "type": "address" }, { "name": "rid", "type": "uint256" }], "name": "getReceiptrstatus", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "BANK", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "receiptMap", "outputs": [{ "name": "rfrom", "type": "string" }, { "name": "rto", "type": "string" }, { "name": "rfromAddress", "type": "address" }, { "name": "rtoAddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "endtime", "type": "uint256" }, { "name": "rstatus", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "caddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "rid", "type": "uint256" }], "name": "transferReceipt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "cname", "type": "string" }, { "name": "caddress", "type": "address" }, { "name": "ctype", "type": "bool" }, { "name": "cbalance", "type": "uint256" }], "name": "addCompany", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "caddress", "type": "address" }], "name": "getName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "caddress", "type": "address" }, { "name": "rid", "type": "uint256" }], "name": "getReceiptrfrom", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "caddress", "type": "address" }, { "name": "rid", "type": "uint256" }], "name": "getReceiptrto", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "rid", "type": "uint256" }], "name": "financing", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "companyMap", "outputs": [{ "name": "cname", "type": "string" }, { "name": "caddress", "type": "address" }, { "name": "ctype", "type": "bool" }, { "name": "cbalance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "caddress", "type": "address" }, { "name": "rid", "type": "uint256" }], "name": "getReceiptamount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "caddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "time", "type": "uint256" }], "name": "signReceipt", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "caddress", "type": "address" }], "name": "getBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }],
                0xff3ddaf1cf0aade533b9e3e37c9a1d8cbc28fb7e,
            );

            // get accounts
            accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
            company = accounts[0];
            console.log(accounts);
            this.refreshName();
            this.refreshBalance();
            const addressElement = document.getElementById("account-address");
            addressElement.innerHTML = this.account;

            document.getElementById('add').style.display = "none";
            document.getElementById('sign').style.display = "none";
            document.getElementById('transfer').style.display = "none";
            document.getElementById('financing').style.display = "none";
            document.getElementById('pay').style.display = "none";
            document.getElementById('receipt').style.display = "none";

        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    changeAccount: function() {
        const account_id = parseInt(document.getElementById('account-input').value);
        const addressElement = document.getElementById("account-address");
        this.account = accounts[account_id];
        addressElement.innerHTML = this.account;
        this.refreshName();
        this.refreshBalance();
    },

    addCompany: async function() {
        const cname = document.getElementById("add-cname").value;
        const caddress = document.getElementById("add-caddress").value;
        const ctype = document.getElementById("add-ctype").value;
        const cbalance = document.getElementById("add-cbalance").value;
        this.setStatus("Adding company...", "status0");
        const { addCompany } = this.meta.methods;
        await addCompany(cname, caddress, ctype, cbalance).send({ from: this.account, gas: 6721975 });
        this.setStatus("Add company successfully!", "status0");
    },

    signReceipt: async function() {
        const caddress = document.getElementById("sign-caddress").value;
        const amount = parseInt(document.getElementById("sign-amount").value);
        const time = parseInt(document.getElementById("sign-time").value);
        this.setStatus("Signing receipt...", "status1");
        const { signReceipt } = this.meta.methods;
        await signReceipt(caddress, amount, time).send({ from: this.account, gas: 6721975 });
        this.setStatus("Sign receipt successfully!", "status1");
        this.refreshBalance();
    },

    transferReceipt: async function() {
        const caddress = document.getElementById("transfer-caddress").value;
        const amount = parseInt(document.getElementById("transfer-amount").value);
        const rid = parseInt(document.getElementById("transfer-rid").value);
        this.setStatus('Transfering receipt...', "status2");
        const { transferReceipt } = this.meta.methods;
        await transferReceipt(caddress, amount, rid).send({ from: this.account, gas: 6721975 });
        this.refreshBalance();
        this.setStatus('Transfer receipt successfully!', "status2");
    },

    financing: async function() {
        const rid = parseInt(document.getElementById("financing-rid").value);
        this.setStatus('Financing...', "status3");
        const { financing } = this.meta.methods;
        await financing(rid).send({ from: this.account, gas: 6721975 });
        this.refreshBalance();
        this.setStatus('Financing successfully!', "status3");
    },

    payDebt: async function() {
        this.setStatus('Paying debt...', "status4");
        const { payDebt } = this.meta.methods;
        await payDebt().send({ from: this.account, gas: 6721975 });
        this.refreshBalance();
        this.setStatus('Pay debt successfully!', "status4");
    },

    refreshBalance: async function() {
        const { getBalance } = this.meta.methods;
        const balance = await getBalance(this.account).call();
        //console.log(balance);
        const balanceElement = document.getElementById("balance");
        balanceElement.innerHTML = balance;
    },

    refreshName: async function() {
        const { getName } = this.meta.methods;
        const name = await getName(this.account).call();
        //console.log(name);
        const nameElement = document.getElementById("name");
        nameElement.innerHTML = name;
    },

    setStatus: function(message, statusStr) {
        const status = document.getElementById(statusStr);
        status.innerHTML = message;
    },

};

const Nav = {
    addCompany: function() {
        document.getElementById('add').style.display = "block";
        document.getElementById('sign').style.display = "none";
        document.getElementById('transfer').style.display = "none";
        document.getElementById('financing').style.display = "none";
        document.getElementById('pay').style.display = "none";
        document.getElementById('receipt').style.display = "none";
    },

    signReceipt: function() {
        document.getElementById('add').style.display = "none";
        document.getElementById('sign').style.display = "block";
        document.getElementById('transfer').style.display = "none";
        document.getElementById('financing').style.display = "none";
        document.getElementById('pay').style.display = "none";
        document.getElementById('receipt').style.display = "block";
    },

    transferReceipt: function() {
        document.getElementById('add').style.display = "none";
        document.getElementById('sign').style.display = "none";
        document.getElementById('transfer').style.display = "block";
        document.getElementById('financing').style.display = "none";
        document.getElementById('pay').style.display = "none";
        document.getElementById('receipt').style.display = "block";
    },

    financing: function() {
        document.getElementById('add').style.display = "none";
        document.getElementById('sign').style.display = "none";
        document.getElementById('transfer').style.display = "none";
        document.getElementById('financing').style.display = "block";
        document.getElementById('pay').style.display = "none";
        document.getElementById('receipt').style.display = "block";
        document.getElementById('receipt').style.display = "block";
    },

    payDebt: function() {
        document.getElementById('add').style.display = "none";
        document.getElementById('sign').style.display = "none";
        document.getElementById('transfer').style.display = "none";
        document.getElementById('financing').style.display = "none";
        document.getElementById('pay').style.display = "block";
        document.getElementById('receipt').style.display = "block";
    }
}

window.App = App;
window.Nav = Nav;

window.addEventListener("load", function() {

    if (typeof web3 != 'undefined') {
        App.web3 = new Web3(web3.currentProvider);
    } else {
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    App.start();
});
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Web3 from "web3";
import UserAuthABI from "../../abis/UserAuth.json";
import NodeRegistryABI from "../../abis/NodeRegistry.json";
import EthCrypto from 'eth-crypto';
import { stringify } from '@angular/compiler/src/util';


const UserAuthAddress = "0xD6EdB74B8aF9E856b73289Ec3d40863443469900";
const NodeRegistryAddress = "0xC01e4B38B315f55771A8B01f83FF81a97cb2f404"
const ChainId = 80001;


@Component({
  selector: 'app-mvp',
  templateUrl: './mvp.component.html',
  styleUrls: ['./mvp.component.css']
})
export class MVPComponent implements OnInit {
  public walletAddress: any;
  web3?: Web3;

  public userinfo: any = undefined;

  public mode: string = "user";

  constructor() {
    
  }

  async ngOnInit() {
    await this.connectAccount();
    this.RefreshNodeListings();
  }

  public async connectAccount() {
    if (!this.walletAddress) {
      if (!Web3.givenProvider) {
        console.error("No WEB3");
        return;
      }

      // Here we actually want to create a real web3
      this.web3 = new Web3(Web3.givenProvider);

      let provider = this.web3.currentProvider;
      // @ts-ignore
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x"+ChainId.toString(16) }], // chainId must be in hexadecimal numbers
      });

      // let accounts = await this.web3.eth.requestAccounts();
      // this.walletAddress = accounts[0];

      // @ts-ignore
      const ethereum = (window as any).ethereum;
      this.walletAddress = ethereum.selectedAddress;

      ethereum.on('accountsChanged', async (accounts: any) => {
        this.walletAddress = accounts[0];
        await this.updateAuthed();
      })

      // this.walletAddress = this.web3.currentProvider.selectedAddress;

      console.log("Connected");

      await this.updateAuthed();

      // const message = "test message";
      // const signed_message: any = await new Promise((resolve, reject) => {
      //   // @ts-ignore
      //   this.web3.currentProvider.sendAsync({
      //     method: 'personal_sign',
      //     params: [this.web3!.utils.utf8ToHex(message), this.walletAddress],
      //     from: this.walletAddress,
      //   }, (err: any, response: any) => {
      //     if(err) return reject(err);
      //     resolve(response.result);
      //   });
      // });
      
      // let signing_wallet = EthCrypto.recover(signed_message, this.web3.eth.accounts.hashMessage(message));
      // console.log(signing_wallet);
    }
  }


  private getUserAuthContract() {
    // @ts-ignore
    let contract = new this.web3!.eth.Contract(UserAuthABI.abi, UserAuthAddress);
    return contract;
  }


  private getNodeRegistryContract() {
    // @ts-ignore
    let contract = new this.web3!.eth.Contract(NodeRegistryABI.abi, NodeRegistryAddress);
    return contract;
  }


  private async updateAuthed() {
    let contract = this.getUserAuthContract();
    let balance = await contract.methods.balanceOf(this.walletAddress).call();
    let authed = balance > 0;

    if (authed) {
      let tokenId = Web3.utils.keccak256(Web3.utils.encodePacked(this.walletAddress)!);
      this.userinfo = await contract.methods.GetUserInfo(tokenId).call();
      console.log(this.userinfo);
    }
  }

  public async register(name: string, uri: string) {
    let contract = this.getUserAuthContract();
    let tx = await contract.methods.Register(name, uri).send({from: this.walletAddress});
  }

  public async registerNode(name: string) {
    let contract = this.getNodeRegistryContract();
    let tx = await contract.methods.RegisterNode(name, "12.34.56.78", 5555).send({from: this.walletAddress});
    this.RefreshNodeListings();
  }

  nodes: any[] = [];
  public async RefreshNodeListings() {
    let contract = this.getNodeRegistryContract();
    let result = await contract.methods.NodeList().call();
    this.nodes = result;
  }

  public userRegistration() {
    this.mode = "user";
  }

  public nodeListing() {
    this.mode = "nodes";
  }

  public joinNode(node: any) {
    // console.log(node);
    alert("MetHex.Connect( '" + node.ip + ":" + node.port +" ');");
  }


  public changingURI: boolean = false;

  public async changeURI(uri: string) {
    let tokenId = Web3.utils.keccak256(Web3.utils.encodePacked(this.walletAddress)!);
    let contract = this.getUserAuthContract();
    let tx = await contract.methods.SetURI(tokenId, uri).send({from: this.walletAddress});

    this.userinfo.uri = uri;
    this.changingURI = false;
  }

  public myNode(node: any) {
    return node.owner.toUpperCase() == this.walletAddress.toUpperCase();
  }

  public async removeNode(event: Event, node: any) {
    event.stopPropagation();
    let contract = this.getNodeRegistryContract();
    console.log(node.id);
    let tx = await contract.methods.RemoveNode(node.id).send({from: this.walletAddress});
    this.RefreshNodeListings();
  }
}

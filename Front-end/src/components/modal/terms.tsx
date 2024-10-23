import { Modal,Button } from "antd";
import {  trace } from "../../../utils/tools";
//import scss
import "./terms.scss";


interface TermsProps {
    callback: (code: number, data?: any) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const Terms = ({ callback }:TermsProps) : JSX.Element =>{
    trace('Continue',open);
    // const {userInfo} = store.getState();

    const handleClose = () => {
        console.log('close');
        callback(0)
    }

    const toContinue = ()=>{
        callback(1);
    }
    
    return(
    <Modal 
        zIndex={2}
       title="Terms of Sale"
       open={true}
       afterClose={handleClose}
       onCancel={handleClose}
       width="980px"
       
       footer={null}
       keyboard={false}
       centered
       style={{maxWidth:"95%"}}
     >
       <div className="container">

       
        <div className="content">
            {/* <div 
                style={{
                    color: "#FFFFFF99",
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "25.11px",
                    textAlign: "left"
                }}
            >Terms of Sale</div> */}
            <div className="h-scroll terms-con" style={{
                // background: "#FFFFFF1A",
                borderRadius: "20px",
                padding: "42px 32px",
                marginTop: "16px",
                fontFamily: "Poppins",
                fontSize: 16,
                fontWeight: 800,
                lineHeight: "20.8px",
                color:"white",
                textAlign: "left",
                maxHeight: 'calc(100vh - 346px)',
                overflowY: 'auto'
            }}>
                
                <p className="c9"><span className="c1"></span></p>
                    
                    <p className="c7">
                    <span className="c10">Effective Date:</span><span>&nbsp;9/15/2024</span>
                    </p>
                    <h2 className="c3" id="h.9rxvotkvptk0">
                    <span className="c5">1. Introduction</span>
                    </h2>
                    <p className="c7">
                    <span className="c1"
                        >Welcome to the Hooyah Hoos Token Sale. By participating in this sale,
                        you agree to these terms and conditions. Hoos tokens (&quot;Hoos&quot;
                        or &quot;Tokens&quot;) are purchased in connection with Hooyah&#39;s
                        Web3 gaming platform (&quot;Hooyah&quot; or &quot;Company&quot;).
                    </span>
                    </p>
                    <h2 className="c3" id="h.6tka0g9qj1jq">
                    <span className="c5">2. Definitions</span>
                    </h2>
                    <ul className="c8 lst-kix_x5034h5agjac-0 start">
                    <li className="c4 li-bullet-0">
                        <span className="c10">Token Sale:</span
                        ><span className="c1"
                        >&nbsp;The private or public sale of Hoos tokens conducted by
                        Hooyah.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c10">Buyer:</span
                        ><span className="c1"
                        >&nbsp;An individual or entity that purchases Hoos tokens during the
                        Token Sale.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c10">Smart Contract:</span
                        ><span className="c1"
                        >&nbsp;The automated contract deployed on the Solana blockchain for
                        the Token Sale.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c10">Tokenomics:</span
                        ><span className="c1"
                        >&nbsp;The economic model and distribution plan for Hoos tokens as
                        detailed in the Hooyah whitepaper.</span
                        >
                    </li>
                    </ul>
                    <h2 className="c3" id="h.quun4y4qr10j">
                    <span className="c5">3. Token Sale Details</span>
                    </h2>
                    <h3 className="c2" id="h.dmo4pcyrp1vu">
                    <span className="c6">3.1 Sale Period</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >The Token Sale will commence on 9/15/2024 and end on 4/15/2025, unless
                        terminated earlier or extended at Hooyah&rsquo;s sole discretion.</span
                    >
                    </p>
                    <h3 className="c2" id="h.zd4lyvtlg9lw">
                    <span className="c6">3.2 Token Price</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >The price of Hoos tokens is 30 cents per token. The price may vary
                        based on the sale phase or additional discounts offered.</span
                    >
                    </p>
                    <h3 className="c2" id="h.sgrdtj8ftj6f">
                    <span className="c6">3.3 Minimum Purchase</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >The minimum purchase amount for Hoos tokens is $500 or its
                        equivalent.</span
                    >
                    </p>
                    <h3 className="c2" id="h.b50oog45t91g">
                    <span className="c6">3.4 Payment Method</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >Payments must be made in Sol, Ethereum, USDT, USDC, Bitcoin. Payments
                        in other currencies are not accepted.</span
                    >
                    </p>
                    <h3 className="c2" id="h.hkayxu837vho">
                    <span className="c6">3.5 Allocation and Distribution</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >Hoo tokens will be allocated to the Buyer&rsquo;s wallet address upon
                        receipt of payment, subject to the smart contract&#39;s rules. The
                        distribution will occur within [5] days after the end of the Token
                        Sale.</span
                    >
                    </p>
                    <h2 className="c3" id="h.8w5oid5r0tuq">
                    <span className="c5">4. Use of Tokens</span>
                    </h2>
                    <h3 className="c2" id="h.lh9m76ju76mn"><span className="c6">4.1 Utility</span></h3>
                    <p className="c7">
                    <span className="c1"
                        >Hoo tokens are utility tokens used within the Hooyah gaming ecosystem.
                        They provide access to certain in-game features, purchases, and other
                        benefits as described in the Hooyah whitepaper.</span
                    >
                    </p>
                    <h3 className="c2" id="h.lph2vsxqqdub">
                    <span className="c6">4.2 Restrictions</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >Hoo tokens may not be used for any unlawful purpose and are subject to
                        restrictions as outlined in the Hooyah whitepaper and these Terms of
                        Sale.</span
                    >
                    </p>
                    <h2 className="c3" id="h.k2gnn26ipkqo">
                    <span className="c5">5. Buyer Representations and Warranties</span>
                    </h2>
                    <p className="c7">
                    <span className="c1"
                        >By purchasing Hoo tokens, the Buyer represents and warrants that:</span
                    >
                    </p>
                    <ul className="c8 lst-kix_rzpe8gcnbnql-0 start">
                    <li className="c4 li-bullet-0">
                        <span className="c1"
                        >They have the legal capacity and authority to enter into these Terms
                        of Sale.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c1"
                        >They are not a resident or citizen of a country where the sale or
                        purchase of Hoos tokens is prohibited.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c1"
                        >They understand the risks associated with purchasing Hoos tokens,
                        including the potential loss of their investment.</span
                        >
                    </li>
                    </ul>
                    <h2 className="c3" id="h.naw5xb472gus"><span className="c5">6. Risks</span></h2>
                    <p className="c7">
                    <span className="c1">The Buyer acknowledges and accepts that:</span>
                    </p>
                    <ul className="c8 lst-kix_k6spqqdpycj5-0 start">
                    <li className="c4 li-bullet-0">
                        <span className="c1"
                        >The purchase of Hoo tokens involves substantial risk and may result
                        in the loss of the entire investment.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c1"
                        >The value of Hoo tokens may fluctuate significantly.</span
                        >
                    </li>
                    <li className="c4 li-bullet-0">
                        <span className="c1"
                        >The regulatory environment for cryptocurrencies and tokens is
                        evolving and may affect the value and legality of Hoo tokens.</span
                        >
                    </li>
                    </ul>
                    <h2 className="c3" id="h.b3vpemht3la4">
                    <span className="c5">7. Refunds and Cancellations</span>
                    </h2>
                    <h3 className="c2" id="h.5ouwflh1aftv"><span className="c6">7.1 Refunds</span></h3>
                    <p className="c7">
                    <span className="c1"
                        >All purchases of Hoo tokens are final and non-refundable, except as
                        required by law or at Hooyah&#39;s discretion.</span
                    >
                    </p>
                    <h3 className="c2" id="h.4pa3vncsbv5j">
                    <span className="c6">7.2 Cancellations</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >Hooyah reserves the right to cancel or reject any purchase of Hoos
                        tokens at its sole discretion.</span
                    >
                    </p>
                    <h2 className="c3" id="h.w7lfb8tn30gh">
                    <span className="c5">8. Intellectual Property</span>
                    </h2>
                    <p className="c7">
                    <span className="c1"
                        >Hooyah retains all rights, title, and interest in and to all
                        intellectual property related to Hooyah and Hoo tokens. The Buyer does
                        not acquire any intellectual property rights through the purchase of
                        Hoos tokens.</span
                    >
                    </p>
                    <h2 className="c3" id="h.rwumqtk3eltq">
                    <span className="c5">9. Limitation of Liability</span>
                    </h2>
                    <p className="c7">
                    <span className="c1"
                        >To the fullest extent permitted by law, Hooyah and its affiliates shall
                        not be liable for any indirect, incidental, consequential, or punitive
                        damages arising out of or in connection with the purchase or use of Hoos
                        tokens.</span
                    >
                    </p>
                    <h2 className="c3" id="h.rg6nyltpjysz">
                    <span className="c5">10. Governing Law and Dispute Resolution</span>
                    </h2>
                    <h3 className="c2" id="h.rb3iium6y7zx">
                    <span className="c6">10.1 Governing Law</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >These Terms of Sale shall be governed by and construed in accordance
                        with the laws of [Jurisdiction].</span
                    >
                    </p>
                    <h3 className="c2" id="h.hzixsbxww61o">
                    <span className="c6">10.2 Dispute Resolution</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >Any disputes arising out of or in connection with these Terms of Sale
                        shall be resolved through binding arbitration in the British Virgin
                        Islands, in accordance with the rules of arbitration.</span
                    >
                    </p>
                    <h2 className="c3" id="h.f163ignvhe86">
                    <span className="c5">11. Miscellaneous</span>
                    </h2>
                    <h3 className="c2" id="h.u881mw5qylgu">
                    <span className="c6">11.1 Amendments</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >Hooyah reserves the right to amend these Terms of Sale at any time.
                        Updated terms will be posted on the Hooyah website.</span
                    >
                    </p>
                    <h3 className="c2" id="h.pyv1226lrc99">
                    <span className="c6">11.2 Entire Agreement</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >These Terms of Sale constitute the entire agreement between the parties
                        concerning the purchase of Hoos tokens and supersede all prior
                        agreements and understandings.</span
                    >
                    </p>
                    <h3 className="c2" id="h.cso6mx6zju41">
                    <span className="c6">11.3 Severability</span>
                    </h3>
                    <p className="c7">
                    <span className="c1"
                        >If any provision of these Terms of Sale is found to be invalid or
                        unenforceable, the remaining provisions shall remain in full force and
                        effect.</span
                    >
                    </p>
                    <hr />
                    <p className="c9"><span className="c1"></span></p>
                    <p className="c7">
                    <span className="c1"
                        >By participating in the Token Sale, you acknowledge that you have read,
                        understood, and agree to these Terms of Sale.</span
                    >
                    </p>
                    <p className="c7">
                    <span className="c1"
                        >For any questions or further information, please contact Hooyah at
                        support@hooyah.io.</span
                    >
                    </p>
                    <p className="c9"><span className="c1"></span></p>
            </div>
        </div>
       

         <div style={{
            marginTop: "24px",
            textAlign: "center",
         }}>
           <Button className="title-btn" style={{height:62,    maxHeight: '12vw',maxWidth: '45%'}} type="primary"   onClick={toContinue}>
                I Agree
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default Terms;
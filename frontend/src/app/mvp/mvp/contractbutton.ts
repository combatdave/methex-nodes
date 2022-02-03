import { ReplaySubject } from "rxjs";

export enum State {NotStarted, TxInProgress, TxComplete, Error}

export class ContractInteraction {
    
    public state: State = State.NotStarted;
    public data: any;

    public onStateChange: ReplaySubject<State> = new ReplaySubject<State>();

    private tx: any;
    public startTx(tx: any) {
        if (this.state != State.NotStarted) {
            return;
        }
        this.tx = tx;
        this.blah();
    }

    public get canStartTx() {
        return this.state == State.NotStarted;
    }

    private blah() {
        this.state = State.TxInProgress;

        this.tx.on('confirmation', (confNumber: any, receipt: any) => {
            if (confNumber == 1) {
                if (this.state == State.TxInProgress) {
                    this.state = State.TxComplete;
                    this.onStateChange.next(this.state);
                    this.onStateChange.complete();
                }
            }
        });
      
        this.tx.on('error', (error: any) => {
            if (this.state == State.TxInProgress) {
                this.state = State.Error;
                this.onStateChange.next(this.state);
                this.onStateChange.complete();
            }
        });
    }
}
export class PlayerAction {
    action: string;
    player_name: string;
    amount: number | null;

    constructor(action: string, player_name: string, amount: number | null){
        this.action = action;
        this.player_name = player_name;
        this.amount = amount;
    }
}
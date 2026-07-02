import { Injectable, signal, computed, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Table } from '../models/tableModel';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { PlayerAction } from 'app/models/playerActionModel';
import { GameSummaryModel, RoundPlayerSummary, RoundSummaryModel } from 'app/models/roundSummaryModel';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private socket!: Socket;
  private connectPromise: Promise<void> | null = null;

  private router = inject(Router);

  // signal qui stocke la liste de parties en attente
  tableList$ = signal<Table[]>([]);
  currentTable$ = signal<Table | null>(null);
  roundSummary$ = signal<RoundSummaryModel | null>(null);
  gameSummary$ = signal<GameSummaryModel | null>(null);
  username$ = signal<string>(localStorage.getItem('username') || '');
  token$ = signal<string | null>(localStorage.getItem('token') || null);
  lastPlayerAction$ = signal<PlayerAction | null>(null)

  // état de connexion
  private _connected = signal(false);
  connected = computed(() => this._connected());

  private async ensureConnected(): Promise<void> {
    if (this.username$()){
      if (!this.connected()) {
        await this.connect();
      }
    }
    else {
      this.router.navigate(['/'])
    }
  }

  connect(): Promise<void> {
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = new Promise((resolve) => {
      if (environment.IS_PROD) {
        this.socket = io('/', {
          auth: { username: this.username$(), token: this.token$() },
          path: environment.BACK_URL,
          transports: ['websocket'],
          reconnection: true,
        });
      } else {
        this.socket = io(environment.BACK_URL, {
          auth: { username: this.username$(), token: this.token$() },
          transports: ['websocket'],
          reconnection: true,
        });
      }

      this.socket.on('connect', () => {
        this._connected.set(true);
        resolve();
      });

      this.socket.on('disconnect', () => {
        this._connected.set(false);
        this.connectPromise = null; // allow reconnection
      });

      // écoute des messages

      this.socket.on('auth_token', (data: any) => {
        localStorage.setItem('token', data.token);
        this.token$.set(data.token);
      });

      this.socket.on('error', (err: any) => {
        console.error('Socket error:', err);
      });

      this.socket.on('joined_table', (data: any) => {
        const current = this.currentTable$();
        // console.log('joined_table event received:', data);
        if (!current) return;

        if (data.entered) {
          const updatedPlayers = [...current.players, data.player];
          this.currentTable$.set(
            new Table(
              current.table_id,
              data.host_name,
              current.table_cards,
              current.has_started,
              current.pot,
              updatedPlayers,
              current.current_player_name,
              current.small_blind_value,
              current.big_blind_value,
              current.small_blind_player_name,
              current.big_blind_player_name,
            ),
          );
        } else {
          const updatedPlayers = current.players.filter(
            (p) => p.player_name !== data.player.player_name,
          );
          this.currentTable$.set(
            new Table(
              current.table_id,
              data.host_name,
              current.table_cards,
              current.has_started,
              current.pot,
              updatedPlayers,
              current.current_player_name,
              current.small_blind_value,
              current.big_blind_value,
              current.small_blind_player_name,
              current.big_blind_player_name,
            ),
          );
        }
      });

      this.socket.on('game_started', (data: any) => {
        const current = this.currentTable$();
        // console.log('game_started event received:', data);
        if (!current) return;

        this.currentTable$.set(
          new Table(
            current.table_id,
            data.host_name,
            data.table_cards,
            data.has_started,
            data.pot,
            data.players,
            data.current_player_name,
            data.small_blind_value,
            data.big_blind_value,
            data.small_blind_player_name,
            data.big_blind_player_name,
          ),
        );
        this.router.navigate(['/game', current.table_id]);
      });

      this.socket.on('player_action', (data: any) => {
        const current = this.currentTable$();
        if (!current) return;

        const table_data = data.table;
        
        this.currentTable$.set(
          new Table(
            current.table_id,
            current.host_name,
            table_data.table_cards,
            table_data.has_started,
            table_data.pot,
            table_data.players,
            table_data.current_player_name,
            table_data.small_blind_value,
            table_data.big_blind_value,
            table_data.small_blind_player_name,
            table_data.big_blind_player_name,
          ),
        );

        this.lastPlayerAction$.set(
          new PlayerAction(
            data.action,
            data.player.player_name,
            data.amount
          )
        );
      });

      this.socket.on('end_round', (data: any) => {
        // console.log(data)
        let players : RoundPlayerSummary[] = []
        for (let player of data.players){
          players.push({
            player_name : player.player_name,
            hand : player.hand
          })
        }
        this.roundSummary$.set({
          round_number : null,
          winner_name : data.winners[0].player_name,
          pot : data.pot,
          community_cards : data.table_cards,
          players : players
        })
        // TODO : handle end of round logic, e.g., show winner, reset bets, etc.
      });

      this.socket.on('next_round', (data: any) => {
        const current = this.currentTable$();
        if (!current) return;

        const table_data = data.table;
        
        this.currentTable$.set(
          new Table(
            current.table_id,
            current.host_name,
            table_data.table_cards,
            table_data.has_started,
            table_data.pot,
            table_data.players,
            table_data.current_player_name,
            table_data.small_blind_value,
            table_data.big_blind_value,
            table_data.small_blind_player_name,
            table_data.big_blind_player_name,
          ),
        );
      })

      this.socket.on('end_game', (data: any) => {
        this.gameSummary$.set({
          winner_name : data.player_name,
          winner_chips : data.chips
        })
      })
    });
    return this.connectPromise;
  }

  // emit events
  async joinTable(tableId: number): Promise<void> {
    await this.ensureConnected();
    const response = await this.socket?.emitWithAck('join_table', { table_id: tableId });
    // console.log('joinTable response:', response);
    if (response) {
      const table: Table = new Table(
        response.table_id,
        response.host_name,
        response.table_cards,
        response.has_started,
        response.pot,
        response.players,
        response.current_player_name,
        response.small_blind_value,
        response.big_blind_value,
        response.small_blind_player_name,
        response.big_blind_player_name,
      );
      this.currentTable$.set(table);
    } else this.currentTable$.set(null);
    // console.log('currentTable$ after joinTable:', this.currentTable$());
  }

  async listTables(): Promise<void> {
    await this.ensureConnected();
    const response = await this.socket?.emitWithAck('list_tables');
    const tables: Table[] = response.tables.map(
      (t: any) =>
        new Table(
          t.table_id,
          t.host_name,
          t.table_cards,
          t.has_started,
          t.pot,
          t.players,
          t.current_player_name,
          t.small_blind_value,
          t.big_blind_value,
          t.small_blind_player_name,
          t.big_blind_player_name,
        ),
    );
    this.tableList$.set(tables);
  }

  async createTable(): Promise<void> {
    await this.ensureConnected();
    const response = await this.socket?.emitWithAck('create_table');
    // console.log('createTable response:', response);
    const table: Table = new Table(
      response.table_id,
      response.host_name,
      response.table_cards,
      response.has_started,
      response.pot,
      response.players,
      response.current_player_name,
      response.small_blind_value,
      response.big_blind_value,
      response.small_blind_player_name,
      response.big_blind_player_name,
    );
    this.currentTable$.set(table);
  }

  clearTables(): void {
    this.tableList$.set([]);
  }

  async leaveTable(tableId: number): Promise<void> {
    await this.ensureConnected();
    const response = await this.socket?.emitWithAck('quit_table', { table_id: tableId });
    // console.log('leaveTable response:', response);
    this.currentTable$.set(null);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this._connected.set(false);
  }

  async startGame(tableId: number): Promise<void> {
    this.socket?.emit('start_game', { table_id: tableId });
  }

  async call(tableId: number): Promise<void> {
    this.socket?.emit('call', { table_id: tableId });
  }

  async fold(tableId: number): Promise<void> {
    this.socket?.emit('fold', { table_id: tableId });
  }

  async raise(tableId: number, amount: number): Promise<void> {
    this.socket?.emit('raise', { table_id: tableId, amount });
  }

  async allIn(tableId: number): Promise<void> {
    this.socket?.emit('all_in', { table_id: tableId });
  }

  async readyForNextRound(tableId: number): Promise<void> {
    this.socket?.emit('round_ready', { table_id: tableId });
  }
}

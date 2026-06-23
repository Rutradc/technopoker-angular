import { Injectable, signal, computed } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Table } from '../models/tableModel';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private socket!: Socket;

  // signal qui stocke la liste de parties en attente
  tableList$ = signal<Table[]>([]);
  currentTable$ = signal<Table | null>(null);

  // état de connexion
  private _connected = signal(false);
  connected = computed(() => this._connected());

  connect(): void {
    this.socket = io('localhost:4587', {
        auth: { 'username': localStorage.getItem('username') },
        transports: ['websocket'],
        reconnection: true
    });

    this.socket.on('connect', () => {
        this._connected.set(true);
    });

    this.socket.on('disconnect', () => {
      this._connected.set(false);
    });

    // écoute des messages
    this.socket.on('joined_table', (data: any) => {
      const current = this.currentTable$();
      console.log('joined_table event received:', data);
      if (!current)
        return;

      if (data.entered) {
        const updatedPlayers = [...current.players, data.player];
        this.currentTable$.set(
          new Table(
            current.table_id,
            data.host_name,
            current.table_cards,
            current.pot,
            updatedPlayers
          )
        );
      } else {
        const updatedPlayers = current.players.filter((p) => p.player_name !== data.player.player_name);
        this.currentTable$.set(
          new Table(
            current.table_id,
            data.host_name,
            current.table_cards,
            current.pot,
            updatedPlayers
          )
        );
      }
    });

    this.socket.on('game_started', (data: any) => {
      const current = this.currentTable$();
      console.log('game_started event received:', data);
      if (!current) return;

      this.currentTable$.set(
        new Table(current.table_id, data.host_name, data.table_cards, data.pot, data.players),
      );
    });

    this.socket.on('cards_dealt', (data: any) => {
      const current = this.currentTable$();
      console.log('cards_dealt event received:', data);
      if (!current) return;

      const updatedPlayers = current.players.map((p) =>
        p.player_name === localStorage.getItem('username') ? { ...p, hand: data.hand } : p,
      );
      this.currentTable$.set(
        new Table(
          current.table_id,
          current.host_name,
          current.table_cards,
          current.pot,
          updatedPlayers,
        ),
      );
    });
  }

  // emit events
  async joinTable(tableId: number): Promise<void> {
    const response = await this.socket?.emitWithAck('join_table', { table_id: tableId });
    console.log('joinTable response:', response);
    if (response) {
      const table: Table = new Table(
        response.table_id,
        response.host_name,
        response.table_cards,
        response.pot,
        response.players
      );
      this.currentTable$.set(table);
    }
    else
      this.currentTable$.set(null);
    console.log('currentTable$ after joinTable:', this.currentTable$());
  }

  async listTables(): Promise<void> {
    const response = await this.socket?.emitWithAck('list_tables');
    const tables: Table[] = response.tables.map((t: any) =>
      new Table(
        t.table_id,
        t.host_name,
        t.table_cards,
        t.pot,
        t.players
      )
    );
    this.tableList$.set(tables);
  }

  async createTable(): Promise<void> {
    const response = await this.socket?.emitWithAck('create_table');
    console.log('createTable response:', response);
    const table: Table =  
      new Table(
        response.table_id,
        response.host_name,
        response.table_cards,
        response.pot,
        response.players
      );
    this.currentTable$.set(table);
  }

  clearTables(): void {
    this.tableList$.set([]);
  }

  async leaveTable(): Promise<void> {
    const response = await this.socket?.emitWithAck('quit_table');
    console.log('leaveTable response:', response);
    this.currentTable$.set(null);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this._connected.set(false);
  }
}
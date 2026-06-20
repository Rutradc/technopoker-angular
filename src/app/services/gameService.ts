import { Injectable, signal, computed } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { TableInfo } from '../models/tableModel';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket!: Socket;

  // signal qui stocke la liste de parties en attente
  private _tableList = signal<TableInfo[]>([]);
  private _currentTableInfo = signal<TableInfo | null>(null);

  // lecture publique (read-only)
  tableList = computed(() => this._tableList());
  currentTableInfo = computed(() => this._currentTableInfo());

  // état de connexion
  private _connected = signal(false);
  connected = computed(() => this._connected());

  connect(url: string): void {
    this.socket = io(url, {
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
      const table: TableInfo = new TableInfo(
        data.table_id,
        data.num_players,
        data.host_name
      )
      this._currentTableInfo.set(table);
    });
    this.socket.on('list_tables', (data: any) => {
        const tables: TableInfo[] = data.tables.map((t: any) =>
            new TableInfo(
                t.table_id,
                t.num_players,
                t.host_name
            )
        );
        this._tableList.set(tables);
    });
  }

  // emit events
  joinTable(tableId: number): void {
    this.socket?.emit('join_table', { table_id: tableId });
  }
  createTable(): void {
    this.socket?.emit('create_table');
  }

  clearTables(): void {
    this._tableList.set([]);
  }

  leaveTable(): void {
    this._currentTableInfo.set(null);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this._connected.set(false);
  }
}
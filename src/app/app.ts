import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from "./composants/card/card";
import { Table } from "./composants/table/table";
import { MenuScreen } from "./pages/menu-screen/menu-screen";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Card, Table, MenuScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('technopoker');
}

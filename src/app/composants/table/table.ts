import { Component } from '@angular/core';
import { Card } from "../card/card";

@Component({
  selector: 'app-table',
  imports: [Card],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {}

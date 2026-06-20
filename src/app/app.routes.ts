import { Routes } from '@angular/router';
import { GamesList } from './pages/games-list/games-list';
import { GameWaitingRoom } from './pages/game-waiting-room/game-waiting-room';
import { MenuScreen } from './pages/menu-screen/menu-screen';
import { GameView } from './pages/game-view/game-view';

export const routes: Routes = [
  { path: '', component: MenuScreen },
  { path: 'tables', component: GamesList },
  { path: 'table/:id', component: GameWaitingRoom },
  { path: 'game/:id', component: GameView }
];
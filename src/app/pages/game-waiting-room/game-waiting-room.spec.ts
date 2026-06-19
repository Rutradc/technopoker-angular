import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWaitingRoom } from './game-waiting-room';

describe('GameWaitingRoom', () => {
  let component: GameWaitingRoom;
  let fixture: ComponentFixture<GameWaitingRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameWaitingRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(GameWaitingRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

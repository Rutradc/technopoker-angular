import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSummary } from './game-summary';

describe('GameSummary', () => {
  let component: GameSummary;
  let fixture: ComponentFixture<GameSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(GameSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display winner chips and a leave button', () => {
    component.summary = {
      round_number: 1,
      winner_name: 'Alice',
      pot: 150,
      community_cards: [],
      players: [
        { player_name: 'Alice', hand: [], chips: 250 },
        { player_name: 'Bob', hand: [], chips: 120 },
      ],
    };

    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Alice');
    expect(content).toContain('250 jetons');
    expect(content).toContain('Quitter la table');
  });
});

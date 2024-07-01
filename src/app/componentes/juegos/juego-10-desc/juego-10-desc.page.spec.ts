import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego10DescPage } from './juego-10-desc.page';

describe('Juego10DescPage', () => {
  let component: Juego10DescPage;
  let fixture: ComponentFixture<Juego10DescPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Juego10DescPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
